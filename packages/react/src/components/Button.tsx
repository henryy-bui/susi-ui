import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { composeEventHandlers } from '../primitive/composeEventHandlers';

export interface ButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
  /** Blocks activation and exposes `aria-busy` / `data-loading` for styling. */
  loading?: boolean;
}

/**
 * A button that defaults to `type="button"` and stays inert while loading.
 * Exposes `data-disabled` / `data-loading` for styling.
 */
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { asChild, loading = false, disabled, type, onClick, ...props },
  forwardedRef,
) {
  const isDisabled = disabled || loading;

  return (
    <Primitive.button
      type={asChild ? type : (type ?? 'button')}
      disabled={asChild ? undefined : isDisabled}
      aria-disabled={asChild && isDisabled ? true : undefined}
      aria-busy={loading || undefined}
      data-disabled={isDisabled ? '' : undefined}
      data-loading={loading ? '' : undefined}
      onClick={composeEventHandlers(onClick, (event) => {
        // `asChild` targets (e.g. an anchor) can't rely on the disabled attribute.
        if (isDisabled) event.preventDefault();
      })}
      {...props}
      asChild={asChild}
      ref={forwardedRef}
    />
  );
});
