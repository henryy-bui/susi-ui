import * as React from 'react';
import { composeRefs } from './composeRefs';
import { getTabbableCandidates } from './focusable';
import { useCallbackRef } from '../hooks/useCallbackRef';

export interface FocusScopeProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Keep Tab focus inside the scope. */
  trapped?: boolean;
  /** Move focus into the scope on mount. */
  autoFocus?: boolean;
  /** Restore focus to the previously focused element on unmount. */
  restoreFocus?: boolean;
  onMountAutoFocus?: (event: Event) => void;
  onUnmountAutoFocus?: (event: Event) => void;
}

/**
 * Focus management for overlay content: trap Tab, focus on mount, restore on
 * unmount. Rendered as a plain `div` so it can carry the content's props.
 */
export const FocusScope = React.forwardRef<HTMLDivElement, FocusScopeProps>(function FocusScope(
  {
    trapped = true,
    autoFocus = true,
    restoreFocus = true,
    onMountAutoFocus,
    onUnmountAutoFocus,
    ...props
  },
  forwardedRef,
) {
  const [container, setContainer] = React.useState<HTMLDivElement | null>(null);
  const composedRef = composeRefs<HTMLDivElement>(forwardedRef, setContainer);
  const handleMountAutoFocus = useCallbackRef(onMountAutoFocus);
  const handleUnmountAutoFocus = useCallbackRef(onUnmountAutoFocus);

  React.useEffect(() => {
    if (!container) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    if (autoFocus) {
      const event = new CustomEvent('susi.focusScope.mountAutoFocus', { bubbles: false, cancelable: true });
      handleMountAutoFocus(event);
      if (!event.defaultPrevented && !container.contains(document.activeElement)) {
        const [first] = getTabbableCandidates(container);
        (first ?? container).focus({ preventScroll: true });
      }
    }

    return () => {
      if (!restoreFocus) return;
      const event = new CustomEvent('susi.focusScope.unmountAutoFocus', { bubbles: false, cancelable: true });
      handleUnmountAutoFocus(event);
      if (!event.defaultPrevented && previouslyFocused?.isConnected) {
        previouslyFocused.focus({ preventScroll: true });
      }
    };
  }, [container, autoFocus, restoreFocus, handleMountAutoFocus, handleUnmountAutoFocus]);

  React.useEffect(() => {
    if (!trapped || !container) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Tab' || event.altKey || event.ctrlKey || event.metaKey) return;

      const candidates = getTabbableCandidates(container);
      const first = candidates[0];
      const last = candidates[candidates.length - 1];
      const active = document.activeElement as HTMLElement | null;

      if (candidates.length === 0) {
        event.preventDefault();
        container.focus({ preventScroll: true });
        return;
      }

      if (!event.shiftKey && active === last) {
        event.preventDefault();
        first?.focus({ preventScroll: true });
      } else if (event.shiftKey && (active === first || active === container)) {
        event.preventDefault();
        last?.focus({ preventScroll: true });
      } else if (active && !container.contains(active)) {
        event.preventDefault();
        first?.focus({ preventScroll: true });
      }
    };

    container.addEventListener('keydown', handleKeyDown);
    return () => container.removeEventListener('keydown', handleKeyDown);
  }, [trapped, container]);

  return <div tabIndex={-1} {...props} ref={composedRef} />;
});
