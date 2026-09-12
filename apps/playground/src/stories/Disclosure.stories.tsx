import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionItem,
  AccordionTrigger,
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@susi-ui/react';

const ITEMS = [
  { value: 'one', title: 'First section', body: 'Arrow keys move between triggers.' },
  { value: 'two', title: 'Second section', body: 'Home and End jump to the ends.' },
  { value: 'three', title: 'Third section', body: 'Each panel is a labelled region.' },
];

const meta = { title: 'Disclosure/Accordion' } satisfies Meta;
export default meta;

export const Single: StoryObj = {
  render: () => (
    <Accordion className="accordion" type="single" defaultValue="one" collapsible>
      {ITEMS.map((item) => (
        <AccordionItem className="accordion-item" key={item.value} value={item.value}>
          <AccordionHeader>
            <AccordionTrigger className="accordion-trigger">{item.title}</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className="accordion-content">{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const Multiple: StoryObj = {
  render: () => (
    <Accordion className="accordion" type="multiple" defaultValue={['one', 'three']}>
      {ITEMS.map((item) => (
        <AccordionItem className="accordion-item" key={item.value} value={item.value}>
          <AccordionHeader>
            <AccordionTrigger className="accordion-trigger">{item.title}</AccordionTrigger>
          </AccordionHeader>
          <AccordionContent className="accordion-content">{item.body}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
};

export const CollapsibleBasic: StoryObj = {
  name: 'Collapsible',
  render: () => (
    <Collapsible>
      <CollapsibleTrigger className="btn">Show details</CollapsibleTrigger>
      <CollapsibleContent className="accordion-content" style={{ paddingTop: 12 }}>
        Content exposes its measured height as a CSS variable for animation.
      </CollapsibleContent>
    </Collapsible>
  ),
};

export const TabsAutomatic: StoryObj = {
  name: 'Tabs (automatic activation)',
  render: () => (
    <Tabs defaultValue="account">
      <TabsList className="tabs-list">
        <TabsTrigger className="tab" value="account">
          Account
        </TabsTrigger>
        <TabsTrigger className="tab" value="password">
          Password
        </TabsTrigger>
        <TabsTrigger className="tab" value="billing" disabled>
          Billing
        </TabsTrigger>
      </TabsList>
      <TabsContent className="tab-content" value="account">
        Selection follows focus.
      </TabsContent>
      <TabsContent className="tab-content" value="password">
        Password panel.
      </TabsContent>
      <TabsContent className="tab-content" value="billing">
        Billing panel.
      </TabsContent>
    </Tabs>
  ),
};

export const TabsManual: StoryObj = {
  name: 'Tabs (manual activation)',
  render: () => (
    <Tabs defaultValue="account" activationMode="manual">
      <TabsList className="tabs-list">
        <TabsTrigger className="tab" value="account">
          Account
        </TabsTrigger>
        <TabsTrigger className="tab" value="password">
          Password
        </TabsTrigger>
      </TabsList>
      <TabsContent className="tab-content" value="account">
        Move with arrows, then press Enter or Space.
      </TabsContent>
      <TabsContent className="tab-content" value="password">
        Password panel.
      </TabsContent>
    </Tabs>
  ),
};
