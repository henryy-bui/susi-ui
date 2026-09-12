import { CodeBlock } from '../components/CodeBlock';
import { Demo } from '../components/Demo';
import { Page } from '../components/Layout';
import AsChildDemo from '../demos/as-child';

const BASIC = `// Renders <button> by default
<Button>Save</Button>

// Renders your <a>, carrying the Button's props and behaviour
<Button asChild>
  <a href="/docs">Docs</a>
</Button>`;

const MERGE = `<Button asChild className="from-button" onClick={track}>
  <a className="from-link" onClick={navigate} href="/docs">Docs</a>
</Button>

// Result: <a class="from-button from-link" href="/docs">
// Both onClick handlers run — the child's first. If it calls
// event.preventDefault(), the component's own handler is skipped.`;

const COMPOSE = `// Your own styled button, used as a dialog trigger
<DialogTrigger asChild>
  <MyButton variant="danger">Delete</MyButton>
</DialogTrigger>`;

const SLOT = `import { Slot } from '@susi-ui/react';

// A component that can render as any element its consumer chooses
export function Card({ asChild, ...props }) {
  const Comp = asChild ? Slot : 'div';
  return <Comp className="card" {...props} />;
}`;

export function Composition() {
  return (
    <Page
      title="Composition & asChild"
      lead="Change the element a component renders without losing what it does."
    >
      <CodeBlock code={BASIC} />

      <Demo name="as-child">
        <AsChildDemo />
      </Demo>

      <h2>How props merge</h2>
      <p>
        <code>asChild</code> clones the single child and merges onto it:{' '}
        <code>className</code> and <code>style</code> are combined rather than replaced, event
        handlers are chained, and refs are composed so both sides keep their handle on the node.
      </p>
      <CodeBlock code={MERGE} />

      <div className="callout">
        <strong>Exactly one child.</strong> <code>asChild</code> needs a single React element, and it
        must forward props and its ref to a DOM node — so your own components need{' '}
        <code>forwardRef</code> (or React 19's <code>ref</code> prop) to be usable this way.
      </div>

      <h2>Composing components together</h2>
      <p>
        Because both sides merge, two library components can share one element instead of nesting
        wrappers — a trigger that <em>is</em> your button, not a span around it:
      </p>
      <CodeBlock code={COMPOSE} />

      <h2>Using Slot in your own components</h2>
      <p>
        <code>Slot</code> is the primitive that powers <code>asChild</code>, and it is exported so
        your components can offer the same escape hatch:
      </p>
      <CodeBlock code={SLOT} />

      <h2>Compound parts</h2>
      <p>
        Components are split into parts (<code>Dialog</code>, <code>DialogTrigger</code>,{' '}
        <code>DialogContent</code>, …) rather than configured with props. Your markup goes between
        the parts, so layout, wrappers and extra elements stay yours. Parts read their state from
        context, and rendering one outside its root throws with a message naming both.
      </p>
    </Page>
  );
}
