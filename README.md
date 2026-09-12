# susi-ui

Headless, accessible React primitives — the base layer I build other projects on top of.

The library ships **behaviour, accessibility and state**, and **no CSS at all**. Every component
exposes its state as `data-*` attributes so the look is entirely up to the consuming project.

```tsx
import { Switch, SwitchThumb } from '@susi-ui/react';

<Switch className="switch" defaultChecked>
  <SwitchThumb className="switch-thumb" />
</Switch>;
```

```css
.switch[data-state='checked'] { background: rebeccapurple; }
.switch-thumb[data-state='checked'] { transform: translateX(18px); }
```

## Repository layout

```
packages/react      @susi-ui/react — the library (tsup build, vitest tests)
apps/playground     Vite demo app + Storybook, consuming the library source directly
```

## Getting started

Requires **Node 22.12+** (see `.nvmrc`) and pnpm 9.

```bash
pnpm install
pnpm dev                  # Vite playground at http://localhost:5173
pnpm storybook            # Storybook at http://localhost:6006
pnpm test                 # vitest
pnpm typecheck
pnpm build                # library dist/ + playground build
```

The playground aliases `@susi-ui/react` to the library **source**, so changes hot-reload without a
rebuild. The published entry point is still the bundled `dist/`.

## What's in the box

| Area | Exports |
| --- | --- |
| Primitives | `Slot`, `Primitive`, `Portal`, `FocusScope`, `composeRefs`, `composeEventHandlers`, `createContext`, `getTabbableCandidates`, `getItems`, `nextIndexForKey`, `useFloatingPosition` |
| Hooks | `useControllableState`, `useCallbackRef`, `useId`, `useIsomorphicLayoutEffect`, `useEscapeKeydown`, `useOutsidePointerDown`, `useDismiss`, `useTypeahead`, `useScrollLock` |
| Controls | `Button`, `Toggle`, `Checkbox`, `Switch`, `RadioGroup`, `Slider` |
| Disclosure | `Collapsible`, `Accordion`, `Tabs` |
| Overlays | `Dialog`, `Popover`, `Tooltip`, `DropdownMenu`, `Select` |
| Display | `Progress`, `Separator`, `VisuallyHidden` |

Full component API: [`packages/react/README.md`](packages/react/README.md).

## Design rules

1. **No styles, ever.** State goes out as `data-state`, `data-disabled`, `data-side`, `data-orientation`.
2. **Controlled or uncontrolled, same component.** Every stateful component takes `value` /
   `defaultValue` (or `open` / `defaultOpen`, …) plus a change callback, via `useControllableState`.
3. **`asChild` everywhere.** Any component can render as a different element by merging its props
   onto a single child — that's the `Slot` primitive.
4. **Accessibility is the product.** Roles, `aria-*` wiring, keyboard interaction and focus
   management follow the APG patterns, and are covered by tests rather than assumed.
5. **Composition over configuration.** Compound parts (`Dialog` + `DialogTrigger` + `DialogContent` …)
   instead of prop-heavy monoliths.

## Notes

- `@floating-ui/react-dom` is the only runtime dependency (used by `Popover`). React and React DOM
  are peer dependencies, `>=18`.
- The two `optionalDependencies` in the root `package.json` are darwin-arm64 native bindings for
  rolldown and oxc that pnpm otherwise misses; they're skipped automatically on other platforms.
- No linter is configured yet — TypeScript in strict mode plus the test suite are the current gates.
- The tests run slowly (~90s): Floating UI's collision detection leans on `getComputedStyle`, which
  is very slow under jsdom. It's an environment artifact, not a runtime cost.
- Not built yet: `Toast`, `Combobox`, `ContextMenu`, `NavigationMenu`, `HoverCard`, `Avatar`.
