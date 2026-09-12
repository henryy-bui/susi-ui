import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectLabel,
  SelectPortal,
  SelectTrigger,
  SelectValue,
  SelectViewport,
} from '../Select';

const FRUITS = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

function Example(props: React.ComponentProps<typeof Select>) {
  return (
    <Select {...props}>
      <SelectTrigger aria-label="Fruit">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectPortal>
        <SelectContent>
          <SelectViewport>
            <SelectGroup>
              <SelectLabel>Fruit</SelectLabel>
              {FRUITS.map((fruit) => (
                <SelectItem key={fruit.value} value={fruit.value} disabled={fruit.value === 'cherry'}>
                  <SelectItemText>{fruit.label}</SelectItemText>
                  <SelectItemIndicator data-testid={`indicator-${fruit.value}`} />
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectViewport>
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}

describe('Select', () => {
  it('shows the placeholder until something is selected', () => {
    render(<Example />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });
    expect(trigger).toHaveTextContent('Pick a fruit');
    expect(trigger).toHaveAttribute('data-placeholder', '');
    expect(trigger).toHaveAttribute('aria-expanded', 'false');
  });

  it('opens a labelled listbox and marks the selection', async () => {
    render(<Example defaultValue="banana" />);
    const trigger = screen.getByRole('combobox', { name: 'Fruit' });

    await userEvent.click(trigger);
    const listbox = screen.getByRole('listbox');
    expect(listbox).toHaveAttribute('aria-labelledby', trigger.id);
    expect(screen.getByRole('option', { name: 'Banana' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByTestId('indicator-banana')).toBeInTheDocument();
    // Focus starts on the current selection, like a native select.
    await waitFor(() => expect(screen.getByRole('option', { name: 'Banana' })).toHaveFocus());
  });

  it('selects with the keyboard, closes, and shows the item text', async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);

    screen.getByRole('combobox', { name: 'Fruit' }).focus();
    await userEvent.keyboard('{ArrowDown}');
    await waitFor(() => expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus());

    await userEvent.keyboard('{ArrowDown}{Enter}');
    expect(onValueChange).toHaveBeenCalledWith('banana');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: 'Fruit' })).toHaveTextContent('Banana');
  });

  it('skips disabled options', async () => {
    render(<Example />);
    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await waitFor(() => expect(screen.getByRole('option', { name: 'Apple' })).toHaveFocus());

    await userEvent.keyboard('{End}');
    // 'Cherry' is disabled, so End lands on 'Banana'.
    expect(screen.getByRole('option', { name: 'Banana' })).toHaveFocus();
    expect(screen.getByRole('option', { name: 'Cherry' })).toHaveAttribute('aria-disabled', 'true');
  });

  it('closes on Escape without changing the value', async () => {
    const onValueChange = vi.fn();
    render(<Example defaultValue="apple" onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('combobox', { name: 'Fruit' }));
    await userEvent.keyboard('{Escape}');

    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it('mirrors the value into a hidden input for forms', async () => {
    const { container } = render(
      <form>
        <Example name="fruit" defaultValue="apple" />
      </form>,
    );

    const input = container.querySelector<HTMLInputElement>('input[name="fruit"]');
    expect(input).toHaveValue('apple');
  });
});
