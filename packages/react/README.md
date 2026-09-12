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
| `data-side` / `data-align` | `PopoverContent`, after collision handling |

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

## Primitives and hooks

These are the parts to reach for when building your own components:

- `Slot` / `Primitive` — the `asChild` machinery. `<Primitive.div asChild>` is how every component
  renders its element.
- `Portal` — SSR-safe `createPortal` wrapper.
- `FocusScope` — focus trap with focus-on-mount and restore-on-unmount.
- `composeRefs`, `composeEventHandlers`, `createContext` (typed context + a hook that throws a
  useful error outside its root), `getTabbableCandidates`.
- `useControllableState`, `useCallbackRef`, `useId`, `useIsomorphicLayoutEffect`,
  `useEscapeKeydown`, `useOutsidePointerDown`, `useScrollLock` (reference counted).

## Server rendering

Components render without touching `window`; `Portal` renders nothing until mounted, and the
positioning-dependent parts (`PopoverContent`) only mount when open.
