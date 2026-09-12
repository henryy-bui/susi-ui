import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';

export interface PortalProps {
  children?: React.ReactNode;
  /** Where to render. Defaults to `document.body`. */
  container?: Element | DocumentFragment | null;
}

/** Renders children into `container`, and nothing at all during SSR. */
export function Portal({ children, container }: PortalProps) {
  const [mounted, setMounted] = React.useState(false);
  useIsomorphicLayoutEffect(() => setMounted(true), []);

  if (!mounted) return null;
  const target = container ?? (typeof document !== 'undefined' ? document.body : null);
  return target ? ReactDOM.createPortal(children, target) : null;
}
Portal.displayName = 'Portal';
