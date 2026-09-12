import * as React from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

/**
 * Keeps a stable function identity while always calling the latest callback, so
 * effects don't re-run when a consumer passes an inline handler.
 */
export function useCallbackRef<Args extends unknown[], Return>(
  callback: ((...args: Args) => Return) | undefined,
): (...args: Args) => Return | undefined {
  const callbackRef = React.useRef(callback);

  useIsomorphicLayoutEffect(() => {
    callbackRef.current = callback;
  });

  return React.useCallback((...args: Args) => callbackRef.current?.(...args), []);
}
