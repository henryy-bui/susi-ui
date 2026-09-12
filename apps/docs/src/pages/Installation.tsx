import { Link } from 'react-router-dom';
import { CodeBlock } from '../components/CodeBlock';
import { Page } from '../components/Layout';

const INSTALL = `pnpm add @susi-ui/react
# npm install @susi-ui/react
# yarn add @susi-ui/react`;

const FIRST = `import { Dialog, DialogContent, DialogPortal, DialogTitle, DialogTrigger } from '@susi-ui/react';

export function DeleteButton() {
  return (
    <Dialog>
      <DialogTrigger className="btn">Delete</DialogTrigger>
      <DialogPortal>
        <DialogContent className="dialog">
          <DialogTitle>Delete this project?</DialogTitle>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}`;

export function Installation() {
  return (
    <Page title="Installation" lead="One package, two peer dependencies, no stylesheet to import.">
      <CodeBlock code={INSTALL} language="bash" />

      <h2>Requirements</h2>
      <ul>
        <li>
          <strong>React 18 or 19</strong> — <code>react</code> and <code>react-dom</code> are peer
          dependencies.
        </li>
        <li>
          <strong>TypeScript is optional.</strong> Types ship with the package; there is nothing to
          install separately.
        </li>
        <li>
          <strong>A bundler that reads <code>exports</code></strong> — Vite, Next.js, Rspack, Parcel
          and Webpack 5 all qualify. ESM and CJS builds are both published.
        </li>
      </ul>

      <div className="callout">
        <strong>No CSS import.</strong> The package has no stylesheet. Nothing will look like
        anything until you write styles — that is the point. Start from{' '}
        <Link to="/styling">Styling</Link>.
      </div>

      <h2>Your first component</h2>
      <CodeBlock code={FIRST} />

      <h2>Bundle size</h2>
      <p>
        The package is side-effect free and fully tree-shaken: importing <code>Button</code> pulls in
        the button and its primitives, nothing else. The only runtime dependency is{' '}
        <code>@floating-ui/react-dom</code>, and it is only reached through the anchored overlays
        (<code>Popover</code>, <code>Tooltip</code>, <code>DropdownMenu</code>, <code>Select</code>).
      </p>
    </Page>
  );
}
