# @susi-ui/react

Headless React components. No CSS, no theme, no opinions about your markup — just behaviour,
accessibility and state.

```bash
pnpm add @susi-ui/react
```

Peer dependencies: `react` and `react-dom` >= 18.

## Conventions

Every component follows the same three rules:

**State lands on the DOM.** Style against attributes rather than class props:

| Attribute | Where |
| --- | --- |
| `data-state` | `on/off`, `checked/unchecked/indeterminate`, `open/closed`, `active/inactive` |
| `data-disabled` | present when disabled |
| `data-orientation` | `Tabs`, `Accordion` |
| `data-side` / `data-align` | anchored content (`Popover`, `Tooltip`, menus), after collision handling |
| `data-placeholder` | `SelectTrigger` / `SelectValue` while nothing is selected |

**Controlled or uncontrolled.** Pass `checked` / `open` / `value` to control it, or
`defaultChecked` / `defaultOpen` / `defaultValue` to let it own the state. The change callback fires
either way.

**`asChild` merges onto your element.** Props, handlers, `className`, `style` and refs are merged
onto the single child; the child's handler runs first, and calling `preventDefault()` in it skips
the component's own behaviour.

```tsx
<Button asChild>
  <a href="/docs">Docs</a>
</Button>
// → <a href="/docs" type=… data-…>Docs</a>
```

## Components

### Button

```tsx
<Button loading={saving} onClick={save}>Save</Button>
```

`loading` sets `aria-busy`, `data-loading`, and blocks activation. Defaults to `type="button"`.

### Toggle

```tsx
<Toggle pressed={bold} onPressedChange={setBold}>Bold</Toggle>
```

`aria-pressed` + `data-state="on|off"`.

### Checkbox

```tsx
<Checkbox checked={checked} onCheckedChange={setChecked} name="terms">
  <CheckboxIndicator>✓</CheckboxIndicator>
</Checkbox>
```

Supports `checked="indeterminate"` (`aria-checked="mixed"`); clicking it resolves to `true`.
With a `name` inside a `<form>`, a visually hidden input mirrors the value for native submission.
`CheckboxIndicator` renders only while checked or indeterminate (`forceMount` to override).

### Switch

```tsx
<Switch defaultChecked name="wifi">
  <SwitchThumb />
</Switch>
```

`role="switch"`; the thumb carries `data-state` so you can translate it.

### Collapsible

```tsx
<Collapsible>
  <CollapsibleTrigger>Details</CollapsibleTrigger>
  <CollapsibleContent>…</CollapsibleContent>
</Collapsible>
```

Content publishes `--susi-collapsible-content-height` / `-width` (measured, kept in sync by a
`ResizeObserver`) so you can animate to its real size in CSS. `forceMount` keeps it mounted while
closed for exit animations.

### Accordion

```tsx
<Accordion type="single" defaultValue="a" collapsible>
  <AccordionItem value="a">
    <AccordionHeader>
      <AccordionTrigger>Question</AccordionTrigger>
    </AccordionHeader>
    <AccordionContent>Answer</AccordionContent>
  </AccordionItem>
</Accordion>
```

`type="single" | "multiple"` (the `value` type follows: `string` vs `string[]`), `collapsible` lets
the open item close again, `orientation` switches the arrow keys. Arrow keys, Home and End move
focus between triggers; each panel is a `region` labelled by its trigger.

### Tabs

```tsx
<Tabs defaultValue="account" activationMode="automatic">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
  </TabsList>
  <TabsContent value="account">…</TabsContent>
</Tabs>
```

Roving tabindex: one tab in the tab sequence, arrows move between them. `automatic` selects on
focus, `manual` waits for Enter or Space. `TabsList` takes `loop`; `TabsContent` takes `forceMount`
to keep inactive panels mounted.

### Dialog

```tsx
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
</Dialog>
```

Modal by default: focus is trapped and restored, body scroll is locked, Escape and outside
pointerdown dismiss. `modal={false}` drops the trap and the scroll lock. `DialogContent` takes
`onEscapeKeyDown`, `onPointerDownOutside`, `onOpenAutoFocus` and `onCloseAutoFocus` — call
`preventDefault()` on the event to keep the dialog open or to place focus yourself. Title and
description are wired to `aria-labelledby` / `aria-describedby` automatically.

### Popover

```tsx
<Popover>
  <PopoverTrigger>Open</PopoverTrigger>
  <PopoverPortal>
    <PopoverContent side="bottom" align="center" sideOffset={8}>
      <PopoverArrow />
      …
      <PopoverClose>Close</PopoverClose>
    </PopoverContent>
  </PopoverPortal>
</Popover>
```

Positioned with Floating UI (`offset`, `flip`, `shift`), so it stays on screen; the resolved
placement comes back as `data-side` / `data-align`. Use `PopoverAnchor` to position against
something other than the trigger, and `trapFocus` (or `modal` on the root) to trap focus.

### RadioGroup

```tsx
<RadioGroup value={plan} onValueChange={setPlan} name="plan">
  <RadioGroupItem value="pro">
    <RadioGroupIndicator />
  </RadioGroupItem>
</RadioGroup>
```

Arrow keys move between items *and* select, as the radio pattern requires; disabled items are
skipped and the group keeps a single tab stop. With a `name`, hidden radio inputs mirror the value
for native form submission.

### Slider

```tsx
<Slider value={range} onValueChange={setRange} onValueCommit={save} step={5}>
  <SliderTrack>
    <SliderRange />
  </SliderTrack>
  <SliderThumb index={0} aria-label="Minimum" />
  <SliderThumb index={1} aria-label="Maximum" />
</Slider>
```

One number per thumb; thumbs cannot cross each other. Dragging the track moves the nearest thumb,
and arrows, PageUp/PageDown, Home and End work on a focused thumb. Positioning is left to CSS:

```css
.slider-thumb { position: absolute; left: var(--susi-slider-percent); transform: translateX(-50%); }
.slider-range { left: var(--susi-slider-range-start); right: calc(100% - var(--susi-slider-range-end)); }
```

`onValueChange` fires on every step; `onValueCommit` fires when the interaction settles.

### Tooltip

```tsx
<TooltipProvider delayDuration={400} skipDelayDuration={300}>
  <Tooltip>
    <TooltipTrigger>Save</TooltipTrigger>
    <TooltipPortal>
      <TooltipContent side="top">
        <TooltipArrow />
        Saves your work
      </TooltipContent>
    </TooltipPortal>
  </Tooltip>
</TooltipProvider>
```

Opens on hover and on keyboard focus — not on a pointer press, which is the user acting rather than
asking. `TooltipProvider` is optional and shares timing across a group: once one tooltip has been
shown, neighbouring triggers skip the delay. Escape closes; content is `pointer-events: none` unless
you pass `hoverable`.

### DropdownMenu

```tsx
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
      <DropdownMenuRadioGroup value={sort} onValueChange={setSort}>
        <DropdownMenuRadioItem value="name">Name</DropdownMenuRadioItem>
      </DropdownMenuRadioGroup>
    </DropdownMenuContent>
  </DropdownMenuPortal>
</DropdownMenu>
```

ArrowDown/ArrowUp on the trigger open the menu focused on the first or last item; inside, arrows
wrap, typing jumps to an item, hovering focuses, Tab and Escape dismiss, and focus returns to the
trigger. `onSelect` runs before the menu closes — call `preventDefault()` on its event to keep the
menu open. Item state is yours to own: the content unmounts when closed, so control `checked` and
radio `value` from outside if they need to survive.

### Select

```tsx
<Select value={fruit} onValueChange={setFruit} name="fruit">
  <SelectTrigger>
    <SelectValue placeholder="Pick a fruit" />
    <SelectIcon>⌄</SelectIcon>
  </SelectTrigger>
  <SelectPortal>
    <SelectContent>
      <SelectViewport>
        <SelectGroup>
          <SelectLabel>Fruit</SelectLabel>
          <SelectItem value="apple">
            <SelectItemText>Apple</SelectItemText>
            <SelectItemIndicator>✓</SelectItemIndicator>
          </SelectItem>
        </SelectGroup>
      </SelectViewport>
    </SelectContent>
  </SelectPortal>
</Select>
```

A listbox: opens on click, Enter, Space or arrows, opens focused on the current selection, supports
typeahead, and closes on selection or Escape. `SelectContent` publishes `--susi-anchor-width` (the
trigger's width, unless `matchTriggerWidth={false}`) and `--susi-available-height`, so the viewport
can be sized in CSS:

```css
.select-content { width: var(--susi-anchor-width); }
.select-viewport { max-height: min(280px, var(--susi-available-height)); overflow-y: auto; }
```

`SelectValue` renders the selected item's text, which items register as they mount. Before the list
has ever opened only the raw value is known, so pass `children` to `SelectValue` if you need exact
control over what the trigger shows.

### Toast

```tsx
<ToastProvider duration={5000} swipeDirection="right">
  <Toast open={open} onOpenChange={setOpen}>
    <ToastTitle>Changes saved</ToastTitle>
    <ToastDescription>Your project is up to date.</ToastDescription>
    <ToastAction altText="Undo from the History menu">Undo</ToastAction>
    <ToastClose aria-label="Dismiss">×</ToastClose>
  </Toast>
  <ToastViewport />
</ToastProvider>
```

Toasts are declared wherever they make sense in your tree and render into the `ToastViewport`,
which is the live region — so it exists before any toast does and insertions get announced. Put the
viewport once, near the end of your app; position it with CSS.

- **Auto-dismiss** after `duration` (provider default 5000ms, `Infinity` to disable), paused while
  the viewport is hovered or holds focus, and resumed with the *remaining* time, not a fresh clock.
- **Swipe to dismiss** in `swipeDirection` past `swipeThreshold` px. The root carries
  `data-swipe="start | move | cancel | end"` and publishes `--susi-toast-swipe-move-x` / `-y`:

  ```css
  .toast[data-swipe='move'] { transform: translateX(var(--susi-toast-swipe-move-x)); transition: none; }
  .toast[data-swipe='cancel'] { transform: translateX(0); transition: transform 160ms ease-out; }
  ```

- **Escape** closes a focused toast (cancelable via `onEscapeKeyDown`), and the viewport hotkey
  (F8 by default) moves focus to it.
- `type="foreground"` (default) announces assertively for things the user must know now;
  `type="background"` waits its turn.
- `ToastAction` requires `altText`: how to do the same thing without the toast, since a toast may
  vanish before a screen reader user reaches it. It closes the toast unless you pass `keepOpen`.

#### useToastQueue

The components are declarative, so something has to own the list. `useToastQueue` is an optional
helper for exactly that — no styling, no globals:

```tsx
const queue = useToastQueue<{ title: string }>({ limit: 3 });

queue.add({ title: 'Saved' });        // returns an id
queue.dismiss(id);                    // closes, then removes after removeDelay
queue.update(id, { title: 'Saved!' });
queue.clear();

queue.toasts.map((toast) => (
  <Toast key={toast.id} open={toast.open} onOpenChange={(open) => !open && queue.dismiss(toast.id)}>
    <ToastTitle>{toast.data.title}</ToastTitle>
  </Toast>
));
```

`dismiss` keeps the toast mounted for `removeDelay` ms so it can animate out.

### Progress

```tsx
<Progress value={35} getValueLabel={(v, max) => `${v} of ${max} uploaded`}>
  <ProgressIndicator />
</Progress>
```

`value={null}` means indeterminate. The indicator publishes `--susi-progress-percent`.

### Separator and VisuallyHidden

`<Separator />` is decorative by default (`role="none"`); pass `decorative={false}` for a semantic
one. `<VisuallyHidden>` hides content visually while keeping it for screen readers, and exports its
style object as `VISUALLY_HIDDEN_STYLE`.

## Primitives and hooks

These are the parts to reach for when building your own components:

- `Slot` / `Primitive` — the `asChild` machinery. `<Primitive.div asChild>` is how every component
  renders its element.
- `Portal` — SSR-safe `createPortal` wrapper.
- `FocusScope` — focus trap with focus-on-mount and restore-on-unmount.
- `composeRefs`, `composeEventHandlers`, `createContext` (typed context + a hook that throws a
  useful error outside its root), `getTabbableCandidates`.
- `useFloatingPosition` — the Floating UI wiring behind every anchored overlay: pass an anchor and a
  side/align, get back styles plus the resolved placement after collisions.
- `getItems` / `nextIndexForKey` / `focusItem` — list navigation over DOM items, and `useTypeahead`
  for type-to-select.
- `useDismiss` — Escape plus outside-pointer dismissal, each cancelable by the consumer.
- `useControllableState`, `useCallbackRef`, `useId`, `useIsomorphicLayoutEffect`,
  `useEscapeKeydown`, `useOutsidePointerDown`, `useScrollLock` (reference counted).

## Server rendering

Components render without touching `window`; `Portal` renders nothing until mounted, and the
positioning-dependent parts (`PopoverContent`) only mount when open.
