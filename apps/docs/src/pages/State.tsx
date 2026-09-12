import { CodeBlock } from '../components/CodeBlock';
import { Demo } from '../components/Demo';
import { Page } from '../components/Layout';
import ControlledDemo from '../demos/controlled';

const BOTH = `// Uncontrolled — the component owns the state
<Switch defaultChecked onCheckedChange={save} />

// Controlled — you own it
<Switch checked={checked} onCheckedChange={setChecked} />`;

const HOOK = `import { useControllableState } from '@susi-ui/react';

function Rating({ value, defaultValue = 0, onValueChange }) {
  const [rating, setRating] = useControllableState({
    prop: value,
    defaultProp: defaultValue,
    onChange: onValueChange,
  });

  return <button onClick={() => setRating(rating + 1)}>{rating}</button>;
}`;

const PAIRS = `open / defaultOpen / onOpenChange        Collapsible, Accordion item, Dialog, Popover, Tooltip, DropdownMenu, Select, Toast
checked / defaultChecked / onCheckedChange   Checkbox, Switch, menu checkbox items
pressed / defaultPressed / onPressedChange   Toggle
value / defaultValue / onValueChange         Accordion, Tabs, RadioGroup, Slider, Select, menu radio groups`;

export function State() {
  return (
    <Page
      title="Controlled state"
      lead="Every stateful component works both ways, and the change callback fires either way."
    >
      <CodeBlock code={BOTH} />

      <p>
        The rule is the same everywhere: pass the <em>controlled</em> prop and the component never
        changes state on its own — it calls your handler and waits. Pass the <code>default…</code>{' '}
        prop instead and it manages the state internally, still telling you about every change.
      </p>

      <Demo name="controlled">
        <ControlledDemo />
      </Demo>

      <div className="callout">
        <strong>A controlled component that ignores its callback never moves.</strong> That's not a
        bug — it's how you gate an interaction behind a confirmation, a permission check or a request.
      </div>

      <h2>The prop pairs</h2>
      <CodeBlock code={PAIRS} language="text" />

      <h2>Building your own</h2>
      <p>
        The hook behind all of this is exported, so your own components can take the same shape
        without reimplementing the branching:
      </p>
      <CodeBlock code={HOOK} />

      <h2>State that has to outlive the component</h2>
      <p>
        Overlay content unmounts when it closes. Anything inside it — a menu checkbox, a radio
        selection, a form value — resets unless you own it from outside. When state needs to survive
        closing, control it.
      </p>
    </Page>
  );
}
