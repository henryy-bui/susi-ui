import * as React from 'react';
import { useCallbackRef } from './useCallbackRef';

/** Fires when Escape is pressed anywhere in `ownerDocument`. */
export function useEscapeKeydown(
  onEscapeKeyDown?: (event: KeyboardEvent) => void,
  ownerDocument: Document | undefined = typeof document !== 'undefined' ? document : undefined,
) {
  const onEscape = useCallbackRef(onEscapeKeyDown);

  React.useEffect(() => {
    if (!ownerDocument) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onEscape(event);
    };
    ownerDocument.addEventListener('keydown', handleKeyDown, { capture: true });
    return () => ownerDocument.removeEventListener('keydown', handleKeyDown, { capture: true });
  }, [onEscape, ownerDocument]);
}
