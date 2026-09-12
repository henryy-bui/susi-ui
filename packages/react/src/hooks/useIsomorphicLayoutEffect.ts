import * as React from 'react';

/** `useLayoutEffect` that degrades to `useEffect` on the server. */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;
