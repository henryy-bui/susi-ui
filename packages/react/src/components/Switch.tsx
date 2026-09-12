import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { useControllableState } from '../hooks/useControllableState';

interface SwitchContextValue {
  checked: boolean;
  disabled: boolean | undefined;
}

const [SwitchProvider, useSwitchContext] = createContext<SwitchContextValue>('Switch');

export interface SwitchProps
  extends Omit<React.ComponentPropsWithoutRef<'button'>, 'onChange' | 'value' | 'defaultChecked'> {
  asChild?: boolean;
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  required?: boolean;
  name?: string;
  value?: string;
}

/** An on/off control using `role="switch"`. */
export const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(function Switch(
  {
    checked: checkedProp,
    defaultChecked = false,
    onCheckedChange,
    disabled,
    required,
    name,
    value = 'on',
    onClick,
    children,
    ...props
  },
  forwardedRef,
) {
  const [button, setButton] = React.useState<HTMLButtonElement | null>(null);
  const [checked, setChecked] = useControllableState({
    prop: checkedProp,
    defaultProp: defaultChecked,
    onChange: onCheckedChange,
  });
  const isFormControl = button ? Boolean(button.closest('form')) : true;

  return (
    <>
      <Primitive.button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-required={required}
        disabled={disabled}
        data-state={checked ? 'checked' : 'unchecked'}
        data-disabled={disabled ? '' : undefined}
        onClick={composeEventHandlers(onClick, () => {
          if (!disabled) setChecked((prev) => !prev);
        })}
        {...props}
        ref={composeRefs(forwardedRef, setButton)}
      >
        <SwitchProvider value={{ checked, disabled }}>{children}</SwitchProvider>
      </Primitive.button>
      {isFormControl && name && (
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
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

export interface SwitchThumbProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
}

/** The moving part of the switch; carries `data-state` for positioning. */
export const SwitchThumb = React.forwardRef<HTMLSpanElement, SwitchThumbProps>(function SwitchThumb(
  props,
  forwardedRef,
) {
  const context = useSwitchContext('SwitchThumb');
  return (
    <Primitive.span
      data-state={context.checked ? 'checked' : 'unchecked'}
      data-disabled={context.disabled ? '' : undefined}
      {...props}
      ref={forwardedRef}
    />
  );
});
