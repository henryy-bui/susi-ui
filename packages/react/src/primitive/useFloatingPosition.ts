import * as React from 'react';
import {
  arrow,
  autoUpdate,
  flip,
  offset,
  shift,
  size,
  useFloating,
  type Placement,
} from '@floating-ui/react-dom';

export type Side = 'top' | 'right' | 'bottom' | 'left';
export type Align = 'start' | 'center' | 'end';

export interface UseFloatingPositionParams {
  open: boolean;
  /** Element to position against. */
  reference: HTMLElement | null;
  side?: Side;
  align?: Align;
  sideOffset?: number;
  alignOffset?: number;
  arrowElement?: HTMLElement | null;
  /** Expose the anchor's width as `--susi-anchor-width` (used by Select). */
  matchAnchorWidth?: boolean;
  /** Cap the content to the available space via `--susi-available-height`. */
  collisionPadding?: number;
}

export interface FloatingPosition {
  setFloating: (node: HTMLElement | null) => void;
  floatingStyles: React.CSSProperties;
  side: Side;
  align: Align;
  arrowStyles: React.CSSProperties;
}

/**
 * Shared Floating UI wiring for the anchored overlays (Popover, Tooltip, menus).
 * Returns the resolved side/align after collision handling, so components can
 * put them on the DOM as `data-side` / `data-align`.
 */
export function useFloatingPosition({
  open,
  reference,
  side = 'bottom',
  align = 'center',
  sideOffset = 4,
  alignOffset = 0,
  arrowElement,
  matchAnchorWidth = false,
  collisionPadding = 8,
}: UseFloatingPositionParams): FloatingPosition {
  const placement = (align === 'center' ? side : `${side}-${align}`) as Placement;

  // Floating UI re-runs positioning whenever the middleware array identity
  // changes, so it has to be memoised.
  const middleware = React.useMemo(
    () => [
      offset({ mainAxis: sideOffset, crossAxis: alignOffset }),
      flip({ padding: collisionPadding }),
      shift({ padding: collisionPadding }),
      size({
        padding: collisionPadding,
        apply({ rects, availableHeight, elements }) {
          elements.floating.style.setProperty('--susi-available-height', `${availableHeight}px`);
          if (matchAnchorWidth) {
            elements.floating.style.setProperty('--susi-anchor-width', `${rects.reference.width}px`);
          }
        },
      }),
      ...(arrowElement ? [arrow({ element: arrowElement, padding: 4 })] : []),
    ],
    [sideOffset, alignOffset, collisionPadding, matchAnchorWidth, arrowElement],
  );

  const { refs, floatingStyles, placement: resolved, middlewareData } = useFloating({
    placement,
    open,
    whileElementsMounted: autoUpdate,
    elements: { reference },
    middleware,
  });

  const [resolvedSide, resolvedAlign = 'center'] = resolved.split('-') as [Side, Align | undefined];
  const arrowData = middlewareData.arrow;

  const arrowStyles = React.useMemo<React.CSSProperties>(
    () => ({
      position: 'absolute',
      left: arrowData?.x != null ? `${arrowData.x}px` : undefined,
      top: arrowData?.y != null ? `${arrowData.y}px` : undefined,
    }),
    [arrowData?.x, arrowData?.y],
  );

  return {
    setFloating: refs.setFloating,
    floatingStyles,
    side: resolvedSide,
    align: resolvedAlign,
    arrowStyles,
  };
}
