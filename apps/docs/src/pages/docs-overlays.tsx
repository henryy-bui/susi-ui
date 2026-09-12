import type { ComponentDoc } from './ComponentPage';
import { COMMON_PROPS } from './ComponentPage';
import DialogDemo from '../demos/dialog';
import PopoverDemo from '../demos/popover';
import TooltipDemo from '../demos/tooltip';
import DropdownMenuDemo from '../demos/dropdown-menu';
import SelectDemo from '../demos/select';

const ANCHOR_PROPS = [
  { name: 'side', type: "'top' | 'right' | 'bottom' | 'left'", description: 'Preferred side of the anchor.' },
  { name: 'align', type: "'start' | 'center' | 'end'", description: 'Alignment along that side.' },
  { name: 'sideOffset', type: 'number', description: 'Gap between anchor and content, in px.' },
  { name: 'alignOffset', type: 'number', default: '0', description: 'Shift along the alignment axis, in px.' },
];

const DISMISS_PROPS = [
  { name: 'onEscapeKeyDown', type: '(event: KeyboardEvent) => void', description: 'Call preventDefault() to keep it open.' },
  { name: 'onPointerDownOutside', type: '(event: PointerEvent) => void', description: 'Call preventDefault() to keep it open.' },
];

export const OVERLAY_DOCS: Record<string, ComponentDoc> = {
  dialog: {
    title: 'Dialog',
    lead: 'A modal that traps focus, locks scroll, and gives focus back when it closes.',
    demo: 'dialog',
    element: <DialogDemo />,
    anatomy: `import {
  Dialog, DialogTrigger, DialogPortal, DialogOverlay,
  DialogContent, DialogTitle, DialogDescription, DialogClose,
} from '@susi-ui/react';

<Dialog>
  <DialogTrigger>Delete</DialogTrigger>
  <DialogPortal>
    <DialogOverlay />
    <DialogContent>
      <DialogTitle>Delete project</DialogTitle>
      <DialogDescription>This cannot be undone.</DialogDescription>
      <DialogClose>Cancel</DialogClose>
    </DialogContent>
  </DialogPortal>
</Dialog>`,
    notes: (
      <>
        <p>
          Opening moves focus to the first focusable element inside, Tab cycles within the dialog,
          and closing returns focus to whatever had it before. Body scroll is locked with the
          scrollbar width compensated, so the page doesn't jump.
        </p>
        <p>
          <code>DialogTitle</code> and <code>DialogDescription</code> are wired to{' '}
          <code>aria-labelledby</code> and <code>aria-describedby</code> automatically — always
          render a title, even if it is visually hidden. Pass <code>modal={'{false}'}</code> for a
          panel that leaves the page usable behind it.
        </p>
      </>
    ),
    props: [
      {
        title: 'Dialog',
        rows: [
          { name: 'open', type: 'boolean', description: 'Controlled open state.' },
          { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it should open or close.' },
          { name: 'modal', type: 'boolean', default: 'true', description: 'Trap focus and lock scroll.' },
        ],
      },
      {
        title: 'DialogPortal',
        rows: [
          { name: 'container', type: 'Element | null', default: 'document.body', description: 'Where the content renders.' },
        ],
      },
      {
        title: 'DialogContent',
        rows: [
          ...DISMISS_PROPS,
          { name: 'onOpenAutoFocus', type: '(event: Event) => void', description: 'Call preventDefault() to place initial focus yourself.' },
          { name: 'onCloseAutoFocus', type: '(event: Event) => void', description: 'Call preventDefault() to control where focus returns.' },
          ...COMMON_PROPS,
        ],
      },
      { title: 'DialogTrigger / DialogOverlay / DialogTitle / DialogDescription / DialogClose', rows: COMMON_PROPS },
    ],
    keyboard: [
      { keys: 'Escape', description: 'Closes the dialog.' },
      { keys: 'Tab, Shift+Tab', description: 'Cycles focus inside the dialog.' },
    ],
  },

  popover: {
    title: 'Popover',
    lead: 'A floating panel anchored to a trigger, that flips and shifts to stay on screen.',
    demo: 'popover',
    element: <PopoverDemo />,
    anatomy: `import {
  Popover, PopoverTrigger, PopoverPortal, PopoverContent, PopoverArrow, PopoverClose,
} from '@susi-ui/react';

<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverPortal>
    <PopoverContent side="bottom" sideOffset={8}>
      <PopoverArrow />
      …
    </PopoverContent>
  </PopoverPortal>
</Popover>`,
    notes: (
      <>
        <p>
          Positioning is handled by Floating UI: the content flips to the opposite side and shifts
          along the axis when it would overflow, and the placement it settled on comes back as{' '}
          <code>data-side</code> and <code>data-align</code> — which is how the arrow knows which way
          to point.
        </p>
        <p>
          Focus is not trapped by default, since a popover is usually non-modal. Pass{' '}
          <code>modal</code> on the root (or <code>trapFocus</code> on the content) when it should
          behave like a dialog. Use <code>PopoverAnchor</code> to position against something other
          than the trigger.
        </p>
      </>
    ),
    props: [
      {
        title: 'Popover',
        rows: [
          { name: 'open', type: 'boolean', description: 'Controlled open state.' },
          { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it should open or close.' },
          { name: 'modal', type: 'boolean', default: 'false', description: 'Trap focus inside the content.' },
        ],
      },
      {
        title: 'PopoverContent',
        rows: [
          ...ANCHOR_PROPS.map((row) =>
            row.name === 'side'
              ? { ...row, default: "'bottom'" }
              : row.name === 'align'
                ? { ...row, default: "'center'" }
                : row.name === 'sideOffset'
                  ? { ...row, default: '4' }
                  : row,
          ),
          { name: 'trapFocus', type: 'boolean', description: 'Overrides the root’s modal setting.' },
          ...DISMISS_PROPS,
          { name: 'onOpenAutoFocus', type: '(event: Event) => void', description: 'Call preventDefault() to place initial focus yourself.' },
          { name: 'onCloseAutoFocus', type: '(event: Event) => void', description: 'Call preventDefault() to control where focus returns.' },
          ...COMMON_PROPS,
        ],
      },
      { title: 'PopoverTrigger / PopoverAnchor / PopoverArrow / PopoverClose', rows: COMMON_PROPS },
    ],
    keyboard: [
      { keys: 'Enter, Space', description: 'Toggles the popover from the trigger.' },
      { keys: 'Escape', description: 'Closes it and returns focus to the trigger.' },
    ],
  },

  tooltip: {
    title: 'Tooltip',
    lead: 'A hint on hover and on keyboard focus — never on a press.',
    demo: 'tooltip',
    element: <TooltipDemo />,
    anatomy: `import {
  TooltipProvider, Tooltip, TooltipTrigger, TooltipPortal, TooltipContent, TooltipArrow,
} from '@susi-ui/react';

<TooltipProvider delayDuration={400} skipDelayDuration={300}>
  <Tooltip>
    <TooltipTrigger>Save</TooltipTrigger>
    <TooltipPortal>
      <TooltipContent>
        <TooltipArrow />
        Saves your work
      </TooltipContent>
    </TooltipPortal>
  </Tooltip>
</TooltipProvider>`,
    notes: (
      <>
        <p>
          A pointer press dismisses the tooltip instead of opening it: at that point the user is
          acting, not asking what something does. Keyboard focus opens it; a press-then-focus does
          not.
        </p>
        <p>
          <code>TooltipProvider</code> is optional but recommended once you have more than one:
          after a tooltip has been shown, neighbouring triggers skip the delay for{' '}
          <code>skipDelayDuration</code>, so scanning a toolbar doesn't feel sticky.
        </p>
        <div className="callout">
          <strong>A tooltip is not a label.</strong> It sets <code>aria-describedby</code>, so the
          trigger still needs its own accessible name, and the tooltip must never hold the only copy
          of something important — it is unreachable on touch and transient everywhere.
        </div>
      </>
    ),
    props: [
      {
        title: 'TooltipProvider',
        rows: [
          { name: 'delayDuration', type: 'number', default: '400', description: 'Hover delay before opening, in ms.' },
          { name: 'skipDelayDuration', type: 'number', default: '300', description: 'Window after closing in which others open instantly.' },
        ],
      },
      {
        title: 'Tooltip',
        rows: [
          { name: 'open', type: 'boolean', description: 'Controlled open state.' },
          { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it should open or close.' },
          { name: 'delayDuration', type: 'number', description: 'Overrides the provider for this tooltip.' },
        ],
      },
      {
        title: 'TooltipContent',
        rows: [
          ...ANCHOR_PROPS.map((row) =>
            row.name === 'side' ? { ...row, default: "'top'" } : row.name === 'sideOffset' ? { ...row, default: '6' } : row,
          ),
          { name: 'hoverable', type: 'boolean', default: 'false', description: 'Keep open while the pointer is over the content (it is pointer-events: none otherwise).' },
          ...COMMON_PROPS,
        ],
      },
      { title: 'TooltipTrigger / TooltipArrow', rows: COMMON_PROPS },
    ],
    keyboard: [
      { keys: 'Tab', description: 'Focusing the trigger opens the tooltip; leaving closes it.' },
      { keys: 'Escape', description: 'Closes the tooltip.' },
    ],
  },

  'dropdown-menu': {
    title: 'Dropdown menu',
    lead: 'A menu of actions, with checkbox and radio items, typeahead and full keyboard support.',
    demo: 'dropdown-menu',
    element: <DropdownMenuDemo />,
    anatomy: `import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuPortal, DropdownMenuContent,
  DropdownMenuItem, DropdownMenuCheckboxItem, DropdownMenuRadioGroup,
  DropdownMenuRadioItem, DropdownMenuItemIndicator, DropdownMenuLabel,
  DropdownMenuSeparator,
} from '@susi-ui/react';

<DropdownMenu>
  <DropdownMenuTrigger>Actions</DropdownMenuTrigger>
  <DropdownMenuPortal>
    <DropdownMenuContent>
      <DropdownMenuItem onSelect={rename}>Rename</DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuCheckboxItem checked={showHidden} onCheckedChange={setShowHidden}>
        Show hidden
        <DropdownMenuItemIndicator>✓</DropdownMenuItemIndicator>
      </DropdownMenuCheckboxItem>
    </DropdownMenuContent>
  </DropdownMenuPortal>
</DropdownMenu>`,
    notes: (
      <>
        <p>
          <code>onSelect</code> runs before the menu closes and its event is cancelable — call{' '}
          <code>preventDefault()</code> to keep the menu open, which is what you want for a checkbox
          item the user may toggle several times.
        </p>
        <div className="callout">
          <strong>Own your item state.</strong> The content unmounts when the menu closes, so an
          uncontrolled <code>defaultChecked</code> resets every time it reopens. Keep{' '}
          <code>checked</code> and radio <code>value</code> in state outside the menu.
        </div>
        <p>
          Menus follow the pointer — hovering an item focuses it — and typing jumps to the item that
          starts with what you typed. Tab dismisses rather than moving inside, matching the menu
          pattern.
        </p>
      </>
    ),
    props: [
      {
        title: 'DropdownMenu',
        rows: [
          { name: 'open', type: 'boolean', description: 'Controlled open state.' },
          { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Initial state when uncontrolled.' },
          { name: 'onOpenChange', type: '(open: boolean) => void', description: 'Called when it should open or close.' },
        ],
      },
      {
        title: 'DropdownMenuContent',
        rows: [
          ...ANCHOR_PROPS.map((row) =>
            row.name === 'side'
              ? { ...row, default: "'bottom'" }
              : row.name === 'align'
                ? { ...row, default: "'start'" }
                : row.name === 'sideOffset'
                  ? { ...row, default: '4' }
                  : row,
          ),
          { name: 'loop', type: 'boolean', default: 'true', description: 'Wrap arrow navigation at the ends.' },
          ...DISMISS_PROPS,
          { name: 'onCloseAutoFocus', type: '(event: Event) => void', description: 'Call preventDefault() to stop focus returning to the trigger.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'DropdownMenuItem',
        rows: [
          { name: 'onSelect', type: '(event: Event) => void', description: 'Runs on selection; preventDefault() keeps the menu open.' },
          { name: 'disabled', type: 'boolean', description: 'Disables the item; the keyboard skips it.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'DropdownMenuCheckboxItem',
        rows: [
          { name: 'checked', type: 'boolean', description: 'Controlled checked state.' },
          { name: 'onCheckedChange', type: '(checked: boolean) => void', description: 'Called when it should toggle.' },
          { name: 'disabled', type: 'boolean', description: 'Disables the item.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'DropdownMenuRadioGroup / DropdownMenuRadioItem',
        rows: [
          { name: 'value', type: 'string', description: 'Group: the selected value. Item: the value it selects.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Group only. Called when the selection changes.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'DropdownMenuItemIndicator',
        rows: [
          { name: 'forceMount', type: 'boolean', default: 'false', description: 'Render even when unchecked.' },
          ...COMMON_PROPS,
        ],
      },
      { title: 'DropdownMenuTrigger / Label / Group / Separator', rows: COMMON_PROPS },
    ],
    keyboard: [
      { keys: '↓ ↑ (on the trigger)', description: 'Opens the menu focused on the first or last item.' },
      { keys: '↓ ↑', description: 'Moves between enabled items, wrapping.' },
      { keys: 'Home, End', description: 'Moves to the first or last item.' },
      { keys: 'a–z', description: 'Jumps to the next item starting with those characters.' },
      { keys: 'Enter, Space', description: 'Selects the focused item.' },
      { keys: 'Escape, Tab', description: 'Closes the menu and returns focus to the trigger.' },
    ],
  },

  select: {
    title: 'Select',
    lead: 'A custom select on the listbox pattern — styleable, with typeahead and form support.',
    demo: 'select',
    element: <SelectDemo />,
    anatomy: `import {
  Select, SelectTrigger, SelectValue, SelectIcon, SelectPortal, SelectContent,
  SelectViewport, SelectGroup, SelectLabel, SelectItem, SelectItemText,
  SelectItemIndicator, SelectSeparator,
} from '@susi-ui/react';

<Select value={fruit} onValueChange={setFruit} name="fruit">
  <SelectTrigger>
    <SelectValue placeholder="Pick a fruit" />
    <SelectIcon>⌄</SelectIcon>
  </SelectTrigger>
  <SelectPortal>
    <SelectContent>
      <SelectViewport>
        <SelectItem value="apple">
          <SelectItemText>Apple</SelectItemText>
          <SelectItemIndicator>✓</SelectItemIndicator>
        </SelectItem>
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</Select>`,
    notes: (
      <>
        <p>
          It opens focused on the current selection, the way a native select does, and typing jumps
          between options. The content publishes <code>--susi-anchor-width</code> (the trigger's
          width) and <code>--susi-available-height</code>, so the list can match the trigger and
          never run off the screen — see the CSS on the Styling page.
        </p>
        <p>
          <code>SelectValue</code> shows the selected item's text, which items register as they
          mount. Before the list has been opened once, only the raw value is known — pass{' '}
          <code>children</code> to <code>SelectValue</code> if you need the trigger to read exactly
          right from first paint.
        </p>
        <div className="callout">
          <strong>A native <code>&lt;select&gt;</code> is still a fine answer.</strong> Use this when
          you need to style the options or put markup inside them; use the platform when you don't.
        </div>
      </>
    ),
    props: [
      {
        title: 'Select',
        rows: [
          { name: 'value', type: 'string', description: 'Controlled selected value.' },
          { name: 'defaultValue', type: 'string', description: 'Initial value when uncontrolled.' },
          { name: 'onValueChange', type: '(value: string) => void', description: 'Called when the selection should change.' },
          { name: 'open / defaultOpen / onOpenChange', type: 'boolean / boolean / (open) => void', description: 'Control the open state of the list.' },
          { name: 'name', type: 'string', description: 'Renders a hidden input for form submission.' },
          { name: 'required', type: 'boolean', description: 'Marks the control required.' },
          { name: 'disabled', type: 'boolean', description: 'Disables the trigger.' },
        ],
      },
      {
        title: 'SelectContent',
        rows: [
          ...ANCHOR_PROPS.map((row) =>
            row.name === 'side'
              ? { ...row, default: "'bottom'" }
              : row.name === 'align'
                ? { ...row, default: "'start'" }
                : row.name === 'sideOffset'
                  ? { ...row, default: '4' }
                  : row,
          ),
          { name: 'matchTriggerWidth', type: 'boolean', default: 'true', description: 'Publish the trigger width as --susi-anchor-width.' },
          ...DISMISS_PROPS,
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'SelectValue',
        rows: [
          { name: 'placeholder', type: 'ReactNode', description: 'Shown while nothing is selected.' },
          { name: 'children', type: 'ReactNode', description: 'Render the selection yourself instead of the registered text.' },
          ...COMMON_PROPS,
        ],
      },
      {
        title: 'SelectItem',
        rows: [
          { name: 'value', type: 'string', description: 'Required. The value this option selects.' },
          { name: 'textValue', type: 'string', description: 'Text for typeahead and the trigger; defaults to the item’s text content.' },
          { name: 'disabled', type: 'boolean', description: 'Disables the option; the keyboard skips it.' },
          ...COMMON_PROPS,
        ],
      },
      { title: 'SelectTrigger / Icon / Viewport / ItemText / ItemIndicator / Group / Label / Separator', rows: COMMON_PROPS },
    ],
    keyboard: [
      { keys: 'Enter, Space, ↓, ↑ (on the trigger)', description: 'Opens the list at the current selection.' },
      { keys: '↓ ↑', description: 'Moves between enabled options.' },
      { keys: 'Home, End', description: 'Moves to the first or last option.' },
      { keys: 'a–z', description: 'Jumps to the option starting with those characters.' },
      { keys: 'Enter, Space', description: 'Selects the focused option and closes.' },
      { keys: 'Escape, Tab', description: 'Closes without changing the value.' },
    ],
  },
};
