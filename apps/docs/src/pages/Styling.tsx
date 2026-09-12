import { CodeBlock } from '../components/CodeBlock';
import { Demo } from '../components/Demo';
import { Page } from '../components/Layout';
import { DataAttrTable } from '../components/PropsTable';
import SwitchDemo from '../demos/switch';

const CSS = `/* Style the states, not the internals */
.switch { background: #d4d4d8; }
.switch[data-state='checked'] { background: rebeccapurple; }
.switch[data-disabled] { opacity: 0.5; }

.switch-thumb { transition: transform 120ms ease; }
.switch-thumb[data-state='checked'] { transform: translateX(18px); }`;

const TAILWIND = `<Switch
  className="w-11 h-6 rounded-full bg-zinc-300 data-[state=checked]:bg-violet-600 data-[disabled]:opacity-50"
>
  <SwitchThumb className="block w-5 h-5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-5" />
</Switch>`;

const VARS = `/* Components publish measurements you can't compute in CSS */
.collapsible-content[data-state='open'] {
  animation: slide-down 160ms ease-out;
}
@keyframes slide-down {
  from { height: 0; }
  to { height: var(--susi-collapsible-content-height); }
}

.select-content { width: var(--susi-anchor-width); }
.select-viewport { max-height: min(320px, var(--susi-available-height)); overflow-y: auto; }`;

export function Styling() {
  return (
    <Page
      title="Styling"
      lead="Components expose their state on the DOM. Your CSS reacts to it, in whatever styling system you already use."
    >
      <p>
        Pass <code>className</code> or <code>style</code> like you would to any element — they land on
        the underlying DOM node. What makes styling tractable is that every component writes its state
        to <code>data-*</code> attributes, so you never need to mirror state into class names yourself.
      </p>

      <Demo name="switch">
        <SwitchDemo />
      </Demo>

      <CodeBlock code={CSS} language="css" />

      <h2>The attributes</h2>
      <DataAttrTable
        rows={[
          { attr: 'data-state', values: "'on' | 'off'", description: 'Toggle' },
          { attr: 'data-state', values: "'checked' | 'unchecked' | 'indeterminate'", description: 'Checkbox, Switch, RadioGroupItem, menu checkbox and radio items, Select items' },
          { attr: 'data-state', values: "'open' | 'closed'", description: 'Collapsible, Accordion, Dialog, Popover, Tooltip, menu and select triggers' },
          { attr: 'data-state', values: "'active' | 'inactive'", description: 'Tabs' },
          { attr: 'data-state', values: "'loading' | 'complete' | 'indeterminate'", description: 'Progress' },
          { attr: 'data-disabled', values: "'' when disabled", description: 'Every control and its parts' },
          { attr: 'data-orientation', values: "'horizontal' | 'vertical'", description: 'Tabs, Accordion, Slider, Separator' },
          { attr: 'data-side', values: "'top' | 'right' | 'bottom' | 'left'", description: 'Anchored content, after collision handling' },
          { attr: 'data-align', values: "'start' | 'center' | 'end'", description: 'Anchored content, after collision handling' },
          { attr: 'data-placeholder', values: "'' when empty", description: 'SelectTrigger and SelectValue' },
          { attr: 'data-swipe', values: "'start' | 'move' | 'cancel' | 'end'", description: 'Toast, while being swiped' },
          { attr: 'data-loading', values: "'' while loading", description: 'Button' },
        ]}
      />

      <h2>With Tailwind</h2>
      <p>
        Attribute selectors are first-class in Tailwind, so the same states drive utility classes with
        no plugin or config:
      </p>
      <CodeBlock code={TAILWIND} />

      <h2>CSS variables</h2>
      <p>
        Where a value can only be known at runtime — a measured height, the width of an anchor, the
        space left on screen — the component publishes it as a custom property instead of applying
        styles itself.
      </p>
      <CodeBlock code={VARS} language="css" />

      <div className="callout">
        <strong>One exception to “no styles”.</strong> Anchored overlays set <code>position</code>,{' '}
        <code>top</code> and <code>left</code> inline, because a floating element that isn't
        positioned isn't floating. Everything else is yours.
      </div>

      <h2>Animating exits</h2>
      <p>
        Content unmounts as soon as it closes. To animate it out, pass <code>forceMount</code> (on{' '}
        <code>CollapsibleContent</code>, <code>TabsContent</code>, indicators) and drive visibility
        from <code>data-state</code> yourself, or keep the element mounted while your animation runs.
      </p>
    </Page>
  );
}
