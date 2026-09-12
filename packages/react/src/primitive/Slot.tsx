import * as React from 'react';
import { composeRefs } from './composeRefs';

type AnyProps = Record<string, unknown>;

export interface SlotProps extends React.HTMLAttributes<HTMLElement> {
  children?: React.ReactNode;
}

/**
 * Renders its child element, merging its own props onto it. This is what powers
 * the `asChild` prop: `<Button asChild><a href="/" /></Button>` renders an
 * anchor that still carries all of Button's behaviour.
 */
export const Slot = React.forwardRef<HTMLElement, SlotProps>(function Slot(props, forwardedRef) {
  const { children, ...slotProps } = props;

  if (!React.isValidElement(children)) {
    if (React.Children.count(children) > 1) {
      throw new Error('`asChild` expects a single React element child.');
    }
    return null;
  }

  const childProps = children.props as AnyProps;
  const childRef = (children as unknown as { ref?: React.Ref<HTMLElement> }).ref;

  return React.cloneElement(children as React.ReactElement<AnyProps>, {
    ...mergeProps(slotProps as AnyProps, childProps),
    ref: forwardedRef ? composeRefs(forwardedRef, childRef) : childRef,
  });
});

function mergeProps(slotProps: AnyProps, childProps: AnyProps): AnyProps {
  const merged: AnyProps = { ...slotProps };

  for (const key in childProps) {
    const slotValue = slotProps[key];
    const childValue = childProps[key];

    if (/^on[A-Z]/.test(key)) {
      // Both handlers run; the child's handler wins the right to go first.
      if (typeof slotValue === 'function' && typeof childValue === 'function') {
        merged[key] = (...args: unknown[]) => {
          (childValue as (...a: unknown[]) => void)(...args);
          (slotValue as (...a: unknown[]) => void)(...args);
        };
        continue;
      }
    } else if (key === 'style') {
      merged[key] = { ...(slotValue as object), ...(childValue as object) };
      continue;
    } else if (key === 'className') {
      merged[key] = [slotValue, childValue].filter(Boolean).join(' ');
      continue;
    }

    merged[key] = childValue !== undefined ? childValue : slotValue;
  }

  return merged;
}
