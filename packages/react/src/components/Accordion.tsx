import * as React from 'react';
import { Primitive } from '../primitive/Primitive';
import { composeEventHandlers } from '../primitive/composeEventHandlers';
import { composeRefs } from '../primitive/composeRefs';
import { createContext } from '../primitive/createContext';
import { useControllableState } from '../hooks/useControllableState';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  type CollapsibleContentProps,
  type CollapsibleTriggerProps,
} from './Collapsible';

type Orientation = 'vertical' | 'horizontal';

interface AccordionContextValue {
  value: string[];
  onItemOpen: (value: string) => void;
  onItemClose: (value: string) => void;
  disabled: boolean | undefined;
  orientation: Orientation;
}

const [AccordionProvider, useAccordionContext] = createContext<AccordionContextValue>('Accordion');

interface AccordionItemContextValue {
  value: string;
  open: boolean;
  disabled: boolean | undefined;
}

const [AccordionItemProvider, useAccordionItemContext] =
  createContext<AccordionItemContextValue>('AccordionItem');

const ROOT_ATTR = 'data-susi-accordion';
const TRIGGER_ATTR = 'data-susi-accordion-trigger';

type AccordionBaseProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'value' | 'defaultValue' | 'onChange'> & {
  asChild?: boolean;
  disabled?: boolean;
  orientation?: Orientation;
};

export type AccordionSingleProps = AccordionBaseProps & {
  type: 'single';
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Allow closing the open item by clicking its trigger. */
  collapsible?: boolean;
};

export type AccordionMultipleProps = AccordionBaseProps & {
  type: 'multiple';
  value?: string[];
  defaultValue?: string[];
  onValueChange?: (value: string[]) => void;
};

export type AccordionProps = AccordionSingleProps | AccordionMultipleProps;

/** A set of collapsible sections with arrow-key navigation between triggers. */
export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(function Accordion(
  props,
  forwardedRef,
) {
  const { disabled, orientation = 'vertical', children, ...rest } = props;

  const isSingle = props.type === 'single';
  const single = props as AccordionSingleProps;
  const multiple = props as AccordionMultipleProps;

  const [singleValue, setSingleValue] = useControllableState<string>({
    prop: isSingle ? single.value : undefined,
    defaultProp: (isSingle ? single.defaultValue : undefined) ?? '',
    onChange: isSingle ? single.onValueChange : undefined,
  });
  const [multipleValue, setMultipleValue] = useControllableState<string[]>({
    prop: isSingle ? undefined : multiple.value,
    defaultProp: (isSingle ? undefined : multiple.defaultValue) ?? [],
    onChange: isSingle ? undefined : multiple.onValueChange,
  });

  const value = isSingle ? (singleValue ? [singleValue] : []) : multipleValue;

  const onItemOpen = React.useCallback(
    (itemValue: string) => {
      if (isSingle) setSingleValue(itemValue);
      else setMultipleValue((prev) => (prev.includes(itemValue) ? prev : [...prev, itemValue]));
    },
    [isSingle, setSingleValue, setMultipleValue],
  );

  const onItemClose = React.useCallback(
    (itemValue: string) => {
      if (isSingle) {
        if (single.collapsible) setSingleValue('');
      } else {
        setMultipleValue((prev) => prev.filter((v) => v !== itemValue));
      }
    },
    [isSingle, single.collapsible, setSingleValue, setMultipleValue],
  );

  const context = React.useMemo(
    () => ({ value, onItemOpen, onItemClose, disabled, orientation }),
    [value, onItemOpen, onItemClose, disabled, orientation],
  );

  const domProps = omit(rest, ['type', 'value', 'defaultValue', 'onValueChange', 'collapsible']);

  return (
    <Primitive.div {...{ [ROOT_ATTR]: '' }} data-orientation={orientation} {...domProps} ref={forwardedRef}>
      <AccordionProvider value={context}>{children}</AccordionProvider>
    </Primitive.div>
  );
});

export interface AccordionItemProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'value'> {
  asChild?: boolean;
  value: string;
  disabled?: boolean;
}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(function AccordionItem(
  { value, disabled, children, ...props },
  forwardedRef,
) {
  const context = useAccordionContext('AccordionItem');
  const open = context.value.includes(value);
  const isDisabled = disabled || context.disabled;

  const itemContext = React.useMemo(
    () => ({ value, open, disabled: isDisabled }),
    [value, open, isDisabled],
  );

  return (
    <Collapsible
      open={open}
      disabled={isDisabled}
      onOpenChange={(nextOpen) => (nextOpen ? context.onItemOpen(value) : context.onItemClose(value))}
      data-orientation={context.orientation}
      {...props}
      ref={forwardedRef}
    >
      <AccordionItemProvider value={itemContext}>{children}</AccordionItemProvider>
    </Collapsible>
  );
});

export interface AccordionHeaderProps extends React.ComponentPropsWithoutRef<'h3'> {
  asChild?: boolean;
}

/** Wraps the trigger in a heading, as the ARIA accordion pattern requires. */
export const AccordionHeader = React.forwardRef<HTMLHeadingElement, AccordionHeaderProps>(
  function AccordionHeader(props, forwardedRef) {
    const context = useAccordionContext('AccordionHeader');
    const item = useAccordionItemContext('AccordionHeader');
    return (
      <Primitive.h3
        data-orientation={context.orientation}
        data-state={item.open ? 'open' : 'closed'}
        data-disabled={item.disabled ? '' : undefined}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

export interface AccordionTriggerProps extends CollapsibleTriggerProps {}

export const AccordionTrigger = React.forwardRef<HTMLButtonElement, AccordionTriggerProps>(
  function AccordionTrigger({ onKeyDown, ...props }, forwardedRef) {
    const context = useAccordionContext('AccordionTrigger');
    const [node, setNode] = React.useState<HTMLButtonElement | null>(null);

    return (
      <CollapsibleTrigger
        data-orientation={context.orientation}
        {...{ [TRIGGER_ATTR]: '' }}
        onKeyDown={composeEventHandlers(onKeyDown, (event) => {
          const keys =
            context.orientation === 'horizontal'
              ? { next: 'ArrowRight', prev: 'ArrowLeft' }
              : { next: 'ArrowDown', prev: 'ArrowUp' };
          if (!node || !['Home', 'End', keys.next, keys.prev].includes(event.key)) return;

          const triggers = getTriggers(node);
          const index = triggers.indexOf(node);
          if (index === -1) return;

          let nextIndex = triggers.length - 1;
          if (event.key === keys.next) nextIndex = (index + 1) % triggers.length;
          else if (event.key === keys.prev) nextIndex = (index - 1 + triggers.length) % triggers.length;
          else if (event.key === 'Home') nextIndex = 0;

          event.preventDefault();
          triggers[nextIndex]?.focus();
        })}
        {...props}
        ref={composeRefs(forwardedRef, setNode)}
      />
    );
  },
);

export interface AccordionContentProps extends CollapsibleContentProps {}

export const AccordionContent = React.forwardRef<HTMLDivElement, AccordionContentProps>(
  function AccordionContent(props, forwardedRef) {
    const context = useAccordionContext('AccordionContent');
    return (
      <CollapsibleContent
        role="region"
        data-orientation={context.orientation}
        {...props}
        ref={forwardedRef}
      />
    );
  },
);

function getTriggers(node: HTMLElement): HTMLButtonElement[] {
  const root = node.closest<HTMLElement>(`[${ROOT_ATTR}]`);
  if (!root) return [];
  return Array.from(root.querySelectorAll<HTMLButtonElement>(`[${TRIGGER_ATTR}]:not([disabled])`));
}

function omit<T extends object, K extends string>(obj: T, keys: K[]): Omit<T, K> {
  const result = { ...obj } as Record<string, unknown>;
  for (const key of keys) delete result[key];
  return result as Omit<T, K>;
}
