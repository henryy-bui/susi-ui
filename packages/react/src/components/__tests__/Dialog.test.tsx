import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from '../Dialog';

function Example(props: React.ComponentProps<typeof Dialog>) {
  return (
    <Dialog {...props}>
      <DialogTrigger>Open</DialogTrigger>
      <DialogPortal>
        <DialogOverlay data-testid="overlay" />
        <DialogContent>
          <DialogTitle>Delete project</DialogTitle>
          <DialogDescription>This cannot be undone.</DialogDescription>
          <button>Confirm</button>
          <DialogClose>Cancel</DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

describe('Dialog', () => {
  it('opens from the trigger and is labelled by its title and description', async () => {
    render(<Example />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    const dialog = screen.getByRole('dialog', { name: 'Delete project' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAccessibleDescription('This cannot be undone.');
  });

  it('moves focus into the dialog and restores it on close', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open' });

    await userEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('button', { name: 'Confirm' })).toHaveFocus());

    await userEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('traps Tab inside the content', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));

    const confirm = screen.getByRole('button', { name: 'Confirm' });
    const cancel = screen.getByRole('button', { name: 'Cancel' });

    await waitFor(() => expect(confirm).toHaveFocus());
    await userEvent.tab();
    expect(cancel).toHaveFocus();
    await userEvent.tab();
    expect(confirm).toHaveFocus();
    await userEvent.tab({ shift: true });
    expect(cancel).toHaveFocus();
  });

  it('closes on Escape and on an outside pointer down', async () => {
    const onOpenChange = vi.fn();
    const { rerender } = render(<Example onOpenChange={onOpenChange} />);

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(<Example onOpenChange={onOpenChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByTestId('overlay'));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('locks body scroll while a modal dialog is open', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(document.body).toHaveStyle({ overflow: 'hidden' });

    await userEvent.keyboard('{Escape}');
    expect(document.body).not.toHaveStyle({ overflow: 'hidden' });
  });

  it('lets a consumer cancel Escape dismissal', async () => {
    render(
      <Dialog defaultOpen>
        <DialogPortal>
          <DialogContent onEscapeKeyDown={(event) => event.preventDefault()}>
            <DialogTitle>Sticky</DialogTitle>
          </DialogContent>
        </DialogPortal>
      </Dialog>,
    );

    await userEvent.keyboard('{Escape}');
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });
});
