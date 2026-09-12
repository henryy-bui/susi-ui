import * as React from 'react';
import { Primitive } from '../primitive/Primitive';

/** The one inline style the library ships: hide visually, keep for screen readers. */
export const VISUALLY_HIDDEN_STYLE: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0 0 0 0)',
  whiteSpace: 'nowrap',
  border: 0,
};

export interface VisuallyHiddenProps extends React.ComponentPropsWithoutRef<'span'> {
  asChild?: boolean;
}

/** Content that is hidden visually but announced by assistive technology. */
export const VisuallyHidden = React.forwardRef<HTMLSpanElement, VisuallyHiddenProps>(
  function VisuallyHidden({ style, ...props }, forwardedRef) {
    return <Primitive.span style={{ ...VISUALLY_HIDDEN_STYLE, ...style }} {...props} ref={forwardedRef} />;
  },
);
