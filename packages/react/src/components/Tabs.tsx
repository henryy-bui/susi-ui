import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { useControllableState } from '../hooks/useControllableState';
import { useId } from '../hooks/useId';

type Orientation = 'horizontal' | 'vertical';

interface TabsContextValue {
  baseId: string;
  value: string | undefined;
  setValue: (value: string) => void;
  orientation: Orientation;
  /** `automatic` selects on focus (arrow keys); `manual` waits for Enter/Space. */
  activationMode: 'automatic' | 'manual';
}

const [TabsProvider, useTabsContext] = createContext<TabsContextValue>('Tabs');

const TRIGGER_ATTR = 'data-susi-tab';

export interface TabsProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'onChange' | 'defaultValue'> {
  asChild?: boolean;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: Orientation;
  activationMode?: 'automatic' | 'manual';
}

/** Tabbed panels following the ARIA tabs pattern, with roving tabindex. */
export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(function Tabs(
  {
    value: valueProp,
    defaultValue,
    onValueChange,
    orientation = 'horizontal',
    activationMode = 'automatic',
    children,
    ...props
  },
  forwardedRef,
) {
  const [value, setValue] = useControllableState<string | undefined>({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange: onValueChange as ((value: string | undefined) => void) | undefined,
  });
  const baseId = useId(props.id);

  const context = React.useMemo(
    () => ({ baseId, value, setValue: setValue as (v: string) => void, orientation, activationMode }),
    [baseId, value, setValue, orientation, activationMode],
  );

  return (
    <Primitive.div data-orientation={orientation} {...props} ref={forwardedRef}>
      <TabsProvider value={context}>{children}</TabsProvider>
    </Primitive.div>
  );
});

export interface TabsListProps extends React.ComponentPropsWithoutRef<'div'> {
  asChild?: boolean;
  /** Wrap focus from the last tab to the first. */
  loop?: boolean;
}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(function TabsList(
  { loop = true, onKeyDown, ...props },
  forwardedRef,
) {
  const context = useTabsContext('TabsList');
  const [node, setNode] = React.useState<HTMLDivElement | null>(null);

  return (
    <Primitive.div
      role="tablist"
      aria-orientation={context.orientation}
      data-orientation={context.orientation}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        const keys =
          context.orientation === 'vertical'
            ? { next: 'ArrowDown', prev: 'ArrowUp' }
            : { next: 'ArrowRight', prev: 'ArrowLeft' };
        if (!node || !['Home', 'End', keys.next, keys.prev].includes(event.key)) return;

        const tabs = Array.from(
          node.querySelectorAll<HTMLButtonElement>(`[${TRIGGER_ATTR}]:not([data-disabled])`),
        );
        const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
        if (index === -1) return;

        let nextIndex = tabs.length - 1;
        if (event.key === keys.next) {
          nextIndex = loop ? (index + 1) % tabs.length : Math.min(index + 1, tabs.length - 1);
        } else if (event.key === keys.prev) {
          nextIndex = loop ? (index - 1 + tabs.length) % tabs.length : Math.max(index - 1, 0);
        } else if (event.key === 'Home') {
          nextIndex = 0;
        }

        event.preventDefault();
        tabs[nextIndex]?.focus();
      })}
      {...props}
      ref={composeRefs(forwardedRef, setNode)}
    />
  );
});

export interface TabsTriggerProps extends Omit<React.ComponentPropsWithoutRef<'button'>, 'value'> {
  asChild?: boolean;
  value: string;
}

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(function TabsTrigger(
  { value, disabled, onFocus, onClick, onKeyDown, ...props },
  forwardedRef,
) {
  const context = useTabsContext('TabsTrigger');
  const selected = context.value === value;

  return (
    <Primitive.button
      type="button"
      role="tab"
      id={makeTriggerId(context.baseId, value)}
      aria-selected={selected}
      aria-controls={makeContentId(context.baseId, value)}
      disabled={disabled}
      // Roving tabindex: only the selected tab is in the tab sequence.
      tabIndex={selected ? 0 : -1}
      data-state={selected ? 'active' : 'inactive'}
      data-disabled={disabled ? '' : undefined}
      data-orientation={context.orientation}
      {...{ [TRIGGER_ATTR]: '' }}
      onFocus={composeEventHandlers(onFocus, () => {
        if (context.activationMode === 'automatic' && !disabled) context.setValue(value);
      })}
      onClick={composeEventHandlers(onClick, () => {
        if (!disabled) context.setValue(value);
      })}
      onKeyDown={composeEventHandlers(onKeyDown, (event) => {
        if ((event.key === 'Enter' || event.key === ' ') && !disabled) {
          event.preventDefault();
          context.setValue(value);
        }
      })}
      {...props}
      ref={forwardedRef}
    />
  );
});

export interface TabsContentProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'value'> {
  asChild?: boolean;
  value: string;
  /** Keep mounted while inactive (preserves panel state, allows exit animation). */
  forceMount?: boolean;
}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(function TabsContent(
  { value, forceMount, children, ...props },
  forwardedRef,
) {
  const context = useTabsContext('TabsContent');
  const selected = context.value === value;
  if (!forceMount && !selected) return null;

  return (
    <Primitive.div
      role="tabpanel"
      id={makeContentId(context.baseId, value)}
      aria-labelledby={makeTriggerId(context.baseId, value)}
      hidden={!selected}
      tabIndex={0}
      data-state={selected ? 'active' : 'inactive'}
      data-orientation={context.orientation}
      {...props}
      ref={forwardedRef}
    >
      {selected || forceMount ? children : null}
    </Primitive.div>
  );
});

const makeTriggerId = (baseId: string, value: string) => `${baseId}-trigger-${value}`;
const makeContentId = (baseId: string, value: string) => `${baseId}-content-${value}`;
