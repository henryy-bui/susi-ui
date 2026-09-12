import * as React from 'react';
import { Primitive } from '../primitive/Primitive';

export interface SeparatorProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
  orientation?: 'horizontal' | 'vertical';
  /** Purely visual separators are hidden from assistive technology. */
  decorative?: boolean;
}

export const Separator = React.forwardRef<HTMLDivElement, SeparatorProps>(function Separator(
  { orientation = 'horizontal', decorative = true, ...props },
  forwardedRef,
) {
  return (
    <Primitive.div
      role={decorative ? 'none' : 'separator'}
      // A horizontal separator is the implicit default, so it needs no attribute.
      aria-orientation={!decorative && orientation === 'vertical' ? 'vertical' : undefined}
      data-orientation={orientation}
      {...props}
      ref={forwardedRef}
    />
  );
});
