import * as React from 'react';
import { useEscapeKeydown } from './useEscapeKeydown';
import { useOutsidePointerDown } from './useOutsidePointerDown';

export interface UseDismissParams {
  enabled: boolean;
  /** Elements that count as "inside" — a pointer down in any of them is ignored. */
  refs: Array<React.RefObject<HTMLElement | null>>;
  onEscapeKeyDown?: (event: KeyboardEvent) => void;
  onPointerDownOutside?: (event: PointerEvent) => void;
  onDismiss: () => void;
}

/**
 * Escape-to-close plus outside-pointer-to-close, with the consumer able to veto
 * either by calling `preventDefault()` on the event it receives.
 */
export function useDismiss({
  enabled,
  refs,
  onEscapeKeyDown,
  onPointerDownOutside,
  onDismiss,
}: UseDismissParams) {
  useEscapeKeydown((event) => {
    if (!enabled) return;
    onEscapeKeyDown?.(event);
    if (!event.defaultPrevented) onDismiss();
  });

  useOutsidePointerDown(enabled, refs, (event) => {
    onPointerDownOutside?.(event);
    if (!event.defaultPrevented) onDismiss();
  });
}
