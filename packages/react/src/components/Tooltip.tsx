import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { Portal, type PortalProps } from '../primitive/Portal';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { useFloatingPosition, type Align, type Side } from '../primitive/useFloatingPosition';
import { useControllableState } from '../hooks/useControllableState';
import { useEscapeKeydown } from '../hooks/useEscapeKeydown';
import { useId } from '../hooks/useId';

interface TooltipProviderContextValue {
  delayDuration: number;
  /** While this is true, the next tooltip opens immediately. */
  isSkipping: () => boolean;
  onOpen: () => void;
  onClose: () => void;
}

const ProviderContext = React.createContext<TooltipProviderContextValue | null>(null);

export interface TooltipProviderProps {
  children?: React.ReactNode;
  /** Hover delay before a tooltip opens, in ms. */
  delayDuration?: number;
  /** After a tooltip closes, others open instantly for this long, in ms. */
  skipDelayDuration?: number;
}

/**
 * Optional shared timing for a group of tooltips: once one has been shown,
 * moving to a neighbouring trigger shows its tooltip without the delay again.
 */
export function TooltipProvider({
  children,
  delayDuration = 400,
  skipDelayDuration = 300,
}: TooltipProviderProps) {
  const skipTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const skippingRef = React.useRef(false);

  React.useEffect(() => () => { if (skipTimerRef.current) clearTimeout(skipTimerRef.current); }, []);

  const value = React.useMemo<TooltipProviderContextValue>(
    () => ({
      delayDuration,
      isSkipping: () => skippingRef.current,
      onOpen: () => {
        if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
        skippingRef.current = false;
      },
      onClose: () => {
        skippingRef.current = true;
        if (skipTimerRef.current) clearTimeout(skipTimerRef.current);
        skipTimerRef.current = setTimeout(() => {
          skippingRef.current = false;
        }, skipDelayDuration);
      },
    }),
    [delayDuration, skipDelayDuration],
  );

  return <ProviderContext.Provider value={value}>{children}</ProviderContext.Provider>;
}
TooltipProvider.displayName = 'TooltipProvider';

interface TooltipContextValue {
  open: boolean;
  contentId: string;
  trigger: HTMLElement | null;
  setTrigger: (node: HTMLElement | null) => void;
  onTriggerEnter: () => void;
  onTriggerLeave: () => void;
  onOpen: () => void;
  onClose: () => void;
}

const [TooltipContextProvider, useTooltipContext] = createContext<TooltipContextValue>('Tooltip');

export interface TooltipProps {
  children?: React.ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Overrides the provider's delay for this tooltip. */
  delayDuration?: number;
}

/** A hover/focus hint. Never focusable itself, so it never traps keyboard users. */
export function Tooltip({ children, open: openProp, defaultOpen = false, onOpenChange, delayDuration }: TooltipProps) {
  const provider = React.useContext(ProviderContext);
  const delay = delayDuration ?? provider?.delayDuration ?? 400;

  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const [trigger, setTrigger] = React.useState<HTMLElement | null>(null);
  const contentId = useId();
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = React.useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);
  React.useEffect(() => clearTimer, [clearTimer]);

  const onOpen = React.useCallback(() => {
    clearTimer();
    provider?.onOpen();
    setOpen(true);
  }, [clearTimer, provider, setOpen]);

  const onClose = React.useCallback(() => {
    clearTimer();
    provider?.onClose();
    setOpen(false);
  }, [clearTimer, provider, setOpen]);

  const onTriggerEnter = React.useCallback(() => {
    if (delay === 0 || provider?.isSkipping()) {
      onOpen();
      return;
    }
    clearTimer();
    timerRef.current = setTimeout(onOpen, delay);
  }, [delay, provider, onOpen, clearTimer]);

  const context = React.useMemo(
    () => ({ open, contentId, trigger, setTrigger, onTriggerEnter, onTriggerLeave: onClose, onOpen, onClose }),
    [open, contentId, trigger, onTriggerEnter, onOpen, onClose],
  );

  return <TooltipContextProvider value={context}>{children}</TooltipContextProvider>;
}
Tooltip.displayName = 'Tooltip';

export interface TooltipTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const TooltipTrigger = React.forwardRef<HTMLButtonElement, TooltipTriggerProps>(
  function TooltipTrigger(
    { onPointerEnter, onPointerLeave, onPointerDown, onFocus, onBlur, ...props },
    forwardedRef,
  ) {
    const context = useTooltipContext('TooltipTrigger');
    // A pointer press focuses the trigger too; only keyboard focus should open
    // the tooltip, so remember how the focus arrived.
    const focusedByPointerRef = React.useRef(false);

    return (
      <Primitive.button
        type="button"
        aria-describedby={context.open ? context.contentId : undefined}
        data-state={context.open ? 'open' : 'closed'}
        onPointerEnter={composeEventHandlers(onPointerEnter, (event) => {
          if (event.pointerType !== 'touch') context.onTriggerEnter();
        })}
        onPointerLeave={composeEventHandlers(onPointerLeave, () => context.onTriggerLeave())}
        // A click means the user is acting, not asking what this does.
        onPointerDown={composeEventHandlers(onPointerDown, () => {
          focusedByPointerRef.current = true;
          context.onClose();
        })}
        onFocus={composeEventHandlers(onFocus, () => {
          if (!focusedByPointerRef.current) context.onOpen();
        })}
        onBlur={composeEventHandlers(onBlur, () => {
          focusedByPointerRef.current = false;
          context.onClose();
        })}
        {...props}
        ref={composeRefs(forwardedRef, context.setTrigger)}
      />
    );
  },
);

export function TooltipPortal({ children, container }: PortalProps) {
  const context = useTooltipContext('TooltipPortal');
  if (!context.open) return null;
  return <Portal container={container}>{children}</Portal>;
}
TooltipPortal.displayName = 'TooltipPortal';

interface TooltipPositionContextValue {
  setArrow: (node: HTMLElement | null) => void;
  arrowStyles: React.CSSProperties;
}

const [TooltipPositionProvider, useTooltipPositionContext] =
  createContext<TooltipPositionContextValue>('TooltipContent');

export interface TooltipContentProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  /** Keep the tooltip open while the pointer is over the content itself. */
  hoverable?: boolean;
}

export const TooltipContent = React.forwardRef<HTMLDivElement, TooltipContentProps>(
  function TooltipContent(
    {
      side = 'top',
      align = 'center',
      sideOffset = 6,
      alignOffset = 0,
      hoverable = false,
      style,
      onPointerEnter,
      onPointerLeave,
      children,
      ...props
    },
    forwardedRef,
  ) {
    const context = useTooltipContext('TooltipContent');
    const [arrowEl, setArrowEl] = React.useState<HTMLElement | null>(null);

    const { setFloating, floatingStyles, side: resolvedSide, align: resolvedAlign, arrowStyles } =
      useFloatingPosition({
        open: context.open,
        reference: context.trigger,
        side,
        align,
        sideOffset,
        alignOffset,
        arrowElement: arrowEl,
      });

    useEscapeKeydown(() => {
      if (context.open) context.onClose();
    });

    const positionContext = React.useMemo(() => ({ setArrow: setArrowEl, arrowStyles }), [arrowStyles]);

    if (!context.open) return null;

    return (
      <TooltipPositionProvider value={positionContext}>
        <Primitive.div
          role="tooltip"
          id={context.contentId}
          data-state="open"
          data-side={resolvedSide}
          data-align={resolvedAlign}
          onPointerEnter={composeEventHandlers(onPointerEnter, () => {
            if (hoverable) context.onOpen();
          })}
          onPointerLeave={composeEventHandlers(onPointerLeave, () => {
            if (hoverable) context.onClose();
          })}
          style={{ ...floatingStyles, pointerEvents: hoverable ? undefined : 'none', ...style }}
          {...props}
          ref={composeRefs(forwardedRef, setFloating as React.Ref<HTMLDivElement>)}
        >
          {children}
        </Primitive.div>
      </TooltipPositionProvider>
    );
  },
);

export interface TooltipArrowProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
}

export const TooltipArrow = React.forwardRef<HTMLSpanElement, TooltipArrowProps>(function TooltipArrow(
  { style, ...props },
  forwardedRef,
) {
  const position = useTooltipPositionContext('TooltipArrow');
  return (
    <Primitive.span
      style={{ ...position.arrowStyles, ...style }}
      {...props}
      ref={composeRefs(forwardedRef, position.setArrow)}
    />
  );
});
