import { Link } from 'react-router-dom';
import { CodeBlock } from '../components/CodeBlock';
import { Page } from '../components/Layout';
import { NAV } from '../nav';

const EXAMPLE = `import { Switch, SwitchThumb } from '@susi-ui/react';

<Switch className="switch" defaultChecked>
  <SwitchThumb className="switch-thumb" />
</Switch>`;

const CSS = `.switch[data-state='checked'] { background: rebeccapurple; }
.switch-thumb[data-state='checked'] { transform: translateX(18px); }`;

export function Introduction() {
  const components = NAV.filter((group) => !['Getting started', 'Reference'].includes(group.title));

  return (
    <Page
      title="susi-ui"
      lead="Headless, accessible React primitives — behaviour and accessibility, with no styling opinions at all."
    >
      <p>
        Every component here ships three things: the interaction behaviour, the accessibility
        semantics, and its state as <code>data-*</code> attributes. It ships no CSS, no theme, and no
        markup you can't replace. You bring the design.
      </p>

      <CodeBlock code={EXAMPLE} />
      <CodeBlock code={CSS} language="css" />

      <h2>What you get</h2>
      <ul>
        <li>
          <strong>Accessibility as the product.</strong> Roles, <code>aria-*</code> wiring, keyboard
          interaction and focus management follow the ARIA patterns and are covered by tests.
        </li>
        <li>
          <strong>Controlled or uncontrolled, one component.</strong> Pass <code>value</code> to own
          the state or <code>defaultValue</code> to let the component own it —{' '}
          <Link to="/state">see how</Link>.
        </li>
        <li>
          <strong><code>asChild</code> everywhere.</strong> Any component can render as your own
          element, merging props onto it — <Link to="/composition">see how</Link>.
        </li>
        <li>
          <strong>Composition over configuration.</strong> Compound parts instead of prop-heavy
          monoliths, so you can put your markup wherever you need it.
        </li>
      </ul>

      <h2>What you don't get</h2>
      <p>
        No stylesheet, no design tokens, no theme provider, no icon set, and no opinion about your
        CSS approach. The docs use an example stylesheet you're meant to copy and rewrite, not
        install.
      </p>

      <h2>Components</h2>
      {components.map((group) => (
        <div key={group.title}>
          <h3>{group.title}</h3>
          <div className="cards">
            {group.items.map((item) => (
              <Link className="card" key={item.slug} to={`/${item.slug}`}>
                <strong>{item.title}</strong>
                <span>{item.summary}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </Page>
  );
}
