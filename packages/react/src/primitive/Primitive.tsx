import * as React from 'react';
import { Slot } from './Slot';

const NODES = ['a', 'button', 'div', 'h3', 'input', 'label', 'li', 'nav', 'ol', 'p', 'span', 'ul'] as const;

type Node = (typeof NODES)[number];

export type PrimitiveProps<E extends Node> = React.ComponentPropsWithoutRef<E> & {
  /** Merge props onto the single child element instead of rendering `<{E} />`. */
  asChild?: boolean;
};

type Primitives = {
  [E in Node]: React.ForwardRefExoticComponent<
    PrimitiveProps<E> & React.RefAttributes<React.ElementRef<E>>
  >;
};

/**
 * DOM elements with `asChild` support baked in. Every component in this library
 * renders through one of these, so consumers can always swap the element.
 */
export const Primitive = NODES.reduce((acc, node) => {
  const Component = React.forwardRef<HTMLElement, PrimitiveProps<Node>>(
    function PrimitiveComponent({ asChild, ...props }, forwardedRef) {
      const Comp: React.ElementType = asChild ? Slot : node;
      return <Comp {...props} ref={forwardedRef} />;
    },
  );
  Component.displayName = `Primitive.${node}`;
  return { ...acc, [node]: Component };
}, {} as Primitives);
