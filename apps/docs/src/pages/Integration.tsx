import { CodeBlock } from '../components/CodeBlock';
import { Page } from '../components/Layout';

const NEXT = `'use client';

// Every interactive component needs the client boundary: they use state,
// effects and DOM events. Mark the component that renders them, not the page.
import { Dialog, DialogContent, DialogPortal, DialogTitle, DialogTrigger } from '@susi-ui/react';

export function ConfirmDialog() {
  return (
    <Dialog>
      <DialogTrigger>Delete</DialogTrigger>
      <DialogPortal>
        <DialogContent>
          <DialogTitle>Are you sure?</DialogTitle>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}`;

const TAILWIND = `// tailwind.config.ts — nothing special is required; the components emit
// data attributes, which Tailwind targets out of the box:
<Checkbox className="size-5 rounded border data-[state=checked]:bg-violet-600" />`;

const MODULES = `import styles from './switch.module.css';

<Switch className={styles.switch}>
  <SwitchThumb className={styles.thumb} />
</Switch>`;

const MODULES_CSS = `/* switch.module.css */
.switch { background: #d4d4d8; }
.switch[data-state='checked'] { background: rebeccapurple; }`;

const TESTS = `import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('toggles', async () => {
  render(<Switch aria-label="Wi-Fi" />);
  const control = screen.getByRole('switch');

  await userEvent.click(control);
  expect(control).toBeChecked();
});`;

const PORTAL = `// Render overlay content somewhere other than document.body
<DialogPortal container={containerRef.current}>
  <DialogContent>…</DialogContent>
</DialogPortal>`;

export function Integration() {
  return (
    <Page
      title="Framework integration"
      lead="What to know when dropping these components into a real project."
    >
      <h2>Vite / SPA</h2>
      <p>Nothing to configure. Install, import, style.</p>

      <h2>Next.js and React Server Components</h2>
      <p>
        The components render on the server without touching <code>window</code>, but they are
        interactive, so they belong in client components. Put <code>'use client'</code> at the top of
        the file that renders them:
      </p>
      <CodeBlock code={NEXT} />
      <p>
        Portalled content (<code>DialogPortal</code>, <code>PopoverPortal</code>, …) renders nothing
        until mounted, so server and client markup match and there is no hydration warning. Overlay
        content only mounts when open, so nothing is measured during SSR.
      </p>

      <h2>Tailwind CSS</h2>
      <CodeBlock code={TAILWIND} />

      <h2>CSS Modules</h2>
      <CodeBlock code={MODULES} />
      <CodeBlock code={MODULES_CSS} language="css" />

      <h2>Portals and stacking context</h2>
      <p>
        Overlays render into <code>document.body</code> by default, which keeps them clear of{' '}
        <code>overflow: hidden</code> and transformed ancestors. Pass <code>container</code> to put
        them somewhere else — a modal root, a shadow host, or a scoped theme wrapper whose CSS
        variables the overlay needs to inherit.
      </p>
      <CodeBlock code={PORTAL} />

      <h2>Testing</h2>
      <p>
        Components are queried by role, which is what makes them testable the way users use them:
      </p>
      <CodeBlock code={TESTS} />
      <div className="callout">
        <strong>Under jsdom</strong>, two things are missing that the components rely on:{' '}
        <code>PointerEvent</code> (needed by slider drags and toast swipes) and{' '}
        <code>ResizeObserver</code>. Polyfill both in your test setup. Floating UI's collision
        detection is also very slow in jsdom, so give overlay tests a generous timeout or run them in
        a real browser runner.
      </div>

      <h2>Bundling</h2>
      <ul>
        <li>ESM and CJS builds, with types for both.</li>
        <li>
          <code>sideEffects: false</code>, so unused components are dropped by any modern bundler.
        </li>
        <li>
          React is a peer dependency — it will never be duplicated into your bundle.
        </li>
      </ul>
    </Page>
  );
}
