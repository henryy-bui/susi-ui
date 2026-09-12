import * as React from 'react';
import { useCallbackRef } from './useCallbackRef';

export interface UseControllableStateParams<T> {
  /** Controlled value. When provided, the component never owns the state. */
  prop?: T | undefined;
  /** Initial value in uncontrolled mode. */
  defaultProp: T;
  /** Called whenever the value should change, in both modes. */
  onChange?: (value: T) => void;
}

/**
 * One state hook for both controlled and uncontrolled usage — the pattern every
 * component here uses so consumers can pick either without a second component.
 */
export function useControllableState<T>({
  prop,
  defaultProp,
  onChange,
}: UseControllableStateParams<T>): [T, (next: React.SetStateAction<T>) => void] {
  const [uncontrolledValue, setUncontrolledValue] = React.useState<T>(defaultProp);
  const isControlled = prop !== undefined;
  const value = isControlled ? prop : uncontrolledValue;
  const handleChange = useCallbackRef(onChange);

  const setValue = React.useCallback(
    (next: React.SetStateAction<T>) => {
      const resolve = (current: T) => (typeof next === 'function' ? (next as (p: T) => T)(current) : next);

      if (isControlled) {
        const nextValue = resolve(prop as T);
        if (!Object.is(nextValue, prop)) handleChange(nextValue);
        return;
      }

      setUncontrolledValue((current) => {
        const nextValue = resolve(current);
        if (!Object.is(nextValue, current)) handleChange(nextValue);
        return nextValue;
      });
    },
    [isControlled, prop, handleChange],
  );

  return [value, setValue];
}
