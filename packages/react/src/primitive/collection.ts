/** Helpers for keyboard navigation over a set of DOM items within a container. */

/** Items marked with `attr` that aren't disabled, in document order. */
export function getItems(container: HTMLElement | null, attr: string): HTMLElement[] {
  if (!container) return [];
  return Array.from(container.querySelectorAll<HTMLElement>(`[${attr}]`)).filter(
    (item) => !item.hasAttribute('disabled') && item.getAttribute('data-disabled') === null,
  );
}

export interface NextIndexParams {
  key: string;
  current: number;
  length: number;
  loop?: boolean;
  orientation?: 'vertical' | 'horizontal' | 'both';
}

/**
 * Resolves an arrow/Home/End key to the next index, or `-1` when the key isn't
 * a navigation key for this orientation.
 */
export function nextIndexForKey({
  key,
  current,
  length,
  loop = true,
  orientation = 'vertical',
}: NextIndexParams): number {
  if (length === 0) return -1;

  const forward = orientation === 'horizontal' ? ['ArrowRight'] : orientation === 'vertical' ? ['ArrowDown'] : ['ArrowDown', 'ArrowRight'];
  const backward = orientation === 'horizontal' ? ['ArrowLeft'] : orientation === 'vertical' ? ['ArrowUp'] : ['ArrowUp', 'ArrowLeft'];

  if (key === 'Home') return 0;
  if (key === 'End') return length - 1;
  if (forward.includes(key)) {
    if (current === -1) return 0;
    return loop ? (current + 1) % length : Math.min(current + 1, length - 1);
  }
  if (backward.includes(key)) {
    if (current === -1) return length - 1;
    return loop ? (current - 1 + length) % length : Math.max(current - 1, 0);
  }
  return -1;
}

export function focusItem(item: HTMLElement | undefined) {
  item?.focus({ preventScroll: false });
}
