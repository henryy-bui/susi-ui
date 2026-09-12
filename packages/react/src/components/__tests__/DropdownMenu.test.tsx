import { useState } from 'react';
import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../DropdownMenu';

function Example({ onSelect }: { onSelect?: (event: Event) => void } = {}) {
  // Item state is owned by the consumer: the content unmounts when the menu
  // closes, so anything uncontrolled would reset between openings.
  const [hidden, setHidden] = useState(true);
  const [sort, setSort] = useState('name');

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
      <DropdownMenuPortal>
        <DropdownMenuContent>
          <DropdownMenuItem onSelect={onSelect}>New file</DropdownMenuItem>
          <DropdownMenuItem>Duplicate</DropdownMenuItem>
          <DropdownMenuItem disabled>Archive</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem checked={hidden} onCheckedChange={setHidden}>
            Show hidden
            <DropdownMenuItemIndicator data-testid="check" />
          </DropdownMenuCheckboxItem>
          <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
            <DropdownMenuRadioItem value="name">Sort by name</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="date">Sort by date</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
}

describe('DropdownMenu', () => {
  it('opens from the trigger and focuses the first item', async () => {
    render(<Example />);
    const trigger = screen.getByRole('button', { name: 'Actions' });
    expect(trigger).toHaveAttribute('aria-haspopup', 'menu');

    await userEvent.click(trigger);
    const menu = screen.getByRole('menu');
    expect(menu).toHaveAttribute('aria-labelledby', trigger.id);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'New file' })).toHaveFocus());
  });

  it('opens with ArrowUp focused on the last item', async () => {
    render(<Example />);
    screen.getByRole('button', { name: 'Actions' }).focus();
    await userEvent.keyboard('{ArrowUp}');

    await waitFor(() =>
      expect(screen.getByRole('menuitemradio', { name: 'Sort by date' })).toHaveFocus(),
    );
  });

  it('moves with arrow keys, skipping disabled items, and wraps', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'New file' })).toHaveFocus());

    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();

    // 'Archive' is disabled, so it is skipped.
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('menuitemcheckbox')).toHaveFocus();

    await userEvent.keyboard('{ArrowUp}{ArrowUp}');
    expect(screen.getByRole('menuitem', { name: 'New file' })).toHaveFocus();
  });

  it('jumps to an item by typing', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'New file' })).toHaveFocus());

    await userEvent.keyboard('du');
    expect(screen.getByRole('menuitem', { name: 'Duplicate' })).toHaveFocus();
  });

  it('selects with Enter, closes, and restores focus to the trigger', async () => {
    const onSelect = vi.fn();
    render(<Example onSelect={onSelect} />);
    const trigger = screen.getByRole('button', { name: 'Actions' });

    await userEvent.click(trigger);
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'New file' })).toHaveFocus());
    await userEvent.keyboard('{Enter}');

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('stays open when a consumer prevents the default on select', async () => {
    render(<Example onSelect={(event) => event.preventDefault()} />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

    await userEvent.click(screen.getByRole('menuitem', { name: 'New file' }));
    expect(screen.getByRole('menu')).toBeInTheDocument();
  });

  it('toggles a checkbox item and reports the change', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));

    const checkbox = screen.getByRole('menuitemcheckbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('check')).toBeInTheDocument();

    await userEvent.click(checkbox);
    // Selecting an item closes the menu, and the consumer's state has flipped.
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menuitemcheckbox')).toHaveAttribute('aria-checked', 'false');
    expect(screen.queryByTestId('check')).not.toBeInTheDocument();
  });

  it('tracks the selected radio item', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menuitemradio', { name: 'Sort by name' })).toHaveAttribute(
      'aria-checked',
      'true',
    );

    await userEvent.click(screen.getByRole('menuitemradio', { name: 'Sort by date' }));
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    expect(screen.getByRole('menuitemradio', { name: 'Sort by date' })).toHaveAttribute(
      'aria-checked',
      'true',
    );
  });

  it('closes on Escape', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('button', { name: 'Actions' }));
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
