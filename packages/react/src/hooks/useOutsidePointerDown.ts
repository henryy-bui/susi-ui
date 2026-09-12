import * as React from 'react';
import { useCallbackRef } from './useCallbackRef';

/**
 * Fires when a pointer goes down outside every element in `refs`. Used by the
 * overlay components to dismiss on an outside click.
 */
export function useOutsidePointerDown(
  enabled: boolean,
  refs: Array<React.RefObject<HTMLElement | null>>,
  onPointerDownOutside?: (event: PointerEvent) => void,
) {
  const onOutside = useCallbackRef(onPointerDownOutside);
  // Refs are captured per render but the array identity changes; hold it in a ref.
  const refsRef = React.useRef(refs);
  refsRef.current = refs;

  React.useEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target || !target.isConnected) return;
      const isInside = refsRef.current.some((ref) => ref.current?.contains(target));
      if (!isInside) onOutside(event);
    };

    // Pointerdown on the document, so a click that opens another layer still
    // closes this one before the new layer mounts.
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [enabled, onOutside]);
}
