import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Progress, ProgressIndicator } from '../Progress';
import { Separator } from '../Separator';
import { VisuallyHidden } from '../VisuallyHidden';

describe('Progress', () => {
  it('reports its value and publishes a percentage', () => {
    render(
      <Progress value={30} max={60} getValueLabel={(value, max) => `${value} of ${max} done`}>
        <ProgressIndicator data-testid="indicator" />
      </Progress>,
    );

    const bar = screen.getByRole('progressbar');
    expect(bar).toHaveAttribute('aria-valuenow', '30');
    expect(bar).toHaveAttribute('aria-valuemax', '60');
    expect(bar).toHaveAttribute('aria-valuetext', '30 of 60 done');
    expect(bar).toHaveAttribute('data-state', 'loading');
    expect(screen.getByTestId('indicator')).toHaveStyle({ '--susi-progress-percent': '50%' });
  });

  it('handles indeterminate and complete states', () => {
    const { rerender } = render(<Progress value={null} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-state', 'indeterminate');
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');

    rerender(<Progress value={100} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('data-state', 'complete');
  });

  it('clamps out-of-range values', () => {
    render(<Progress value={150} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });
});

describe('Separator', () => {
  it('is decorative by default and semantic when asked', () => {
    const { rerender } = render(<Separator data-testid="sep" />);
    expect(screen.getByTestId('sep')).toHaveAttribute('role', 'none');

    rerender(<Separator data-testid="sep" decorative={false} orientation="vertical" />);
    expect(screen.getByTestId('sep')).toHaveAttribute('role', 'separator');
    expect(screen.getByTestId('sep')).toHaveAttribute('aria-orientation', 'vertical');
    expect(screen.getByTestId('sep')).toHaveAttribute('data-orientation', 'vertical');
  });
});

describe('VisuallyHidden', () => {
  it('stays in the accessibility tree while hidden visually', () => {
    render(
      <button>
        <VisuallyHidden>Close dialog</VisuallyHidden>
        <span aria-hidden>×</span>
      </button>,
    );

    const button = screen.getByRole('button', { name: 'Close dialog' });
    expect(button.firstElementChild).toHaveStyle({ position: 'absolute', width: '1px' });
  });
});
