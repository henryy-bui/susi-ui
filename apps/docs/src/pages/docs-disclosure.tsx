import type { ComponentDoc } from './ComponentPage';
import { COMMON_PROPS } from './ComponentPage';
import CollapsibleDemo from '../demos/collapsible';
import AccordionDemo from '../demos/accordion';
import TabsDemo from '../demos/tabs';

export const DISCLOSURE_DOCS: Record<string, ComponentDoc> = {
  collapsible: {
    title: 'Collapsible',
    lead: 'Show and hide a panel from a trigger. The base the accordion is built on.',
    demo: 'collapsible',
    element: <CollapsibleDemo />,
    anatomy: `import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@susi-ui/react';

<Collapsible>
  <CollapsibleTrigger>Details</CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>`,
    notes: (
      <>
        <p>
          Height can't be animated to <code>auto</code> in CSS, so the content measures itself (and
          keeps measuring, through a <code>ResizeObserver</code>) and publishes{' '}
          <code>--susi-collapsible-content-height</code> and <code>--susi-collapsible-content-width</code>.
        </p>
        <p>
          The trigger and content are wired together with <code>aria-controls</code>,{' '}
          <code>aria-expanded</code> and a generated id pair, so you don't manage ids yourself.
        </p>
      </>
    ),
    props: [
      {
        title: 'Collapsible',
        rows: [
          { name: 'open', type: 'boolean', description: 'Controlled open state.' },
          { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when the panel should open or close.' },
          { name: 'disabled', type: 'boolean', description: 'Disables the trigger.' },
          ...COMMON_PROPS,
        ],
      },
      { title: 'CollapsibleTrigger', rows: COMMON_PROPS },
      {
        title: 'CollapsibleContent',
        rows: [
          { name: 'forceMount', type: 'boolean', default: 'false', description: 'Keep mounted while closed, so it can animate out.' },
          ...COMMON_PROPS,
        ],
      },
    ],
    keyboard: [{ keys: 'Enter, Space', description: 'Toggles the panel from the trigger.' }],
  },

  accordion: {
    title: 'Accordion',
    lead: 'A set of collapsible sections, one or several open at a time.',
    demo: 'accordion',
    element: <AccordionDemo />,
    anatomy: `import {
  Accordion, AccordionItem, AccordionHeader, AccordionTrigger, AccordionContent,
} from '@susi-ui/react';

<Accordion type="single" defaultValue="a" collapsible>
  <AccordionItem value="a">
    <AccordionHeader>
      <AccordionTrigger>Question</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>Answer</AccordionContent>
  </AccordionItem>
</Accordion>`,
    notes: (
      <>
        <p>
          <code>type</code> decides the shape of the value: <code>single</code> takes a{' '}
          <code>string</code>, <code>multiple</code> takes a <code>string[]</code>. TypeScript
          enforces the matching props, so a single accordion can't be handed an array.
        </p>
        <p>
          In single mode the open item stays open when clicked again, unless you pass{' '}
          <code>collapsible</code>. Each trigger sits inside <code>AccordionHeader</code> (an{' '}
          <code>h3</code> by default — change it with <code>asChild</code>), and each panel is a{' '}
          <code>region</code> labelled by its trigger.
        </p>
      </>
    ),
    props: [
      {
        title: 'Accordion',
        rows: [
          { name: 'type', type: "'single' | 'multiple'", description: 'Required. Decides whether one or many items can be open.' },
          { name: 'value', type: 'string | string[]', description: 'Controlled open item(s); type follows `type`.' },
          { name: 'defaultValue', type: 'string | string[]', description: 'Initial open item(s) when uncontrolled.' },
          { name: 'onValueChange', type: '(value: string | string[]) => void', description: 'Called when the open items change.' },
          { name: 'collapsible', type: 'boolean', default: 'false', description: 'Single mode only: allow closing the open item.' },
          { name: 'disabled', type: 'boolean', description: 'Disables every item.' },
          { name: 'orientation', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Which arrow keys move between triggers.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'AccordionItem',
        rows: [
          { name: 'value', type: 'string', description: 'Required. Identifies the item.' },
          { name: 'disabled', type: 'boolean', description: 'Disables this item.' },
          ...COMMON_PROPS,
        ],
      },
      { title: 'AccordionHeader / AccordionTrigger / AccordionContent', rows: COMMON_PROPS },
    ],
    keyboard: [
      { keys: 'Enter, Space', description: 'Opens or closes the focused section.' },
      { keys: '↓ ↑ (or → ← when horizontal)', description: 'Moves focus between triggers, wrapping around.' },
      { keys: 'Home, End', description: 'Moves focus to the first or last trigger.' },
    ],
  },

  tabs: {
    title: 'Tabs',
    lead: 'Panels behind a row of tabs, with roving tabindex and a choice of activation.',
    demo: 'tabs',
    element: <TabsDemo />,
    anatomy: `import { Tabs, TabsList, TabsTrigger, TabsContent } from '@susi-ui/react';

<Tabs defaultValue="account" activationMode="automatic">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
  </TabsList>
  <TabsContent value="account">…</TabsContent>
</Tabs>`,
    notes: (
      <>
        <p>
          Only the selected tab is in the tab sequence, so Tab moves past the whole list rather than
          through it, and arrows move between tabs.
        </p>
        <p>
          <code>automatic</code> selects as focus moves — right for cheap panels. Use{' '}
          <code>manual</code> when selecting a tab costs something (a fetch, a heavy render); focus
          moves and the user presses Enter or Space to commit.
        </p>
      </>
    ),
    props: [
      {
        title: 'Tabs',
        rows: [
          { name: 'value', type: 'string', description: 'Controlled selected tab.' },
          { name: 'defaultValue', type: 'string', description: 'Initially selected tab when uncontrolled.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selection should change.' },
          { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Which arrow keys navigate.' },
          { name: 'activationMode', type: "'automatic' | 'manual'", default: "'automatic'", description: 'Select on focus, or wait for Enter/Space.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'TabsList',
        rows: [
          { name: 'loop', type: 'boolean', default: 'true', description: 'Wrap from the last tab to the first.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'TabsTrigger',
        rows: [
          { name: 'value', type: 'string', description: 'Required. The panel this tab shows.' },
          { name: 'disabled', type: 'boolean', description: 'Disables the tab; the keyboard skips it.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'TabsContent',
        rows: [
          { name: 'value', type: 'string', description: 'Required. Matches its trigger.' },
          { name: 'forceMount', type: 'boolean', default: 'false', description: 'Keep inactive panels mounted to preserve their state.' },
          ...COMMON_PROPS,
        ],
      },
    ],
    keyboard: [
      { keys: '→ ← (or ↓ ↑ when vertical)', description: 'Moves between tabs; selects too in automatic mode.' },
      { keys: 'Home, End', description: 'Moves to the first or last tab.' },
      { keys: 'Enter, Space', description: 'Selects the focused tab in manual mode.' },
      { keys: 'Tab', description: 'Moves from the tab list to the active panel.' },
    ],
  },
};
