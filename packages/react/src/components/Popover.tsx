import * as React from 'react';
import { useFloating, autoUpdate, offset, flip, shift, arrow, type Placement } from '@floating-ui/react-dom';
import { Primitive } from '../primitive/Primitive';
import { Portal, type PortalProps } from '../primitive/Portal';
import { FocusScope } from '../primitive/FocusScope';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { useControllableState } from '../hooks/useControllableState';
import { useEscapeKeydown } from '../hooks/useEscapeKeydown';
import { useOutsidePointerDown } from '../hooks/useOutsidePointerDown';
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
  placement: Placement;
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
  side?: 'top' | 'right' | 'bottom' | 'left';
  align?: 'start' | 'center' | 'end';
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

  const placement = (align === 'center' ? side : `${side}-${align}`) as Placement;

  // Floating UI re-runs positioning whenever the middleware array identity
  // changes, so it has to be memoised.
  const middleware = React.useMemo(
    () => [
      offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
      flip({ padding: 8 }),
      shift({ padding: 8 }),
      ...(arrowEl ? [arrow({ element: arrowEl, padding: 4 })] : []),
    ],
    [sideOffset, alignOffset, arrowEl],
  );

  const { refs, floatingStyles, placement: resolvedPlacement, middlewareData } = useFloating({
    placement,
    open,
    whileElementsMounted: autoUpdate,
    elements: { reference: context.reference },
    middleware,
  });

  useEscapeKeydown((event) => {
    if (!open) return;
    onEscapeKeyDown?.(event);
    if (!event.defaultPrevented) context.setOpen(false);
  });

  useOutsidePointerDown(open, [context.contentRef, context.triggerRef], (event) => {
    onPointerDownOutside?.(event);
    if (!event.defaultPrevented) context.setOpen(false);
  });

  const arrowData = middlewareData.arrow;
  const positionContext = React.useMemo<PositionContextValue>(
    () => ({
      placement: resolvedPlacement,
      setArrow: setArrowEl,
      arrowStyles: {
        position: 'absolute',
        left: arrowData?.x != null ? `${arrowData.x}px` : undefined,
        top: arrowData?.y != null ? `${arrowData.y}px` : undefined,
      },
    }),
    [resolvedPlacement, arrowData?.x, arrowData?.y],
  );

  if (!open) return null;

  const [resolvedSide, resolvedAlign = 'center'] = resolvedPlacement.split('-');

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
        ref={composeRefs(forwardedRef, context.contentRef, refs.setFloating as React.Ref<HTMLDivElement>)}
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
