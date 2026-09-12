import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { getItems, nextIndexForKey, focusItem } from '../primitive/collection';
import { useControllableState } from '../hooks/useControllableState';
import { VISUALLY_HIDDEN_STYLE } from './VisuallyHidden';

const ITEM_ATTR = 'data-susi-radio';

interface RadioGroupContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  name: string | undefined;
  required: boolean | undefined;
  disabled: boolean | undefined;
  orientation: 'vertical' | 'horizontal';
  loop: boolean;
}

const [RadioGroupProvider, useRadioGroupContext] = createContext<RadioGroupContextValue>('RadioGroup');

export interface RadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue' | 'dir'> {
  asChild?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  orientation?: 'vertical' | 'horizontal';
  /** Wrap focus from the last item to the first. */
  loop?: boolean;
}

/**
 * A single-choice group. Arrow keys move between items and select as they go,
 * which is what the radio pattern calls for.
 */
export const RadioGroup = React.forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  {
    value: valueProp,
    defaultValue,
    onValueChange,
    name,
    required,
    disabled,
    orientation = 'vertical',
    loop = true,
    onKeyDown,
    children,
    ...props
  },
  forwardedRef,
) {
  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange as ((value: string | undefined) => void) | undefined,
  });
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);

  const context = React.useMemo(
    () => ({
      value,
      setValue: setValue as (value: string) => void,
      name,
      required,
      disabled,
      orientation,
      loop,
    }),
    [value, setValue, name, required, disabled, orientation, loop],
  );

  return (
    <Primitive.div
      role="radiogroup"
      aria-required={required}
      aria-orientation={orientation}
      data-orientation={orientation}
      data-disabled={disabled ? '' : undefined}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        const items = getItems(node, ITEM_ATTR);
        const current = items.indexOf(document.activeElement as HTMLElement);
        if (current === -1) return;

        const next = nextIndexForKey({ key: event.key, current, length: items.length, loop, orientation });
        if (next === -1) return;

        event.preventDefault();
        focusItem(items[next]);
        items[next]?.click();
      })}
      {...props}
      ref={composeRefs(forwardedRef, setNode)}
    >
      <RadioGroupProvider value={context}>{children}</RadioGroupProvider>
    </Primitive.div>
  );
});

export interface RadioGroupItemProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'value'> {
  asChild?: boolean;
  value: string;
}

interface RadioItemContextValue {
  checked: boolean;
  disabled: boolean | undefined;
}

const [RadioItemProvider, useRadioItemContext] = createContext<RadioItemContextValue>('RadioGroupItem');

export const RadioGroupItem = React.forwardRef<HTMLButtonElement, RadioGroupItemProps>(
  function RadioGroupItem({ value, disabled, onClick, onFocus, children, ...props }, forwardedRef) {
    const context = useRadioGroupContext('RadioGroupItem');
    const [node, setNode] = React.useState<HTMLButtonElement | null>(null);
    const isDisabled = disabled || context.disabled;
    const checked = context.value === value;
    const isFormControl = node ? Boolean(node.closest('form')) : true;

    // Roving tabindex: the checked item owns the tab stop; with nothing checked
    // the first enabled item does, so the group is still reachable by Tab.
    const isFirstEnabled = React.useMemo(() => {
      if (context.value !== undefined || !node) return false;
      const group = node.closest<HTMLElement>('[role="radiogroup"]');
      return getItems(group, ITEM_ATTR)[0] === node;
    }, [context.value, node]);

    const itemContext = React.useMemo(
      () => ({ checked, disabled: isDisabled }),
      [checked, isDisabled],
    );

    return (
      <>
        <Primitive.button
          type="button"
          role="radio"
          aria-checked={checked}
          disabled={isDisabled}
          tabIndex={checked || isFirstEnabled ? 0 : -1}
          data-state={checked ? 'checked' : 'unchecked'}
          data-disabled={isDisabled ? '' : undefined}
          {...{ [ITEM_ATTR]: '' }}
          onClick={composeEventHandlers(onClick, () => {
            if (!isDisabled) context.setValue(value);
          })}
          {...props}
          ref={composeRefs(forwardedRef, setNode)}
        >
          <RadioItemProvider value={itemContext}>{children}</RadioItemProvider>
        </Primitive.button>
        {isFormControl && context.name && (
          <input
            type="radio"
            name={context.name}
            value={value}
            checked={checked}
            required={context.required}
            disabled={isDisabled}
            tabIndex={-1}
            aria-hidden
            readOnly
            style={VISUALLY_HIDDEN_STYLE}
          />
        )}
      </>
    );
  },
);

export interface RadioGroupIndicatorProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
  forceMount?: boolean;
}

export const RadioGroupIndicator = React.forwardRef<HTMLSpanElement, RadioGroupIndicatorProps>(
  function RadioGroupIndicator({ forceMount, ...props }, forwardedRef) {
    const context = useRadioItemContext('RadioGroupIndicator');
    if (!forceMount && !context.checked) return null;

    return (
      <Primitive.span
        data-state={context.checked ? 'checked' : 'unchecked'}
        data-disabled={context.disabled ? '' : undefined}
        style={{ pointerEvents: 'none', ...props.style }}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);
