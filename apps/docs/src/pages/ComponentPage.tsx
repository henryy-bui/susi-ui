import type { ReactNode } from 'react';
import { CodeBlock } from '../components/CodeBlock';
import { Demo } from '../components/Demo';
import { Page } from '../components/Layout';
import { KeyboardTable, PropsTable, type KeyRow, type PropRow } from '../components/PropsTable';

export interface ComponentDoc {
  title: string;
  lead: string;
  /** Demo file name under `src/demos`. */
  demo: string;
  element: ReactNode;
  /** The parts of the component, as JSX. */
  anatomy: string;
  props: Array<{ title: string; rows: PropRow[] }>;
  keyboard?: KeyRow[];
  notes?: ReactNode;
}

export function ComponentPage({ doc }: { doc: ComponentDoc }) {
  return (
    <Page title={doc.title} lead={doc.lead}>
      <Demo name={doc.demo}>{doc.element}</Demo>

      <h2>Anatomy</h2>
      <CodeBlock code={doc.anatomy} />

      {doc.notes && (
        <>
          <h2>Notes</h2>
          {doc.notes}
        </>
      )}

      <h2>API</h2>
      {doc.props.map((table) => (
        <PropsTable key={table.title} title={table.title} rows={table.rows} />
      ))}

      {doc.keyboard && (
        <>
          <h2>Keyboard</h2>
          <KeyboardTable rows={doc.keyboard} />
        </>
      )}
    </Page>
  );
}

/** Props shared by every part: they all render a real DOM element. */
export const COMMON_PROPS: PropRow[] = [
  {
    name: 'asChild',
    type: 'boolean',
    default: 'false',
    description: 'Merge this part’s props onto its single child instead of rendering its own element.',
  },
];
