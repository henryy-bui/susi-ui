import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { useControllableState } from '../hooks/useControllableState';

export interface ToggleProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange'> {
  asChild?: boolean;
  pressed?: boolean;
  defaultPressed?: boolean;
  onPressedChange?: (pressed: boolean) => void;
}

/** A two-state button (`aria-pressed`), e.g. a bold button in a toolbar. */
export const Toggle = React.forwardRef<HTMLButtonElement, ToggleProps>(function Toggle(
  { pressed: pressedProp, defaultPressed = false, onPressedChange, onClick, disabled, ...props },
  forwardedRef,
) {
  const [pressed, setPressed] = useControllableState({
    prop: pressedProp,
    defaultProp: defaultPressed,
    onChange: onPressedChange,
  });

  return (
    <Primitive.button
      type="button"
      aria-pressed={pressed}
      disabled={disabled}
      data-state={pressed ? 'on' : 'off'}
      data-disabled={disabled ? '' : undefined}
      onClick={composeEventHandlers(onClick, () => {
        if (!disabled) setPressed(!pressed);
      })}
      {...props}
      ref={forwardedRef}
    />
  );
});
