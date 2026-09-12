import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Checkbox, CheckboxIndicator } from '../Checkbox';

describe('Checkbox', () => {
  it('toggles when uncontrolled and reports changes', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(checkbox).toHaveAttribute('data-state', 'unchecked');

    await userEvent.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('stays put when controlled and the consumer ignores the change', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" checked={false} onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).toHaveBeenCalledWith(true);
    expect(screen.getByRole('checkbox')).toHaveAttribute('aria-checked', 'false');
  });

  it('exposes indeterminate as aria-checked="mixed" and resolves to checked', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" defaultChecked="indeterminate" onCheckedChange={onCheckedChange} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toHaveAttribute('aria-checked', 'mixed');
    expect(checkbox).toHaveAttribute('data-state', 'indeterminate');

    await userEvent.click(checkbox);
    expect(onCheckedChange).toHaveBeenCalledWith(true);
  });

  it('renders the indicator only while checked', async () => {
    render(
      <Checkbox aria-label="Accept">
        <CheckboxIndicator data-testid="indicator" />
      </Checkbox>,
    );

    expect(screen.queryByTestId('indicator')).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('checkbox'));
    expect(screen.getByTestId('indicator')).toBeInTheDocument();
  });

  it('mirrors state into a hidden input for form submission', async () => {
    const { container } = render(
      <form>
        <Checkbox aria-label="Accept" name="terms" value="yes" />
      </form>,
    );

    const input = container.querySelector('input[name="terms"]') as HTMLInputElement;
    expect(input).toBeInTheDocument();
    expect(input.checked).toBe(false);

    await userEvent.click(screen.getByRole('checkbox'));
    expect((container.querySelector('input[name="terms"]') as HTMLInputElement).checked).toBe(true);
  });

  it('does not toggle while disabled', async () => {
    const onCheckedChange = vi.fn();
    render(<Checkbox aria-label="Accept" disabled onCheckedChange={onCheckedChange} />);

    await userEvent.click(screen.getByRole('checkbox'));
    expect(onCheckedChange).not.toHaveBeenCalled();
  });
});
