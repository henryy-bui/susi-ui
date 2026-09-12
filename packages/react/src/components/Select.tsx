import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { Portal, type PortalProps } from '../primitive/Portal';
import { FocusScope } from '../primitive/FocusScope';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { getItems, nextIndexForKey, focusItem } from '../primitive/collection';
import { useFloatingPosition, type Align, type Side } from '../primitive/useFloatingPosition';
import { useControllableState } from '../hooks/useControllableState';
import { useDismiss } from '../hooks/useDismiss';
import { useTypeahead } from '../hooks/useTypeahead';
import { useId } from '../hooks/useId';
import { VISUALLY_HIDDEN_STYLE } from './VisuallyHidden';

const ITEM_ATTR = 'data-susi-select-item';

interface SelectContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  disabled: boolean | undefined;
  required: boolean | undefined;
  name: string | undefined;
  contentId: string;
  triggerId: string;
  trigger: HTMLButtonElement | null;
  setTrigger: (node: HTMLButtonElement | null) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  /** Item text, registered on mount, so the trigger can display the selection. */
  labels: Map<string, string>;
  registerLabel: (value: string, label: string) => void;
}

const [SelectProvider, useSelectContext] = createContext<SelectContextValue>('Select');

export interface SelectProps {
  children?: React.ReactNode;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  required?: boolean;
  /** Submitted through a hidden input when inside a form. */
  name?: string;
}

/** A custom select following the ARIA listbox pattern. */
export function Select({
  children,
  value: valueProp,
  defaultValue,
  onValueChange,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  disabled,
  required,
  name,
}: SelectProps) {
  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange as ((value: string | undefined) => void) | undefined,
  });
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const baseId = useId();
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  // Labels outlive their items: the list unmounts when closed, but the trigger
  // still needs the selected item's text.
  const labelsRef = React.useRef(new Map<string, string>());
  const [, forceUpdate] = React.useReducer((n: number) => n + 1, 0);

  const registerLabel = React.useCallback((itemValue: string, label: string) => {
    if (labelsRef.current.get(itemValue) === label) return;
    labelsRef.current.set(itemValue, label);
    forceUpdate();
  }, []);

  const context = React.useMemo(
    () => ({
      value,
      setValue: setValue as (value: string) => void,
      open,
      setOpen: setOpen as (open: boolean) => void,
      disabled,
      required,
      name,
      contentId: `${baseId}-content`,
      triggerId: `${baseId}-trigger`,
      trigger,
      setTrigger,
      triggerRef,
      contentRef,
      labels: labelsRef.current,
      registerLabel,
    }),
    [value, setValue, open, setOpen, disabled, required, name, baseId, trigger, registerLabel],
  );

  return <SelectProvider value={context}>{children}</SelectProvider>;
}
Select.displayName = 'Select';

export interface SelectTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  function SelectTrigger({ onClick, onKeyDown, disabled, children, ...props }, forwardedRef) {
    const context = useSelectContext('SelectTrigger');
    const isDisabled = disabled || context.disabled;
    const isFormControl = context.trigger ? Boolean(context.trigger.closest('form')) : true;

    return (
      <>
        <Primitive.button
          type="button"
          role="combobox"
          id={context.triggerId}
          aria-haspopup="listbox"
          aria-expanded={context.open}
          aria-controls={context.open ? context.contentId : undefined}
          aria-required={context.required}
          aria-autocomplete="none"
          disabled={isDisabled}
          data-state={context.open ? 'open' : 'closed'}
          data-disabled={isDisabled ? '' : undefined}
          data-placeholder={context.value === undefined ? '' : undefined}
          onClick={composeEventHandlers(onClick, () => {
            if (!isDisabled) context.setOpen(!context.open);
          })}
          onKeyDown={composeEventHandlers(onKeyDown, (event) => {
            if (isDisabled) return;
            if (['ArrowDown', 'ArrowUp', 'Enter', ' '].includes(event.key)) {
              event.preventDefault();
              context.setOpen(true);
            }
          })}
          {...props}
          ref={composeRefs(forwardedRef, context.triggerRef, context.setTrigger)}
        >
          {children}
        </Primitive.button>
        {isFormControl && context.name && (
          <input
            name={context.name}
            value={context.value ?? ''}
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

export interface SelectValueProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
  /** Shown while nothing is selected. */
  placeholder?: React.ReactNode;
}

/**
 * Renders the selected item's text. Pass `children` to render the selection
 * yourself — useful before the list has been opened for the first time, when
 * only the raw value is known.
 */
export const SelectValue = React.forwardRef<HTMLSpanElement, SelectValueProps>(function SelectValue(
  { placeholder, children, ...props },
  forwardedRef,
) {
  const context = useSelectContext('SelectValue');
  const label = context.value === undefined ? undefined : context.labels.get(context.value) ?? context.value;

  return (
    <Primitive.span
      data-placeholder={context.value === undefined ? '' : undefined}
      {...props}
      ref={forwardedRef}
    >
      {children ?? label ?? placeholder}
    </Primitive.span>
  );
});

export interface SelectIconProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
}

export const SelectIcon = React.forwardRef<HTMLSpanElement, SelectIconProps>(function SelectIcon(
  props,
  forwardedRef,
) {
  return <Primitive.span aria-hidden {...props} ref={forwardedRef} />;
});

export function SelectPortal({ children, container }: PortalProps) {
  const context = useSelectContext('SelectPortal');
  if (!context.open) return null;
  return <Portal container={container}>{children}</Portal>;
}
SelectPortal.displayName = 'SelectPortal';

export interface SelectContentProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  /** Publish the trigger's width as `--susi-anchor-width`. */
  matchTriggerWidth?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onCloseAutoFocus?: (event: Event) => void;
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(function SelectContent(
  {
    side = 'bottom',
    align = 'start',
    sideOffset = 4,
    alignOffset = 0,
    matchTriggerWidth = true,
    onEscapeKeyDown,
    onPointerDownOutside,
    onCloseAutoFocus,
    onKeyDown,
    style,
    children,
    ...props
  },
  forwardedRef,
) {
  const context = useSelectContext('SelectContent');
  const open = context.open;
  const handleTypeahead = useTypeahead();

  const { setFloating, floatingStyles, side: resolvedSide, align: resolvedAlign } = useFloatingPosition({
    open,
    reference: context.trigger,
    side,
    align,
    sideOffset,
    alignOffset,
    matchAnchorWidth: matchTriggerWidth,
  });

  useDismiss({
    enabled: open,
    refs: [context.contentRef, context.triggerRef],
    onEscapeKeyDown,
    onPointerDownOutside,
    onDismiss: () => context.setOpen(false),
  });

  if (!open) return null;

  return (
    <FocusScope
      role="listbox"
      id={context.contentId}
      aria-labelledby={context.triggerId}
      data-state="open"
      data-side={resolvedSide}
      data-align={resolvedAlign}
      trapped
      onMountAutoFocus={(event) => {
        // Open on the current selection, like a native select does.
        event.preventDefault();
        const items = getItems(context.contentRef.current, ITEM_ATTR);
        const selected = items.find((item) => item.getAttribute('data-state') === 'checked');
        focusItem(selected ?? items[0]);
      }}
      onUnmountAutoFocus={onCloseAutoFocus}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        const items = getItems(context.contentRef.current, ITEM_ATTR);
        const current = items.indexOf(document.activeElement as HTMLElement);

        const next = nextIndexForKey({ key: event.key, current, length: items.length, loop: false });
        if (next !== -1) {
          event.preventDefault();
          focusItem(items[next]);
          return;
        }

        if (event.key === 'Tab') {
          event.preventDefault();
          context.setOpen(false);
          return;
        }

        if (event.key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
          const match = handleTypeahead(event.key, items, current);
          if (match) {
            event.preventDefault();
            focusItem(match);
          }
        }
      })}
      style={{ ...floatingStyles, ...style }}
      {...props}
      ref={composeRefs(forwardedRef, context.contentRef, setFloating as React.Ref<HTMLDivElement>)}
    >
      {children}
    </FocusScope>
  );
});

export interface SelectViewportProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

/** Scroll container for the options; style its `max-height`. */
export const SelectViewport = React.forwardRef<HTMLDivElement, SelectViewportProps>(
  function SelectViewport(props, forwardedRef) {
    return <Primitive.div {...props} ref={forwardedRef} />;
  },
);

interface SelectItemContextValue {
  selected: boolean;
}

const [SelectItemProvider, useSelectItemContext] = createContext<SelectItemContextValue>('SelectItem');

export interface SelectItemProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'value'> {
  asChild?: boolean;
  value: string;
  disabled?: boolean;
  /** Falls back to the item's text content. */
  textValue?: string;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(function SelectItem(
  { value, disabled, textValue, onClick, onKeyDown, onPointerMove, children, ...props },
  forwardedRef,
) {
  const context = useSelectContext('SelectItem');
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);
  const selected = context.value === value;

  React.useEffect(() => {
    const label = textValue ?? node?.textContent?.trim();
    if (label) context.registerLabel(value, label);
  }, [context, value, textValue, node]);

  const select = () => {
    if (disabled) return;
    context.setValue(value);
    context.setOpen(false);
  };

  const itemContext = React.useMemo(() => ({ selected }), [selected]);

  return (
    <Primitive.div
      role="option"
      aria-selected={selected}
      aria-disabled={disabled || undefined}
      tabIndex={-1}
      data-state={selected ? 'checked' : 'unchecked'}
      data-disabled={disabled ? '' : undefined}
      {...(disabled ? {} : { [ITEM_ATTR]: '' })}
      onClick={composeEventHandlers(onClick, select)}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          select();
        }
      })}
      onPointerMove={composeEventHandlers(onPointerMove, (event) => {
        if (!disabled && event.pointerType !== 'touch') (event.currentTarget as HTMLElement).focus();
      })}
      {...props}
      ref={composeRefs(forwardedRef, setNode)}
    >
      <SelectItemProvider value={itemContext}>{children}</SelectItemProvider>
    </Primitive.div>
  );
});

export interface SelectItemTextProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
}

export const SelectItemText = React.forwardRef<HTMLSpanElement, SelectItemTextProps>(
  function SelectItemText(props, forwardedRef) {
    return <Primitive.span {...props} ref={forwardedRef} />;
  },
);

export interface SelectItemIndicatorProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
  forceMount?: boolean;
}

export const SelectItemIndicator = React.forwardRef<HTMLSpanElement, SelectItemIndicatorProps>(
  function SelectItemIndicator({ forceMount, ...props }, forwardedRef) {
    const item = useSelectItemContext('SelectItemIndicator');
    if (!forceMount && !item.selected) return null;
    return <Primitive.span aria-hidden {...props} ref={forwardedRef} />;
  },
);

export interface SelectGroupProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

const [GroupProvider, useGroupContext] = createContext<{ labelId: string }>('SelectGroup');

export const SelectGroup = React.forwardRef<HTMLDivElement, SelectGroupProps>(function SelectGroup(
  { children, ...props },
  forwardedRef,
) {
  const labelId = useId();
  const context = React.useMemo(() => ({ labelId }), [labelId]);

  return (
    <Primitive.div role="group" aria-labelledby={labelId} {...props} ref={forwardedRef}>
      <GroupProvider value={context}>{children}</GroupProvider>
    </Primitive.div>
  );
});

export interface SelectLabelProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

export const SelectLabel = React.forwardRef<HTMLDivElement, SelectLabelProps>(function SelectLabel(
  props,
  forwardedRef,
) {
  const group = useGroupContext('SelectLabel');
  return <Primitive.div id={group.labelId} {...props} ref={forwardedRef} />;
});

export interface SelectSeparatorProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

export const SelectSeparator = React.forwardRef<HTMLDivElement, SelectSeparatorProps>(
  function SelectSeparator(props, forwardedRef) {
    return <Primitive.div role="separator" aria-hidden {...props} ref={forwardedRef} />;
  },
);
