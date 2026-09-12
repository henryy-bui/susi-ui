import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RadioGroup, RadioGroupIndicator, RadioGroupItem } from '../RadioGroup';

function Example(props: React.ComponentProps<typeof RadioGroup>) {
  return (
    <RadioGroup aria-label="Plan" {...props}>
      {['free', 'pro', 'team'].map((value) => (
        <label key={value}>
          <RadioGroupItem value={value} disabled={value === 'team'}>
            <RadioGroupIndicator data-testid={`indicator-${value}`} />
          </RadioGroupItem>
          {value}
        </label>
      ))}
    </RadioGroup>
  );
}

describe('RadioGroup', () => {
  it('selects on click and reports the value', async () => {
    const onValueChange = vi.fn();
    render(<Example onValueChange={onValueChange} />);

    await userEvent.click(screen.getByRole('radio', { name: 'free' }));
    expect(screen.getByRole('radio', { name: 'free' })).toBeChecked();
    expect(onValueChange).toHaveBeenCalledWith('free');
    expect(screen.getByTestId('indicator-free')).toBeInTheDocument();
    expect(screen.queryByTestId('indicator-pro')).not.toBeInTheDocument();
  });

  it('moves and selects with arrow keys, skipping disabled items', async () => {
    render(<Example defaultValue="free" />);

    await userEvent.tab();
    expect(screen.getByRole('radio', { name: 'free' })).toHaveFocus();

    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'pro' })).toHaveFocus();
    expect(screen.getByRole('radio', { name: 'pro' })).toBeChecked();

    // 'team' is disabled, so the next step wraps back to 'free'.
    await userEvent.keyboard('{ArrowDown}');
    expect(screen.getByRole('radio', { name: 'free' })).toBeChecked();
  });

  it('keeps a single tab stop', async () => {
    render(<Example defaultValue="pro" />);
    expect(screen.getByRole('radio', { name: 'free' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('radio', { name: 'pro' })).toHaveAttribute('tabindex', '0');
  });

  it('mirrors the value into hidden inputs for forms', async () => {
    const { container } = render(
      <form>
        <Example name="plan" />
      </form>,
    );

    await userEvent.click(screen.getByRole('radio', { name: 'pro' }));
    const checked = container.querySelectorAll<HTMLInputElement>('input[name="plan"]:checked');
    expect(checked).toHaveLength(1);
    expect(checked[0]!.value).toBe('pro');
  });
});
