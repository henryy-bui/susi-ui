import type { Ref } from 'react';

type PossibleRef<T> = Ref<T> | undefined;

function setRef<T>(ref: PossibleRef<T>, value: T | null): (() => void) | void {
  if (typeof ref === 'function') {
    // React 19 ref callbacks may return a cleanup function.
    return ref(value) as unknown as (() => void) | void;
  }
  if (ref !== null && ref !== undefined) {
    (ref as { current: T | null }).current = value;
  }
}

/**
 * Merges several refs into a single ref callback, so a component can forward a
 * consumer ref while still keeping its own handle on the node.
 */
export function composeRefs<T>(...refs: PossibleRef<T>[]): (node: T | null) => void {
  return (node: T | null) => {
    const cleanups = refs.map((ref) => setRef(ref, node));

    return () => {
      cleanups.forEach((cleanup, i) => {
        if (typeof cleanup === 'function') cleanup();
        else setRef(refs[i], null);
      });
    };
  };
}
