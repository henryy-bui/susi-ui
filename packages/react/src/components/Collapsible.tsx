import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { useControllableState } from '../hooks/useControllableState';
import { useId } from '../hooks/useId';
import { useIsomorphicLayoutEffect } from '../hooks/useIsomorphicLayoutEffect';

interface CollapsibleContextValue {
  contentId: string;
  triggerId: string;
  open: boolean;
  disabled: boolean | undefined;
  onOpenToggle: () => void;
}

const [CollapsibleProvider, useCollapsibleContext] = createContext<CollapsibleContextValue>('Collapsible');

export interface CollapsibleProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
}

/** Show/hide a panel from a trigger. The base for `Accordion`. */
export const Collapsible = React.forwardRef<HTMLDivElement, CollapsibleProps>(function Collapsible(
  { open: openProp, defaultOpen = false, onOpenChange, disabled, children, ...props },
  forwardedRef,
) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const baseId = useId();
  const contentId = `${baseId}-content`;
  const triggerId = `${baseId}-trigger`;
  const onOpenToggle = React.useCallback(() => setOpen((prev) => !prev), [setOpen]);
  const context = React.useMemo(
    () => ({ contentId, triggerId, open, disabled, onOpenToggle }),
    [contentId, triggerId, open, disabled, onOpenToggle],
  );

  return (
    <Primitive.div
      data-state={open ? 'open' : 'closed'}
      data-disabled={disabled ? '' : undefined}
      {...props}
      ref={forwardedRef}
    >
      <CollapsibleProvider value={context}>{children}</CollapsibleProvider>
    </Primitive.div>
  );
});

export interface CollapsibleTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  asChild?: boolean;
}

export const CollapsibleTrigger = React.forwardRef<HTMLButtonElement, CollapsibleTriggerProps>(
  function CollapsibleTrigger({ onClick, disabled, ...props }, forwardedRef) {
    const context = useCollapsibleContext('CollapsibleTrigger');
    const isDisabled = disabled || context.disabled;

    return (
      <Primitive.button
        type="button"
        id={context.triggerId}
        aria-controls={context.contentId}
        aria-expanded={context.open}
        disabled={isDisabled}
        data-state={context.open ? 'open' : 'closed'}
        data-disabled={isDisabled ? '' : undefined}
        onClick={composeEventHandlers(onClick, () => {
          if (!isDisabled) context.onOpenToggle();
        })}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

export interface CollapsibleContentProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
  /** Keep the content mounted while closed, so it can animate out. */
  forceMount?: boolean;
}

/**
 * Sets `--susi-collapsible-content-height` / `-width` to the measured size, so a
 * consumer can animate from 0 to the real height in pure CSS.
 */
export const CollapsibleContent = React.forwardRef<HTMLDivElement, CollapsibleContentProps>(
  function CollapsibleContent({ forceMount, children, style, ...props }, forwardedRef) {
    const context = useCollapsibleContext('CollapsibleContent');
    const [node, setNode] = React.useState<HTMLDivElement | null>(null);
    const [size, setSize] = React.useState<{ height: number; width: number } | null>(null);

    useIsomorphicLayoutEffect(() => {
      if (!node) return;
      const measure = () => setSize({ height: node.scrollHeight, width: node.scrollWidth });
      measure();
      if (typeof ResizeObserver === 'undefined') return;
      const observer = new ResizeObserver(measure);
      observer.observe(node);
      return () => observer.disconnect();
    }, [node, context.open]);

    const present = forceMount || context.open;

    return (
      <Primitive.div
        id={context.contentId}
        aria-labelledby={context.triggerId}
        hidden={!present}
        data-state={context.open ? 'open' : 'closed'}
        data-disabled={context.disabled ? '' : undefined}
        style={{
          ...(size
            ? {
                ['--susi-collapsible-content-height' as string]: `${size.height}px`,
                ['--susi-collapsible-content-width' as string]: `${size.width}px`,
              }
            : undefined),
          ...style,
        }}
        {...props}
        ref={composeRefs(forwardedRef, setNode)}
      >
        {present ? children : null}
      </Primitive.div>
    );
  },
);
