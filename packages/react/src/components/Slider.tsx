import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { useControllableState } from '../hooks/useControllableState';

type Orientation = 'horizontal' | 'vertical';

interface SliderContextValue {
  values: number[];
  min: number;
  max: number;
  step: number;
  orientation: Orientation;
  disabled: boolean | undefined;
  percentFor: (value: number) => number;
  updateValueAt: (index: number, value: number) => void;
  setTrack: (node: HTMLElement | null) => void;
  trackRef: React.RefObject<HTMLElement | null>;
  name: string | undefined;
}

const [SliderProvider, useSliderContext] = createContext<SliderContextValue>('Slider');

export interface SliderProps
  extends Omit<React.ComponentPropsWithoutRef<'span'>, 'onChange' | 'defaultValue'> {
  asChild?: boolean;
  /** One number per thumb. */
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (value: number[]) => void;
  /** Fires once when a drag or keyboard interaction settles. */
  onValueCommit?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  orientation?: Orientation;
  disabled?: boolean;
  /** Submitted as one input per thumb when inside a form. */
  name?: string;
}

/**
 * A range input with one or more thumbs. Positioning is left to CSS: the range
 * and each thumb publish their position as a percentage in a CSS variable.
 */
export const Slider = React.forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  {
    value: valueProp,
    defaultValue = [0],
    onValueChange,
    onValueCommit,
    min = 0,
    max = 100,
    step = 1,
    orientation = 'horizontal',
    disabled,
    name,
    children,
    ...props
  },
  forwardedRef,
) {
  const [values, setValues] = useControllableState<number[]>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });
  const trackRef = React.useRef<HTMLElement | null>(null);
  const setTrack = React.useCallback((node: HTMLElement | null) => {
    trackRef.current = node;
  }, []);

  const percentFor = React.useCallback(
    (value: number) => ((value - min) / (max - min)) * 100,
    [min, max],
  );

  const updateValueAt = React.useCallback(
    (index: number, next: number) => {
      setValues((prev) => {
        const clamped = clampToStep(next, min, max, step);
        // Thumbs can't cross each other.
        const lower = prev[index - 1] ?? min;
        const upper = prev[index + 1] ?? max;
        const bounded = Math.min(Math.max(clamped, lower), upper);
        if (prev[index] === bounded) return prev;
        const copy = [...prev];
        copy[index] = bounded;
        return copy;
      });
    },
    [setValues, min, max, step],
  );

  const context = React.useMemo(
    () => ({
      values,
      min,
      max,
      step,
      orientation,
      disabled,
      percentFor,
      updateValueAt,
      setTrack,
      trackRef,
      name,
    }),
    [values, min, max, step, orientation, disabled, percentFor, updateValueAt, setTrack, name],
  );

  return (
    <Primitive.span
      data-orientation={orientation}
      data-disabled={disabled ? '' : undefined}
      onPointerUp={() => onValueCommit?.(values)}
      onKeyUp={() => onValueCommit?.(values)}
      {...props}
      ref={forwardedRef}
    >
      <SliderProvider value={context}>{children}</SliderProvider>
      {name &&
        values.map((value, index) => (
          <input key={index} type="hidden" name={values.length > 1 ? `${name}[]` : name} value={value} />
        ))}
    </Primitive.span>
  );
});

export interface SliderTrackProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
}

/** The rail. Clicking or dragging it moves the nearest thumb. */
export const SliderTrack = React.forwardRef<HTMLSpanElement, SliderTrackProps>(function SliderTrack(
  { onPointerDown, ...props },
  forwardedRef,
) {
  const context = useSliderContext('SliderTrack');

  const valueFromPointer = React.useCallback(
    (event: React.PointerEvent | PointerEvent) => {
      const track = context.trackRef.current;
      if (!track) return null;
      const rect = track.getBoundingClientRect();
      const ratio =
        context.orientation === 'vertical'
          ? 1 - (event.clientY - rect.top) / rect.height
          : (event.clientX - rect.left) / rect.width;
      return context.min + Math.min(Math.max(ratio, 0), 1) * (context.max - context.min);
    },
    [context],
  );

  return (
    <Primitive.span
      data-orientation={context.orientation}
      data-disabled={context.disabled ? '' : undefined}
      onPointerDown={composeEventHandlers(onPointerDown, (event) => {
        if (context.disabled) return;
        const value = valueFromPointer(event);
        if (value === null) return;

        // Grab the closest thumb and keep following the pointer until release.
        const index = closestIndex(context.values, value);
        context.updateValueAt(index, value);

        const target = event.currentTarget as HTMLElement;
        target.setPointerCapture?.(event.pointerId);
        const onMove = (moveEvent: PointerEvent) => {
          const moved = valueFromPointer(moveEvent);
          if (moved !== null) context.updateValueAt(index, moved);
        };
        const onUp = () => {
          target.removeEventListener('pointermove', onMove);
          target.removeEventListener('pointerup', onUp);
        };
        target.addEventListener('pointermove', onMove);
        target.addEventListener('pointerup', onUp);
      })}
      {...props}
      ref={composeRefs(forwardedRef, context.setTrack)}
    />
  );
});

export interface SliderRangeProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
}

/** The filled section, as `--susi-slider-range-start` / `-end` percentages. */
export const SliderRange = React.forwardRef<HTMLSpanElement, SliderRangeProps>(function SliderRange(
  { style, ...props },
  forwardedRef,
) {
  const context = useSliderContext('SliderRange');
  const percents = context.values.map(context.percentFor);
  const start = context.values.length > 1 ? Math.min(...percents) : 0;
  const end = Math.max(...percents);

  return (
    <Primitive.span
      data-orientation={context.orientation}
      data-disabled={context.disabled ? '' : undefined}
      style={{
        ['--susi-slider-range-start' as string]: `${start}%`,
        ['--susi-slider-range-end' as string]: `${end}%`,
        ...style,
      }}
      {...props}
      ref={forwardedRef}
    />
  );
});

export interface SliderThumbProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
  /** Which value this thumb controls. */
  index?: number;
  /** Accessible text for the current value. */
  getValueLabel?: (value: number) => string;
}

/** A draggable handle, positioned from `--susi-slider-percent`. */
export const SliderThumb = React.forwardRef<HTMLSpanElement, SliderThumbProps>(function SliderThumb(
  { index = 0, getValueLabel, style, onKeyDown, ...props },
  forwardedRef,
) {
  const context = useSliderContext('SliderThumb');
  const value = context.values[index] ?? context.min;
  const isVertical = context.orientation === 'vertical';

  return (
    <Primitive.span
      role="slider"
      tabIndex={context.disabled ? -1 : 0}
      aria-valuemin={context.min}
      aria-valuemax={context.max}
      aria-valuenow={value}
      aria-valuetext={getValueLabel?.(value)}
      aria-orientation={context.orientation}
      aria-disabled={context.disabled || undefined}
      data-orientation={context.orientation}
      data-disabled={context.disabled ? '' : undefined}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (context.disabled) return;
        const big = Math.max(context.step, (context.max - context.min) / 10);
        const increase = isVertical ? 'ArrowUp' : 'ArrowRight';
        const decrease = isVertical ? 'ArrowDown' : 'ArrowLeft';

        let next: number | null = null;
        if (event.key === increase || (isVertical ? event.key === 'ArrowRight' : event.key === 'ArrowUp')) {
          next = value + context.step;
        } else if (event.key === decrease || (isVertical ? event.key === 'ArrowLeft' : event.key === 'ArrowDown')) {
          next = value - context.step;
        } else if (event.key === 'PageUp') next = value + big;
        else if (event.key === 'PageDown') next = value - big;
        else if (event.key === 'Home') next = context.min;
        else if (event.key === 'End') next = context.max;

        if (next === null) return;
        event.preventDefault();
        context.updateValueAt(index, next);
      })}
      style={{ ['--susi-slider-percent' as string]: `${context.percentFor(value)}%`, ...style }}
      {...props}
      ref={forwardedRef}
    />
  );
});

function clampToStep(value: number, min: number, max: number, step: number) {
  const stepped = Math.round((value - min) / step) * step + min;
  const decimals = (String(step).split('.')[1] ?? '').length;
  return Number(Math.min(Math.max(stepped, min), max).toFixed(decimals));
}

function closestIndex(values: number[], value: number) {
  let index = 0;
  let distance = Infinity;
  values.forEach((current, i) => {
    const next = Math.abs(current - value);
    if (next < distance) {
      distance = next;
      index = i;
    }
  });
  return index;
}
