import { useState, type ReactNode } from 'react';
import { CodeBlock } from './CodeBlock';
import { getDemoSource } from '../demos';

export interface DemoProps {
  /** File name under `src/demos`, without the extension. */
  name: string;
  children: ReactNode;
}

/**
 * A live example plus the exact source that renders it — the code is read from
 * the demo file at build time, so it can never drift from what you see.
 */
export function Demo({ name, children }: DemoProps) {
  const [showCode, setShowCode] = useState(false);
  const source = getDemoSource(name);

  return (
    <div className="demo">
      <div className="demo-preview">{children}</div>
      <div className="demo-toolbar">
        <span>Live example</span>
        <button type="button" onClick={() => setShowCode((value) => !value)}>
          {showCode ? 'Hide code' : 'Show code'}
        </button>
      </div>
      {showCode && <CodeBlock code={source} />}
    </div>
  );
}
