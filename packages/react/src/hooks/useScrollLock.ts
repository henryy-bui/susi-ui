import * as React from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';

let lockCount = 0;
let originalOverflow = '';
let originalPaddingRight = '';

/**
 * Locks body scroll while `enabled`, compensating for the scrollbar width so the
 * page doesn't shift. Reference counted, so nested layers behave.
 */
export function useScrollLock(enabled: boolean) {
  useIsomorphicLayoutEffect(() => {
    if (!enabled || typeof document === 'undefined') return;

    const body = document.body;
    if (lockCount === 0) {
      originalOverflow = body.style.overflow;
      originalPaddingRight = body.style.paddingRight;
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      if (scrollbarWidth > 0) {
        const current = parseInt(window.getComputedStyle(body).paddingRight, 10) || 0;
        body.style.paddingRight = `${current + scrollbarWidth}px`;
      }
      body.style.overflow = 'hidden';
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        body.style.overflow = originalOverflow;
        body.style.paddingRight = originalPaddingRight;
      }
    };
  }, [enabled]);
}
