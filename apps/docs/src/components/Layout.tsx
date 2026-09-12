import { useMemo, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { NAV, siblings } from '../nav';

export function Sidebar() {
  const [query, setQuery] = useState('');

  const groups = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return NAV;
    return NAV.map((group) => ({
      ...group,
      items: group.items.filter(
        (item) =>
          item.title.toLowerCase().includes(needle) || item.summary.toLowerCase().includes(needle),
      ),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <nav className="sidebar" aria-label="Documentation">
      <Link className="brand" to="/">
        susi-ui
        <span>headless React primitives</span>
      </Link>

      <input
        className="search"
        type="search"
        placeholder="Search components…"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        aria-label="Search documentation"
      />

      {groups.length === 0 && <p className="nav-empty">Nothing matches “{query}”.</p>}

      {groups.map((group) => (
        <div className="nav-group" key={group.title}>
          <h4>{group.title}</h4>
          {group.items.map((item) => (
            <NavLink className="nav-link" key={item.slug} to={`/${item.slug}`} end>
              {item.title}
            </NavLink>
          ))}
        </div>
      ))}
    </nav>
  );
}

export function Pager() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const { previous, next } = siblings(slug);

  return (
    <div className="pager">
      {previous ? (
        <Link to={`/${previous.slug}`}>
          <small>Previous</small>
          {previous.title}
        </Link>
      ) : (
        <span />
      )}
      {next && (
        <Link to={`/${next.slug}`} style={{ textAlign: 'right' }}>
          <small>Next</small>
          {next.title}
        </Link>
      )}
    </div>
  );
}

export function Page({
  title,
  lead,
  children,
}: {
  title: string;
  lead?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <h1 className="page-title">{title}</h1>
      {lead && <p className="page-lead">{lead}</p>}
      {children}
      <Pager />
    </>
  );
}
