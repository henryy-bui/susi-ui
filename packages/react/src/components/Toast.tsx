import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { Portal } from '../primitive/Portal';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { useCallbackRef } from '../hooks/useCallbackRef';
import { useControllableState } from '../hooks/useControllableState';
import { useId } from '../hooks/useId';

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';

interface ToastProviderContextValue {
  label: string;
  duration: number;
  swipeDirection: SwipeDirection;
  swipeThreshold: number;
  /** Toasts pause while the viewport is hovered or holds focus. */
  isPaused: boolean;
  setPaused: (paused: boolean) => void;
  /** Toasts render here, wherever they are declared. */
  viewport: HTMLOListElement | null;
  setViewport: (node: HTMLOListElement | null) => void;
}

const [ToastProviderImpl, useToastProviderContext] =
  createContext<ToastProviderContextValue>('ToastProvider');

export interface ToastProviderProps {
  children?: React.ReactNode;
  /** Announced label for the viewport region. */
  label?: string;
  /** Default auto-dismiss time in ms. `Infinity` keeps toasts until dismissed. */
  duration?: number;
  swipeDirection?: SwipeDirection;
  /** Distance in px a swipe must travel to dismiss. */
  swipeThreshold?: number;
}

/** Shares toast defaults and the hover/focus pause state with every toast. */
export function ToastProvider({
  children,
  label = 'Notifications',
  duration = 5000,
  swipeDirection = 'right',
  swipeThreshold = 50,
}: ToastProviderProps) {
  const [isPaused, setPaused] = React.useState(false);
  const [viewport, setViewport] = React.useState<HTMLOListElement | null>(null);

  const context = React.useMemo(
    () => ({
      label,
      duration,
      swipeDirection,
      swipeThreshold,
      isPaused,
      setPaused,
      viewport,
      setViewport,
    }),
    [label, duration, swipeDirection, swipeThreshold, isPaused, viewport],
  );

  return <ToastProviderImpl value={context}>{children}</ToastProviderImpl>;
}
ToastProvider.displayName = 'ToastProvider';

export interface ToastViewportProps extends React.ComponentPropsWithoutRef<'ol'> {
  asChild?: boolean;
  /** Keys that move focus to the viewport, as `event.key` values. */
  hotkey?: string[];
}

/**
 * Where toasts render. It is a live region that exists before any toast does,
 * so insertions are announced, and it can be reached with a hotkey (F8).
 */
export const ToastViewport = React.forwardRef<HTMLOListElement, ToastViewportProps>(
  function ToastViewport(
    { hotkey = ['F8'], onPointerEnter, onPointerLeave, onFocus, onBlur, ...props },
    forwardedRef,
  ) {
    const context = useToastProviderContext('ToastViewport');
    const [node, setNode] = React.useState<HTMLOListElement | null>(null);
    const setPaused = useCallbackRef(context.setPaused);

    React.useEffect(() => {
      if (!node) return;
      const handleKeyDown = (event: KeyboardEvent) => {
        if (hotkey.includes(event.key)) node.focus();
      };
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [node, hotkey]);

    return (
      <Primitive.ol
        // A region rather than a list role, so screen reader users can jump to it.
        role="region"
        aria-label={`${context.label} (${hotkey.join(', ')})`}
        aria-live="polite"
        aria-relevant="additions text"
        aria-atomic="false"
        tabIndex={-1}
        onPointerEnter={composeEventHandlers(onPointerEnter, () => setPaused(true))}
        onPointerLeave={composeEventHandlers(onPointerLeave, () => setPaused(false))}
        onFocus={composeEventHandlers(onFocus, () => setPaused(true))}
        onBlur={composeEventHandlers(onBlur, (event) => {
          if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
        })}
        {...props}
        ref={composeRefs(forwardedRef, setNode, context.setViewport)}
      />
    );
  },
);

interface ToastContextValue {
  titleId: string;
  descriptionId: string;
  close: () => void;
}

const [ToastContextProvider, useToastContext] = createContext<ToastContextValue>('Toast');

export interface ToastProps extends Omit<React.ComponentPropsWithoutRef<'li'>, 'title'> {
  asChild?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Overrides the provider's duration. `Infinity` disables auto-dismiss. */
  duration?: number;
  /**
   * `foreground` interrupts the screen reader for things the user must know now;
   * `background` waits its turn.
   */
  type?: 'foreground' | 'background';
  onEscapeKeyDown?: (event: React.KeyboardEvent) => void;
  onSwipeStart?: (event: React.PointerEvent) => void;
  onSwipeMove?: (event: React.PointerEvent, delta: { x: number; y: number }) => void;
  onSwipeCancel?: (event: React.PointerEvent) => void;
  onSwipeEnd?: (event: React.PointerEvent, delta: { x: number; y: number }) => void;
}

/**
 * A single notification. It dismisses itself after `duration`, pausing while the
 * viewport is hovered or focused, and can be swiped away.
 */
export const Toast = React.forwardRef<HTMLLIElement, ToastProps>(function Toast(
  {
    open: openProp,
    defaultOpen = true,
    onOpenChange,
    duration: durationProp,
    type = 'foreground',
    onEscapeKeyDown,
    onSwipeStart,
    onSwipeMove,
    onSwipeCancel,
    onSwipeEnd,
    onKeyDown,
    onPointerDown,
    onPointerMove,
    onPointerUp,
    children,
    ...props
  },
  forwardedRef,
) {
  const provider = useToastProviderContext('Toast');
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const baseId = useId();
  const duration = durationProp ?? provider.duration;

  const close = React.useCallback(() => setOpen(false), [setOpen]);
  const handleClose = useCallbackRef(close);

  // Auto-dismiss, with the remaining time preserved across pauses.
  const remainingRef = React.useRef(duration);
  React.useEffect(() => {
    remainingRef.current = duration;
  }, [duration]);

  React.useEffect(() => {
    if (!open || provider.isPaused || duration === Infinity || duration <= 0) return;

    const startedAt = Date.now();
    const timer = setTimeout(handleClose, remainingRef.current);
    return () => {
      clearTimeout(timer);
      remainingRef.current = Math.max(remainingRef.current - (Date.now() - startedAt), 0);
    };
  }, [open, provider.isPaused, duration, handleClose]);

  const swipeStartRef = React.useRef<{ x: number; y: number } | null>(null);
  const [swipeState, setSwipeState] = React.useState<'start' | 'move' | 'cancel' | 'end' | null>(null);
  const [swipeDelta, setSwipeDelta] = React.useState<{ x: number; y: number } | null>(null);

  const axis = provider.swipeDirection === 'left' || provider.swipeDirection === 'right' ? 'x' : 'y';
  const sign = provider.swipeDirection === 'right' || provider.swipeDirection === 'down' ? 1 : -1;

  const context = React.useMemo(
    () => ({ titleId: `${baseId}-title`, descriptionId: `${baseId}-description`, close }),
    [baseId, close],
  );

  if (!open) return null;

  const toast = (
    <Primitive.li
      // The viewport is the live region; each toast is an atomic announcement.
      role={type === 'foreground' ? 'alert' : 'status'}
      aria-live={type === 'foreground' ? 'assertive' : 'polite'}
      aria-atomic="true"
      tabIndex={0}
      data-state="open"
      data-swipe={swipeState ?? undefined}
      data-swipe-direction={provider.swipeDirection}
      style={{
        ...(swipeDelta
          ? {
              ['--susi-toast-swipe-move-x' as string]: `${swipeDelta.x}px`,
              ['--susi-toast-swipe-move-y' as string]: `${swipeDelta.y}px`,
            }
          : undefined),
        ...props.style,
      }}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if (event.key !== 'Escape') return;
        onEscapeKeyDown?.(event);
        if (!event.defaultPrevented) close();
      })}
      onPointerDown={composeEventHandlers(onPointerDown, (event) => {
        if (event.button !== 0) return;
        swipeStartRef.current = { x: event.clientX, y: event.clientY };
        setSwipeState('start');
        onSwipeStart?.(event);
      })}
      onPointerMove={composeEventHandlers(onPointerMove, (event) => {
        const start = swipeStartRef.current;
        if (!start) return;

        const delta = { x: event.clientX - start.x, y: event.clientY - start.y };
        // Only movement along the swipe direction counts.
        const travelled = delta[axis] * sign;
        if (travelled <= 0) return;

        event.currentTarget.setPointerCapture?.(event.pointerId);
        setSwipeState('move');
        setSwipeDelta(axis === 'x' ? { x: delta.x, y: 0 } : { x: 0, y: delta.y });
        onSwipeMove?.(event, delta);
      })}
      onPointerUp={composeEventHandlers(onPointerUp, (event) => {
        const start = swipeStartRef.current;
        swipeStartRef.current = null;
        if (!start) return;

        const delta = { x: event.clientX - start.x, y: event.clientY - start.y };
        const travelled = delta[axis] * sign;

        if (travelled >= provider.swipeThreshold) {
          setSwipeState('end');
          onSwipeEnd?.(event, delta);
          if (!event.defaultPrevented) close();
          return;
        }

        setSwipeState('cancel');
        setSwipeDelta(null);
        onSwipeCancel?.(event);
      })}
      {...props}
      ref={forwardedRef}
    >
      <ToastContextProvider value={context}>{children}</ToastContextProvider>
    </Primitive.li>
  );

  // Toasts are declared wherever they make sense and rendered in the viewport,
  // which is the live region. Without a viewport they render in place.
  return provider.viewport ? <Portal container={provider.viewport}>{toast}</Portal> : toast;
});

export interface ToastTitleProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

export const ToastTitle = React.forwardRef<HTMLDivElement, ToastTitleProps>(function ToastTitle(
  props,
  forwardedRef,
) {
  const context = useToastContext('ToastTitle');
  return <Primitive.div id={context.titleId} {...props} ref={forwardedRef} />;
});

export interface ToastDescriptionProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
}

export const ToastDescription = React.forwardRef<HTMLDivElement, ToastDescriptionProps>(
  function ToastDescription(props, forwardedRef) {
    const context = useToastContext('ToastDescription');
    return <Primitive.div id={context.descriptionId} {...props} ref={forwardedRef} />;
  },
);

export interface ToastActionProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
  /**
   * How to achieve the same thing without the toast — screen reader users may
   * never reach a toast before it disappears.
   */
  altText: string;
  /** Keep the toast open after the action runs. */
  keepOpen?: boolean;
}

export const ToastAction = React.forwardRef<HTMLButtonElement, ToastActionProps>(function ToastAction(
  { altText, keepOpen = false, onClick, ...props },
  forwardedRef,
) {
  const context = useToastContext('ToastAction');
  return (
    <Primitive.button
      type="button"
      data-alt-text={altText}
      onClick={composeEventHandlers(onClick, () => {
        if (!keepOpen) context.close();
      })}
      {...props}
      ref={forwardedRef}
    />
  );
});

export interface ToastCloseProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const ToastClose = React.forwardRef<HTMLButtonElement, ToastCloseProps>(function ToastClose(
  { onClick, ...props },
  forwardedRef,
) {
  const context = useToastContext('ToastClose');
  return (
    <Primitive.button
      type="button"
      onClick={composeEventHandlers(onClick, () => context.close())}
      {...props}
      ref={forwardedRef}
    />
  );
});
