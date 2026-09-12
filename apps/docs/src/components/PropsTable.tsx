export interface PropRow {
  name: string;
  type: string;
  default?: string;
  description: string;
}

export function PropsTable({ title, rows }: { title?: string; rows: PropRow[] }) {
  return (
    <>
      {title && <h3>{title}</h3>}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Prop</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.name}>
                <td>
                  <code>{row.name}</code>
                </td>
                <td>
                  <code>{row.type}</code>
                </td>
                <td>{row.default ? <code>{row.default}</code> : <span className="state">—</span>}</td>
                <td>{row.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export interface KeyRow {
  keys: string;
  description: string;
}

export function KeyboardTable({ rows }: { rows: KeyRow[] }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Key</th>
            <th>Behaviour</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.keys}>
              <td>
                <code>{row.keys}</code>
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DataAttrTable({ rows }: { rows: Array<{ attr: string; values: string; description: string }> }) {
  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Values</th>
            <th>On</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.attr + row.description}>
              <td>
                <code>{row.attr}</code>
              </td>
              <td>
                <code>{row.values}</code>
              </td>
              <td>{row.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
