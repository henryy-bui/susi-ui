import { CodeBlock } from '../components/CodeBlock';
import { Page } from '../components/Layout';
import { PropsTable } from '../components/PropsTable';

const SLOT = `import { Slot, Primitive } from '@susi-ui/react';

// Slot merges props onto its single child
<Slot className="a" onClick={outer}>
  <button className="b" onClick={inner} />
</Slot>

// Primitive is a DOM element with asChild built in — every component
// in the library renders through one
<Primitive.div asChild>
  <section />
</Primitive.div>`;

const PORTAL = `import { Portal } from '@susi-ui/react';

<Portal container={modalRoot}>
  <div>Rendered elsewhere in the DOM, still inside your React tree</div>
</Portal>`;

const FOCUS = `import { FocusScope } from '@susi-ui/react';

<FocusScope trapped autoFocus restoreFocus>
  <input />
  <button>Save</button>
</FocusScope>`;

const HELPERS = `import { composeRefs, composeEventHandlers, createContext } from '@susi-ui/react';

const ref = composeRefs(forwardedRef, localRef);          // keep both handles
const onClick = composeEventHandlers(props.onClick, ours); // theirs first, ours unless prevented

// A context whose hook throws a useful error outside its root
const [MenuProvider, useMenuContext] = createContext<MenuValue>('Menu');`;

const LISTS = `import { getItems, nextIndexForKey, focusItem, useTypeahead } from '@susi-ui/react';

const items = getItems(container, 'data-my-item');   // enabled items, in DOM order
const next = nextIndexForKey({ key: event.key, current, length: items.length });
if (next !== -1) focusItem(items[next]);`;

export function Primitives() {
  return (
    <Page
      title="Primitives"
      lead="The parts the components are built from, exported so your own components can use them too."
    >
      <h2>Slot and Primitive</h2>
      <p>
        The machinery behind <code>asChild</code>: <code>className</code> and <code>style</code> are
        merged, handlers chained (child first), refs composed.
      </p>
      <CodeBlock code={SLOT} />

      <h2>Portal</h2>
      <p>
        A server-safe <code>createPortal</code>: it renders nothing until mounted, so SSR markup
        matches and hydration stays quiet.
      </p>
      <CodeBlock code={PORTAL} />

      <h2>FocusScope</h2>
      <p>Focus management for overlay content, rendered as a plain div you can style.</p>
      <CodeBlock code={FOCUS} />
      <PropsTable
        rows={[
          { name: 'trapped', type: 'boolean', default: 'true', description: 'Keep Tab focus inside the scope.' },
          { name: 'autoFocus', type: 'boolean', default: 'true', description: 'Move focus in on mount.' },
          { name: 'restoreFocus', type: 'boolean', default: 'true', description: 'Return focus on unmount.' },
          { name: 'onMountAutoFocus', type: '(event: Event) => void', description: 'preventDefault() to place focus yourself.' },
          { name: 'onUnmountAutoFocus', type: '(event: Event) => void', description: 'preventDefault() to control where focus returns.' },
        ]}
      />

      <h2>Helpers</h2>
      <CodeBlock code={HELPERS} />

      <h2>List navigation</h2>
      <p>What the menus, tabs and select use for arrow keys and type-to-select.</p>
      <CodeBlock code={LISTS} />

      <h2>Positioning</h2>
      <p>
        <code>useFloatingPosition</code> wraps the Floating UI setup used by every anchored overlay:
        give it an anchor element, a side and an align, and it returns the styles plus the placement
        it actually settled on after collisions.
      </p>
      <PropsTable
        title="useFloatingPosition(params)"
        rows={[
          { name: 'open', type: 'boolean', description: 'Whether the floating element is showing.' },
          { name: 'reference', type: 'HTMLElement | null', description: 'The element to anchor to.' },
          { name: 'side / align', type: 'Side / Align', description: 'Preferred placement before collision handling.' },
          { name: 'sideOffset / alignOffset', type: 'number', description: 'Distance from the anchor, in px.' },
          { name: 'arrowElement', type: 'HTMLElement | null', description: 'Enables arrow positioning.' },
          { name: 'matchAnchorWidth', type: 'boolean', default: 'false', description: 'Publish the anchor width as --susi-anchor-width.' },
          { name: 'returns', type: '{ setFloating, floatingStyles, side, align, arrowStyles }', description: 'Resolved placement after flip and shift.' },
        ]}
      />
    </Page>
  );
}
