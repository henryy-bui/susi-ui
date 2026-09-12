import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Popover, PopoverClose, PopoverContent, PopoverPortal, PopoverTrigger } from '../Popover';

function Example(props: React.ComponentProps<typeof Popover>) {
  return (
    <>
      <button>outside</button>
      <Popover {...props}>
        <PopoverTrigger>Open</PopoverTrigger>
        <PopoverPortal>
          <PopoverContent aria-label="Details">
            <span>Popover body</span>
            <PopoverClose>Close</PopoverClose>
          </PopoverContent>
        </PopoverPortal>
      </Popover>
    </>
  );
}

describe('Popover', () => {
  it('toggles from the trigger and reflects state on it', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Open' });
    expect(trigger).toHaveAttribute('aria-expanded', 'false');

    await userEvent.click(trigger);
    expect(screen.getByRole('dialog', { name: 'Details' })).toBeInTheDocument();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(trigger).toHaveAttribute('aria-controls', screen.getByRole('dialog').id);

    await userEvent.click(trigger);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('closes on Escape, outside click and the close button', async () => {
    const { rerender } = render(<Example />);

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'outside' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    rerender(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('is positioned absolutely by the positioning engine', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toHaveStyle({ position: 'absolute' });
  });

  it('does not trap focus unless asked to', async () => {
    render(<Example modal={false} />);
    await userEvent.click(screen.getByRole('button', { name: 'Open' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(document.body.contains(screen.getByRole('button', { name: 'outside' }))).toBe(true);
  });
});
