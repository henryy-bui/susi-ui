import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { useControllableState } from '../hooks/useControllableState';

export type CheckedState = boolean | 'indeterminate';

interface CheckboxContextValue {
  checked: CheckedState;
  disabled: boolean | undefined;
}

const [CheckboxProvider, useCheckboxContext] = createContext<CheckboxContextValue>('Checkbox');

export interface CheckboxProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange' | 'value' | 'defaultChecked'> {
  asChild?: boolean;
  checked?: CheckedState;
  defaultChecked?: CheckedState;
  onCheckedChange?: (checked: CheckedState) => void;
  required?: boolean;
  /** When set, a hidden input mirrors the state so native form submission works. */
  name?: string;
  value?: string;
}

/**
 * A checkbox that supports an `indeterminate` state, which native inputs can
 * only express imperatively. Exposes `data-state="checked|unchecked|indeterminate"`.
 */
export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(function Checkbox(
  {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled,
    required,
    name,
    value = 'on',
    onClick,
    onKeyDown,
    children,
    ...props
  },
  forwardedRef,
) {
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
  const [checked, setChecked] = useControllableState<CheckedState>({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  });
  const isFormControl = button ? Boolean(button.closest('form')) : true;

  return (
    <>
      <Primitive.button
        type="button"
        role="checkbox"
        aria-checked={checked === 'indeterminate' ? 'mixed' : checked}
        aria-required={required}
        disabled={disabled}
        data-state={getState(checked)}
        data-disabled={disabled ? '' : undefined}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          // Native checkboxes don't submit a form on Enter.
          if (event.key === 'Enter') event.preventDefault();
        })}
        onClick={composeEventHandlers(onClick, () => {
          if (!disabled) setChecked((prev) => (prev === 'indeterminate' ? true : !prev));
        })}
        {...props}
        ref={composeRefs(forwardedRef, setButton)}
      >
        <CheckboxProvider value={{ checked, disabled }}>{children}</CheckboxProvider>
      </Primitive.button>
      {isFormControl && name && (
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={checked === true}
          required={required}
          disabled={disabled}
          tabIndex={-1}
          aria-hidden
          readOnly
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            padding: 0,
            margin: -1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
            whiteSpace: 'nowrap',
            border: 0,
          }}
        />
      )}
    </>
  );
});

export interface CheckboxIndicatorProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
  /** Render even when unchecked (useful for exit animations). */
  forceMount?: boolean;
}

/** Rendered only while the checkbox is checked or indeterminate. */
export const CheckboxIndicator = React.forwardRef<HTMLSpanElement, CheckboxIndicatorProps>(
  function CheckboxIndicator({ forceMount, ...props }, forwardedRef) {
    const context = useCheckboxContext('CheckboxIndicator');
    const visible = context.checked === true || context.checked === 'indeterminate';
    if (!forceMount && !visible) return null;

    return (
      <Primitive.span
        data-state={getState(context.checked)}
        data-disabled={context.disabled ? '' : undefined}
        style={{ pointerEvents: 'none', ...props.style }}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

function getState(checked: CheckedState) {
  return checked === 'indeterminate' ? 'indeterminate' : checked ? 'checked' : 'unchecked';
}
