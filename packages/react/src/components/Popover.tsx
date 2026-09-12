import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { Portal, type PortalProps } from '../primitive/Portal';
import { FocusScope } from '../primitive/FocusScope';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { useFloatingPosition, type Align, type Side } from '../primitive/useFloatingPosition';
import { useControllableState } from '../hooks/useControllableState';
import { useDismiss } from '../hooks/useDismiss';
import { useId } from '../hooks/useId';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
  modal: boolean;
  triggerRef: React.RefObject<HTMLButtonElement | null>;
  contentRef: React.RefObject<HTMLDivElement | null>;
  /** The element the content is positioned against: an explicit anchor, else the trigger. */
  reference: HTMLElement | null;
  setAnchor: (node: HTMLElement | null) => void;
  setTrigger: (node: HTMLButtonElement | null) => void;
}

const [PopoverProvider, usePopoverContext] = createContext<PopoverContextValue>('Popover');

interface PositionContextValue {
  setArrow: (node: HTMLElement | null) => void;
  arrowStyles: React.CSSProperties;
}

const [PositionProvider, usePositionContext] = createContext<PositionContextValue>('PopoverContent');

export interface PopoverProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Trap focus inside the content while open. */
  modal?: boolean;
}

/** A floating panel anchored to a trigger, positioned with Floating UI. */
export function Popover({
  children,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  modal = false,
}: PopoverProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const contentId = useId();
  const triggerRef = React.useRef<HTMLButtonElement>(null);
  const contentRef = React.useRef<HTMLDivElement>(null);
  const [anchor, setAnchor] = React.useState<HTMLElement | null>(null);
  const [trigger, setTrigger] = React.useState<HTMLButtonElement | null>(null);

  const context = React.useMemo(
    () => ({
      open,
      setOpen: setOpen as (open: boolean) => void,
      contentId,
      modal,
      triggerRef,
      contentRef,
      reference: anchor ?? trigger,
      setAnchor,
      setTrigger,
    }),
    [open, setOpen, contentId, modal, anchor, trigger],
  );

  return <PopoverProvider value={context}>{children}</PopoverProvider>;
}
Popover.displayName = 'Popover';

export interface PopoverAnchorProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

/** Optional: position the content against this element instead of the trigger. */
export const PopoverAnchor = React.forwardRef<HTMLDivElement, PopoverAnchorProps>(function PopoverAnchor(
  props,
  forwardedRef,
) {
  const context = usePopoverContext('PopoverAnchor');
  return <Primitive.div {...props} ref={composeRefs(forwardedRef, context.setAnchor)} />;
});

export interface PopoverTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const PopoverTrigger = React.forwardRef<HTMLButtonElement, PopoverTriggerProps>(
  function PopoverTrigger({ onClick, ...props }, forwardedRef) {
    const context = usePopoverContext('PopoverTrigger');

    return (
      <Primitive.button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={context.open}
        aria-controls={context.open ? context.contentId : undefined}
        data-state={context.open ? 'open' : 'closed'}
        onClick={composeEventHandlers(onClick, () => context.setOpen(!context.open))}
        {...props}
        ref={composeRefs(forwardedRef, context.triggerRef, context.setTrigger)}
      />
    );
  },
);

export function PopoverPortal({ children, container }: PortalProps) {
  const context = usePopoverContext('PopoverPortal');
  if (!context.open) return null;
  return <Portal container={container}>{children}</Portal>;
}
PopoverPortal.displayName = 'PopoverPortal';

export interface PopoverContentProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
  side?: Side;
  align?: Align;
  /** Distance in px between the anchor and the content. */
  sideOffset?: number;
  /** Shift along the alignment axis, in px. */
  alignOffset?: number;
  /** Keep focus inside while open (defaults to the root's `modal`). */
  trapFocus?: boolean;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onOpenAutoFocus?: (event: Event) => void;
  onCloseAutoFocus?: (event: Event) => void;
}

export const PopoverContent = React.forwardRef<HTMLDivElement, PopoverContentProps>(function PopoverContent(
  {
    side = 'bottom',
    align = 'center',
    sideOffset = 4,
    alignOffset = 0,
    trapFocus,
    onEscapeKeyDown,
    onPointerDownOutside,
    onOpenAutoFocus,
    onCloseAutoFocus,
    style,
    children,
    ...props
  },
  forwardedRef,
) {
  const context = usePopoverContext('PopoverContent');
  const [arrowEl, setArrowEl] = React.useState<HTMLElement | null>(null);
  const open = context.open;

  const {
    setFloating,
    floatingStyles,
    side: resolvedSide,
    align: resolvedAlign,
    arrowStyles,
  } = useFloatingPosition({
    open,
    reference: context.reference,
    side,
    align,
    sideOffset,
    alignOffset,
    arrowElement: arrowEl,
  });

  useDismiss({
    enabled: open,
    refs: [context.contentRef, context.triggerRef],
    onEscapeKeyDown,
    onPointerDownOutside,
    onDismiss: () => context.setOpen(false),
  });

  const positionContext = React.useMemo<PositionContextValue>(
    () => ({ setArrow: setArrowEl, arrowStyles }),
    [arrowStyles],
  );

  if (!open) return null;

  return (
    <PositionProvider value={positionContext}>
      <FocusScope
        role="dialog"
        id={context.contentId}
        data-state={open ? 'open' : 'closed'}
        data-side={resolvedSide}
        data-align={resolvedAlign}
        trapped={trapFocus ?? context.modal}
        onMountAutoFocus={onOpenAutoFocus}
        onUnmountAutoFocus={onCloseAutoFocus}
        style={{ ...floatingStyles, ...style }}
        {...props}
        ref={composeRefs(forwardedRef, context.contentRef, setFloating as React.Ref<HTMLDivElement>)}
      >
        {children}
      </FocusScope>
    </PositionProvider>
  );
});

export interface PopoverArrowProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
}

/** Positioned arrow element; style it yourself (e.g. a rotated square). */
export const PopoverArrow = React.forwardRef<HTMLSpanElement, PopoverArrowProps>(function PopoverArrow(
  { style, ...props },
  forwardedRef,
) {
  const position = usePositionContext('PopoverArrow');
  return (
    <Primitive.span
      style={{ ...position.arrowStyles, ...style }}
      {...props}
      ref={composeRefs(forwardedRef, position.setArrow)}
    />
  );
});

export interface PopoverCloseProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const PopoverClose = React.forwardRef<HTMLButtonElement, PopoverCloseProps>(function PopoverClose(
  { onClick, ...props },
  forwardedRef,
) {
  const context = usePopoverContext('PopoverClose');
  return (
    <Primitive.button
      type="button"
      onClick={composeEventHandlers(onClick, () => context.setOpen(false))}
      {...props}
      ref={forwardedRef}
    />
  );
});
