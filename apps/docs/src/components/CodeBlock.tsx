import { useState } from 'react';
import { Highlight, themes } from 'prism-react-renderer';

export interface CodeBlockProps {
  code: string;
  language?: string;
}

export function CodeBlock({ code, language = 'tsx' }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const source = code.trimEnd();

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(source);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard access can be denied; the code is still selectable.
    }
  };

  return (
    <div className="code">
      <button className="code-copy" type="button" onClick={copy}>
        {copied ? 'Copied' : 'Copy'}
      </button>
      <Highlight theme={themes.vsDark} code={source} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre style={{ ...style, background: 'transparent' }}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
