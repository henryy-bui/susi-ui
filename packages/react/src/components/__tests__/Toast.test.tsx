import { useState } from 'react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '../Toast';

function Example({
  duration,
  onOpenChange,
  ...toastProps
}: React.ComponentProps<typeof Toast> & { providerDuration?: number } = {}) {
  return (
    <ToastProvider duration={5000} swipeThreshold={50}>
      <Toast duration={duration} onOpenChange={onOpenChange} {...toastProps}>
        <ToastTitle>Saved</ToastTitle>
        <ToastDescription>Your changes are live.</ToastDescription>
        <ToastAction altText="Undo from the history menu">Undo</ToastAction>
        <ToastClose aria-label="Dismiss">×</ToastClose>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

// A test that installs fake timers and then fails would otherwise leave them
// installed, hanging every later test that awaits userEvent.
afterEach(() => vi.useRealTimers());

describe('Toast', () => {
  it('renders inside a labelled live region', () => {
    render(<Example />);

    const viewport = screen.getByRole('region', { name: /Notifications \(F8\)/ });
    expect(viewport).toHaveAttribute('aria-live', 'polite');
    expect(viewport.tagName).toBe('OL');

    const toast = screen.getByRole('alert');
    expect(toast).toHaveTextContent('Saved');
    expect(viewport).toContainElement(toast);
  });

  it('announces politely for background toasts', () => {
    render(<Example type="background" />);
    const toast = screen.getByRole('status');
    expect(toast).toHaveAttribute('aria-live', 'polite');
  });

  it('dismisses itself after the duration', () => {
    vi.useFakeTimers();
    const onOpenChange = vi.fn();
    render(<Example duration={1000} onOpenChange={onOpenChange} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => void vi.advanceTimersByTime(999));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    act(() => void vi.advanceTimersByTime(1));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it('never auto-dismisses with an infinite duration', () => {
    vi.useFakeTimers();
    render(<Example duration={Infinity} />);
    act(() => void vi.advanceTimersByTime(60_000));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('pauses the timer while the viewport is hovered', () => {
    // fireEvent rather than userEvent: its awaited delays don't mix well with
    // fake timers, and pausing is a plain pointer-enter/leave behaviour.
    vi.useFakeTimers();
    render(<Example duration={1000} />);
    const viewport = screen.getByRole('region');

    act(() => void vi.advanceTimersByTime(600));
    fireEvent.pointerEnter(viewport);

    // Time passes, but the toast is paused.
    act(() => void vi.advanceTimersByTime(5000));
    expect(screen.getByRole('alert')).toBeInTheDocument();

    fireEvent.pointerLeave(viewport);
    // Only the remaining 400ms are left to run.
    act(() => void vi.advanceTimersByTime(399));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    act(() => void vi.advanceTimersByTime(1));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('closes from the close button and the action', async () => {
    const { unmount } = render(<Example duration={Infinity} />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    unmount();

    render(<Example duration={Infinity} />);
    const action = screen.getByRole('button', { name: 'Undo' });
    expect(action).toHaveAttribute('data-alt-text', 'Undo from the history menu');
    await userEvent.click(action);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('keeps the toast open for an action marked keepOpen', async () => {
    render(
      <ToastProvider duration={Infinity}>
        <Toast>
          <ToastTitle>Uploading</ToastTitle>
          <ToastAction altText="Retry later" keepOpen>
            Retry
          </ToastAction>
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Retry' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('closes on Escape, unless the consumer prevents it', async () => {
    const { unmount } = render(<Example duration={Infinity} />);
    screen.getByRole('alert').focus();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    unmount();

    render(<Example duration={Infinity} onEscapeKeyDown={(event) => event.preventDefault()} />);
    screen.getByRole('alert').focus();
    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('supports controlled open state', async () => {
    function Controlled() {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button onClick={() => setOpen(true)}>Show</button>
          <ToastProvider duration={Infinity}>
            <Toast open={open} onOpenChange={setOpen}>
              <ToastTitle>Controlled</ToastTitle>
              <ToastClose aria-label="Dismiss">×</ToastClose>
            </Toast>
            <ToastViewport />
          </ToastProvider>
        </>
      );
    }

    render(<Controlled />);
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Show' }));
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('dismisses on a swipe past the threshold and springs back below it', () => {
    const onSwipeEnd = vi.fn();
    const onSwipeCancel = vi.fn();
    const { unmount } = render(
      <Example duration={Infinity} onSwipeEnd={onSwipeEnd} onSwipeCancel={onSwipeCancel} />,
    );

    let toast = screen.getByRole('alert');
    fireEvent.pointerDown(toast, { button: 0, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(toast, { clientX: 30, clientY: 0 });
    expect(toast).toHaveAttribute('data-swipe', 'move');
    expect(toast).toHaveStyle({ '--susi-toast-swipe-move-x': '30px' });

    // 30px is short of the 50px threshold, so it stays.
    fireEvent.pointerUp(toast, { clientX: 30, clientY: 0 });
    expect(onSwipeCancel).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('alert')).toHaveAttribute('data-swipe', 'cancel');
    unmount();

    render(<Example duration={Infinity} onSwipeEnd={onSwipeEnd} />);
    toast = screen.getByRole('alert');
    fireEvent.pointerDown(toast, { button: 0, clientX: 0, clientY: 0 });
    fireEvent.pointerMove(toast, { clientX: 80, clientY: 0 });
    fireEvent.pointerUp(toast, { clientX: 80, clientY: 0 });

    expect(onSwipeEnd).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('ignores movement against the swipe direction', () => {
    render(<Example duration={Infinity} />);
    const toast = screen.getByRole('alert');

    fireEvent.pointerDown(toast, { button: 0, clientX: 100, clientY: 0 });
    fireEvent.pointerMove(toast, { clientX: 20, clientY: 0 });
    expect(toast).toHaveAttribute('data-swipe', 'start');

    fireEvent.pointerUp(toast, { clientX: 20, clientY: 0 });
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('focuses the viewport on the hotkey', async () => {
    render(<Example duration={Infinity} />);
    await userEvent.keyboard('{F8}');
    await waitFor(() => expect(screen.getByRole('region')).toHaveFocus());
  });
});
