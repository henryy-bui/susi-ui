import { describe, expect, it } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Tooltip,
  TooltipContent,
  TooltipPortal,
  TooltipProvider,
  TooltipTrigger,
} from '../Tooltip';

function Example({ delayDuration = 0 }: { delayDuration?: number }) {
  return (
    <TooltipProvider>
      <Tooltip delayDuration={delayDuration}>
        <TooltipTrigger>Save</TooltipTrigger>
        <TooltipPortal>
          <TooltipContent>Saves your work</TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  );
}

describe('Tooltip', () => {
  it('opens on hover and describes its trigger', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Save' });
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await userEvent.hover(trigger);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    expect(trigger).toHaveAccessibleDescription('Saves your work');

    await userEvent.unhover(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('waits for the delay before opening', async () => {
    render(<Example delayDuration={200} />);
    await userEvent.hover(screen.getByRole('button', { name: 'Save' }));

    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument(), { timeout: 1000 });
  });

  it('opens on keyboard focus and closes on Escape', async () => {
    render(<Example />);
    await userEvent.tab();

    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('hides when the trigger is pressed', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Save' });

    await userEvent.hover(trigger);
    await waitFor(() => expect(screen.getByRole('tooltip')).toBeInTheDocument());

    await userEvent.click(trigger);
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('ignores pointer events on non-hoverable content', async () => {
    render(<Example />);
    await userEvent.hover(screen.getByRole('button', { name: 'Save' }));
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveStyle({ pointerEvents: 'none' }));
  });
});
