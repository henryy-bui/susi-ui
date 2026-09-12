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

const ITEM_ATTR = 'data-susi-menu-item';

interface MenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  triggerId: string;
  trigger: HTMLButtonElement | null;
  setTrigger: (node: HTMLButtonElement | null) => void;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  /** Set when the menu was opened with a key that should focus the last item. */
  openDirection: React.RefObject<'first' | 'last'>;
}

const [MenuProvider, useMenuContext] = createContext<MenuContextValue>('DropdownMenu');

export interface DropdownMenuProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** A button-triggered menu following the ARIA menu button pattern. */
export function DropdownMenu({ children, open: openProp, defaultOpen = false, onOpenChange }: DropdownMenuProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const baseId = useId();
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null);
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const openDirection = React.useRef<'first' | 'last'>('first');

  const context = React.useMemo(
    () => ({
      open,
      setOpen: setOpen as (open: boolean) => void,
      contentId: `${baseId}-content`,
      triggerId: `${baseId}-trigger`,
      trigger,
      setTrigger,
      triggerRef,
      contentRef,
      openDirection,
    }),
    [open, setOpen, baseId, trigger],
  );

  return <MenuProvider value={context}>{children}</MenuProvider>;
}
DropdownMenu.displayName = 'DropdownMenu';

export interface DropdownMenuTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const DropdownMenuTrigger = React.forwardRef<HTMLButtonElement, DropdownMenuTriggerProps>(
  function DropdownMenuTrigger({ onClick, onKeyDown, disabled, ...props }, forwardedRef) {
    const context = useMenuContext('DropdownMenuTrigger');

    return (
      <Primitive.button
        type="button"
        id={context.triggerId}
        aria-haspopup="menu"
        aria-expanded={context.open}
        aria-controls={context.open ? context.contentId : undefined}
        disabled={disabled}
        data-state={context.open ? 'open' : 'closed'}
        onClick={composeEventHandlers(onClick, () => {
          if (disabled) return;
          context.openDirection.current = 'first';
          context.setOpen(!context.open);
        })}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          if (disabled) return;
          if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
            event.preventDefault();
            context.openDirection.current = event.key === 'ArrowUp' ? 'last' : 'first';
            context.setOpen(true);
          }
        })}
        {...props}
        ref={composeRefs(forwardedRef, context.triggerRef, context.setTrigger)}
      />
    );
  },
);

export function DropdownMenuPortal({ children, container }: PortalProps) {
  const context = useMenuContext('DropdownMenuPortal');
  if (!context.open) return null;
  return <Portal container={container}>{children}</Portal>;
}
DropdownMenuPortal.displayName = 'DropdownMenuPortal';

export interface DropdownMenuContentProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  loop?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onCloseAutoFocus?: (event: Event) => void;
}

export const DropdownMenuContent = React.forwardRef<HTMLDivElement, DropdownMenuContentProps>(
  function DropdownMenuContent(
    {
      side = 'bottom',
      align = 'start',
      sideOffset = 4,
      alignOffset = 0,
      loop = true,
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
    const context = useMenuContext('DropdownMenuContent');
    const open = context.open;
    const handleTypeahead = useTypeahead();

    const { setFloating, floatingStyles, side: resolvedSide, align: resolvedAlign } = useFloatingPosition({
      open,
      reference: context.trigger,
      side,
      align,
      sideOffset,
      alignOffset,
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
        role="menu"
        id={context.contentId}
        aria-labelledby={context.triggerId}
        aria-orientation="vertical"
        data-state="open"
        data-side={resolvedSide}
        data-align={resolvedAlign}
        trapped
        onMountAutoFocus={(event) => {
          // Focus an item rather than the menu container itself.
          event.preventDefault();
          const items = getItems(context.contentRef.current, ITEM_ATTR);
          focusItem(context.openDirection.current === 'last' ? items[items.length - 1] : items[0]);
        }}
        onUnmountAutoFocus={onCloseAutoFocus}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          const items = getItems(context.contentRef.current, ITEM_ATTR);
          const current = items.indexOf(document.activeElement as HTMLElement);

          const next = nextIndexForKey({ key: event.key, current, length: items.length, loop });
          if (next !== -1) {
            event.preventDefault();
            focusItem(items[next]);
            return;
          }

          if (event.key === 'Tab') {
            // Tab dismisses a menu rather than cycling inside it.
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
  },
);

export interface DropdownMenuItemProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onSelect'> {
  asChild?: boolean;
  disabled?: boolean;
  /** Call `preventDefault()` to keep the menu open after selection. */
  onSelect?: (event: Event) => void;
}

function useItemSelect(onSelect?: (event: Event) => void) {
  const context = useMenuContext('DropdownMenuItem');

  return React.useCallback(
    (node: HTMLElement | null) => {
      const event = new CustomEvent('susi.menu.select', { bubbles: true, cancelable: true });
      node?.dispatchEvent(event);
      onSelect?.(event);
      if (!event.defaultPrevented) context.setOpen(false);
    },
    [context, onSelect],
  );
}

/** Shared item behaviour: pointer-move focus, Enter/Space activation, selection. */
function useMenuItem({
  disabled,
  onSelect,
  onClick,
  onKeyDown,
  onPointerMove,
}: {
  disabled?: boolean;
  onSelect?: (event: Event) => void;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
  onPointerMove?: React.PointerEventHandler<HTMLDivElement>;
}) {
  const select = useItemSelect(onSelect);

  return {
    tabIndex: -1,
    'aria-disabled': disabled || undefined,
    'data-disabled': disabled ? '' : undefined,
    [ITEM_ATTR]: disabled ? undefined : '',
    onClick: composeEventHandlers(onClick, (event) => {
      if (!disabled) select(event.currentTarget as HTMLElement);
    }),
    onKeyDown: composeEventHandlers(onKeyDown, (event) => {
      if (disabled) return;
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        select(event.currentTarget as HTMLElement);
      }
    }),
    onPointerMove: composeEventHandlers(onPointerMove, (event) => {
      // Menus follow the pointer: hovering an item focuses it.
      if (!disabled && event.pointerType !== 'touch') (event.currentTarget as HTMLElement).focus();
    }),
  } as const;
}

export const DropdownMenuItem = React.forwardRef<HTMLDivElement, DropdownMenuItemProps>(
  function DropdownMenuItem({ disabled, onSelect, onClick, onKeyDown, onPointerMove, ...props }, forwardedRef) {
    const itemProps = useMenuItem({ disabled, onSelect, onClick, onKeyDown, onPointerMove });
    return <Primitive.div role="menuitem" {...itemProps} {...props} ref={forwardedRef} />;
  },
);

export interface DropdownMenuCheckboxItemProps extends Omit<DropdownMenuItemProps, 'onSelect'> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  onSelect?: (event: Event) => void;
}

const [ItemStateProvider, useItemStateContext] = createContext<{ checked: boolean }>('DropdownMenuItemIndicator');

export const DropdownMenuCheckboxItem = React.forwardRef<HTMLDivElement, DropdownMenuCheckboxItemProps>(
  function DropdownMenuCheckboxItem(
    {
      checked: checkedProp,
      defaultChecked = false,
      onCheckedChange,
      disabled,
      onSelect,
      onClick,
      onKeyDown,
      onPointerMove,
      children,
      ...props
    },
    forwardedRef,
  ) {
    const [checked, setChecked] = useControllableState({
      prop: checkedProp,
      defaultProp: defaultChecked,
      onChange: onCheckedChange,
    });
    const itemProps = useMenuItem({
      disabled,
      onSelect: (event) => {
        setChecked((prev) => !prev);
        onSelect?.(event);
      },
      onClick,
      onKeyDown,
      onPointerMove,
    });
    const state = React.useMemo(() => ({ checked }), [checked]);

    return (
      <Primitive.div
        role="menuitemcheckbox"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        {...itemProps}
        {...props}
        ref={forwardedRef}
      >
        <ItemStateProvider value={state}>{children}</ItemStateProvider>
      </Primitive.div>
    );
  },
);

interface MenuRadioGroupContextValue {
  value: string | undefined;
  setValue: (value: string) => void;
}

const [MenuRadioGroupProvider, useMenuRadioGroupContext] =
  createContext<MenuRadioGroupContextValue>('DropdownMenuRadioGroup');

export interface DropdownMenuRadioGroupProps
  extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  asChild?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
}

export const DropdownMenuRadioGroup = React.forwardRef<HTMLDivElement, DropdownMenuRadioGroupProps>(
  function DropdownMenuRadioGroup(
    { value: valueProp, defaultValue, onValueChange, children, ...props },
    forwardedRef,
  ) {
    const [value, setValue] = useControllableState<string | undefined>({
      prop: valueProp,
      defaultProp: defaultValue,
      onChange: onValueChange as ((value: string | undefined) => void) | undefined,
    });
    const context = React.useMemo(
      () => ({ value, setValue: setValue as (value: string) => void }),
      [value, setValue],
    );

    return (
      <Primitive.div role="group" {...props} ref={forwardedRef}>
        <MenuRadioGroupProvider value={context}>{children}</MenuRadioGroupProvider>
      </Primitive.div>
    );
  },
);

export interface DropdownMenuRadioItemProps extends DropdownMenuItemProps {
  value: string;
}

export const DropdownMenuRadioItem = React.forwardRef<HTMLDivElement, DropdownMenuRadioItemProps>(
  function DropdownMenuRadioItem(
    { value, disabled, onSelect, onClick, onKeyDown, onPointerMove, children, ...props },
    forwardedRef,
  ) {
    const group = useMenuRadioGroupContext('DropdownMenuRadioItem');
    const checked = group.value === value;
    const itemProps = useMenuItem({
      disabled,
      onSelect: (event) => {
        group.setValue(value);
        onSelect?.(event);
      },
      onClick,
      onKeyDown,
      onPointerMove,
    });
    const state = React.useMemo(() => ({ checked }), [checked]);

    return (
      <Primitive.div
        role="menuitemradio"
        aria-checked={checked}
        data-state={checked ? 'checked' : 'unchecked'}
        {...itemProps}
        {...props}
        ref={forwardedRef}
      >
        <ItemStateProvider value={state}>{children}</ItemStateProvider>
      </Primitive.div>
    );
  },
);

export interface DropdownMenuItemIndicatorProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
  forceMount?: boolean;
}

/** Shown while its checkbox or radio item is checked. */
export const DropdownMenuItemIndicator = React.forwardRef<HTMLSpanElement, DropdownMenuItemIndicatorProps>(
  function DropdownMenuItemIndicator({ forceMount, ...props }, forwardedRef) {
    const state = useItemStateContext('DropdownMenuItemIndicator');
    if (!forceMount && !state.checked) return null;
    return (
      <Primitive.span
        data-state={state.checked ? 'checked' : 'unchecked'}
        style={{ pointerEvents: 'none', ...props.style }}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

export interface DropdownMenuLabelProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

export const DropdownMenuLabel = React.forwardRef<HTMLDivElement, DropdownMenuLabelProps>(
  function DropdownMenuLabel(props, forwardedRef) {
    return <Primitive.div {...props} ref={forwardedRef} />;
  },
);

export interface DropdownMenuGroupProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

export const DropdownMenuGroup = React.forwardRef<HTMLDivElement, DropdownMenuGroupProps>(
  function DropdownMenuGroup(props, forwardedRef) {
    return <Primitive.div role="group" {...props} ref={forwardedRef} />;
  },
);

export interface DropdownMenuSeparatorProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

export const DropdownMenuSeparator = React.forwardRef<HTMLDivElement, DropdownMenuSeparatorProps>(
  function DropdownMenuSeparator(props, forwardedRef) {
    return <Primitive.div role="separator" aria-orientation="horizontal" {...props} ref={forwardedRef} />;
  },
);
