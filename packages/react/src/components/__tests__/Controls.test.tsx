import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../Button';
import { Switch, SwitchThumb } from '../Switch';
import { Toggle } from '../Toggle';

describe('Button', () => {
  it('defaults to type="button" and blocks clicks while loading', async () => {
    const onClick = vi.fn();
    render(
      <Button loading onClick={onClick}>
        Save
      </Button>,
    );

    const button = screen.getByRole('button', { name: 'Save' });
    expect(button).toHaveAttribute('type', 'button');
    expect(button).toHaveAttribute('aria-busy', 'true');
    expect(button).toBeDisabled();

    await userEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('marks an asChild target as aria-disabled since it cannot be disabled', () => {
    render(
      <Button asChild disabled>
        <a href="/x">Link</a>
      </Button>,
    );
    expect(screen.getByRole('link')).toHaveAttribute('aria-disabled', 'true');
  });
});

describe('Toggle', () => {
  it('reports pressed state through aria-pressed and data-state', async () => {
    const onPressedChange = vi.fn();
    render(<Toggle onPressedChange={onPressedChange}>Bold</Toggle>);

    const toggle = screen.getByRole('button', { name: 'Bold' });
    expect(toggle).toHaveAttribute('aria-pressed', 'false');
    expect(toggle).toHaveAttribute('data-state', 'off');

    await userEvent.click(toggle);
    expect(toggle).toHaveAttribute('aria-pressed', 'true');
    expect(toggle).toHaveAttribute('data-state', 'on');
    expect(onPressedChange).toHaveBeenCalledWith(true);
  });
});

describe('Switch', () => {
  it('toggles and keeps the thumb in sync', async () => {
    render(
      <Switch aria-label="Wi-Fi">
        <SwitchThumb data-testid="thumb" />
      </Switch>,
    );

    const control = screen.getByRole('switch');
    expect(control).toHaveAttribute('aria-checked', 'false');
    expect(screen.getByTestId('thumb')).toHaveAttribute('data-state', 'unchecked');

    await userEvent.click(control);
    expect(control).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByTestId('thumb')).toHaveAttribute('data-state', 'checked');
  });
});
