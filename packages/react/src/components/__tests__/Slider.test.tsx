import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Slider, SliderRange, SliderThumb, SliderTrack } from '../Slider';

function Example(props: React.ComponentProps<typeof Slider>) {
  return (
    <Slider {...props}>
      <SliderTrack data-testid="track">
        <SliderRange data-testid="range" />
      </SliderTrack>
      {(props.value ?? props.defaultValue ?? [0]).map((_, index) => (
        <SliderThumb key={index} index={index} aria-label={`Thumb ${index + 1}`} />
      ))}
    </Slider>
  );
}

describe('Slider', () => {
  it('exposes the value through the slider role', () => {
    render(<Example defaultValue={[40]} min={0} max={200} />);
    const thumb = screen.getByRole('slider');
    expect(thumb).toHaveAttribute('aria-valuenow', '40');
    expect(thumb).toHaveAttribute('aria-valuemin', '0');
    expect(thumb).toHaveAttribute('aria-valuemax', '200');
  });

  it('publishes positions as CSS variables', () => {
    render(<Example defaultValue={[25]} />);
    expect(screen.getByRole('slider')).toHaveStyle({ '--susi-slider-percent': '25%' });
    expect(screen.getByTestId('range')).toHaveStyle({ '--susi-slider-range-end': '25%' });
  });

  it('steps with the keyboard and clamps at the bounds', async () => {
    const onValueChange = vi.fn();
    render(<Example defaultValue={[50]} step={10} onValueChange={onValueChange} />);

    const thumb = screen.getByRole('slider');
    thumb.focus();

    await userEvent.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '60');
    expect(onValueChange).toHaveBeenLastCalledWith([60]);

    await userEvent.keyboard('{Home}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');

    await userEvent.keyboard('{ArrowLeft}');
    expect(thumb).toHaveAttribute('aria-valuenow', '0');

    await userEvent.keyboard('{End}');
    expect(thumb).toHaveAttribute('aria-valuenow', '100');
  });

  it('stops thumbs from crossing each other', async () => {
    render(<Example defaultValue={[30, 60]} />);
    const [lower, upper] = screen.getAllByRole('slider');

    upper!.focus();
    await userEvent.keyboard('{Home}');
    // The upper thumb can only come down to the lower one.
    expect(upper).toHaveAttribute('aria-valuenow', '30');

    lower!.focus();
    await userEvent.keyboard('{End}');
    expect(lower).toHaveAttribute('aria-valuenow', '30');
  });

  it('does not respond while disabled', async () => {
    render(<Example defaultValue={[20]} disabled />);
    const thumb = screen.getByRole('slider');
    thumb.focus();
    await userEvent.keyboard('{ArrowRight}');
    expect(thumb).toHaveAttribute('aria-valuenow', '20');
  });
});
