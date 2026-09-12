import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { createContext } from '../primitive/createContext';

interface ProgressContextValue {
  value: number | null;
  max: number;
}

const [ProgressProvider, useProgressContext] = createContext<ProgressContextValue>('Progress');

export interface ProgressProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'defaultValue'> {
  asChild?: boolean;
  /** `null` means indeterminate. */
  value?: number | null;
  max?: number;
  /** Accessible text for the current value, e.g. `(v) => \`${v}% uploaded\``. */
  getValueLabel?: (value: number, max: number) => string;
}

/** A determinate or indeterminate progress bar. */
export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(function Progress(
  { value = null, max = 100, getValueLabel, children, ...props },
  forwardedRef,
) {
  const clamped = value === null ? null : Math.min(Math.max(value, 0), max);
  const context = React.useMemo(() => ({ value: clamped, max }), [clamped, max]);

  return (
    <Primitive.div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={clamped ?? undefined}
      aria-valuetext={clamped !== null ? getValueLabel?.(clamped, max) : undefined}
      data-state={clamped === null ? 'indeterminate' : clamped === max ? 'complete' : 'loading'}
      data-value={clamped ?? undefined}
      data-max={max}
      {...props}
      ref={forwardedRef}
    >
      <ProgressProvider value={context}>{children}</ProgressProvider>
    </Primitive.div>
  );
});

export interface ProgressIndicatorProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

/** The filled part. Style it from `--susi-progress-percent`, or `data-state`. */
export const ProgressIndicator = React.forwardRef<HTMLDivElement, ProgressIndicatorProps>(
  function ProgressIndicator({ style, ...props }, forwardedRef) {
    const context = useProgressContext('ProgressIndicator');
    const percent = context.value === null ? null : (context.value / context.max) * 100;

    return (
      <Primitive.div
        data-state={percent === null ? 'indeterminate' : percent === 100 ? 'complete' : 'loading'}
        style={{
          ...(percent === null ? undefined : { ['--susi-progress-percent' as string]: `${percent}%` }),
          ...style,
        }}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);
