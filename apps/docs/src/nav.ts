export interface NavItem {
  slug: string;
  title: string;
  /** One-line summary, used on the overview cards and for search. */
  summary: string;
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    title: 'Getting started',
    items: [
      { slug: '', title: 'Introduction', summary: 'What susi-ui is and what it deliberately leaves out.' },
      { slug: 'installation', title: 'Installation', summary: 'Install the package and render your first component.' },
      { slug: 'styling', title: 'Styling', summary: 'Style components through data attributes and CSS variables.' },
      { slug: 'state', title: 'Controlled state', summary: 'Controlled and uncontrolled usage from one component.' },
      { slug: 'composition', title: 'Composition & asChild', summary: 'Merge component behaviour onto your own elements.' },
      { slug: 'integration', title: 'Framework integration', summary: 'Vite, Next.js, Tailwind, CSS Modules and tests.' },
    ],
  },
  {
    title: 'Controls',
    items: [
      { slug: 'button', title: 'Button', summary: 'A button with loading and disabled states.' },
      { slug: 'toggle', title: 'Toggle', summary: 'A two-state button.' },
      { slug: 'checkbox', title: 'Checkbox', summary: 'A checkbox that can also be indeterminate.' },
      { slug: 'switch', title: 'Switch', summary: 'An on/off control.' },
      { slug: 'radio-group', title: 'Radio group', summary: 'A single choice from a set.' },
      { slug: 'slider', title: 'Slider', summary: 'One or more values on a range.' },
    ],
  },
  {
    title: 'Disclosure',
    items: [
      { slug: 'collapsible', title: 'Collapsible', summary: 'Show and hide a panel.' },
      { slug: 'accordion', title: 'Accordion', summary: 'A set of collapsible sections.' },
      { slug: 'tabs', title: 'Tabs', summary: 'Panels behind a row of tabs.' },
    ],
  },
  {
    title: 'Overlays',
    items: [
      { slug: 'dialog', title: 'Dialog', summary: 'A modal with focus trapping and scroll lock.' },
      { slug: 'popover', title: 'Popover', summary: 'A floating panel anchored to a trigger.' },
      { slug: 'tooltip', title: 'Tooltip', summary: 'A hint on hover and keyboard focus.' },
      { slug: 'dropdown-menu', title: 'Dropdown menu', summary: 'A menu of actions, checkboxes and radios.' },
      { slug: 'select', title: 'Select', summary: 'A custom select built on the listbox pattern.' },
    ],
  },
  {
    title: 'Feedback & display',
    items: [
      { slug: 'toast', title: 'Toast', summary: 'Notifications with auto-dismiss and swipe.' },
      { slug: 'progress', title: 'Progress', summary: 'Determinate and indeterminate progress.' },
      { slug: 'separator', title: 'Separator', summary: 'A divider, decorative or semantic.' },
      { slug: 'visually-hidden', title: 'Visually hidden', summary: 'Text for screen readers only.' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { slug: 'primitives', title: 'Primitives', summary: 'Slot, Primitive, Portal and FocusScope.' },
      { slug: 'hooks', title: 'Hooks', summary: 'The hooks behind the components.' },
    ],
  },
];

export const ALL_ITEMS = NAV.flatMap((group) => group.items);

export function findItem(slug: string): NavItem | undefined {
  return ALL_ITEMS.find((item) => item.slug === slug);
}

export function siblings(slug: string) {
  const index = ALL_ITEMS.findIndex((item) => item.slug === slug);
  return {
    previous: index > 0 ? ALL_ITEMS[index - 1] : undefined,
    next: index >= 0 && index < ALL_ITEMS.length - 1 ? ALL_ITEMS[index + 1] : undefined,
  };
}
