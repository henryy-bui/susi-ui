import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { Sidebar } from './components/Layout';
import { Introduction } from './pages/Introduction';
import { Installation } from './pages/Installation';
import { Styling } from './pages/Styling';
import { State } from './pages/State';
import { Composition } from './pages/Composition';
import { Integration } from './pages/Integration';
import { Primitives } from './pages/Primitives';
import { Hooks } from './pages/Hooks';
import { ComponentPage } from './pages/ComponentPage';
import { CONTROL_DOCS } from './pages/docs-controls';
import { DISCLOSURE_DOCS } from './pages/docs-disclosure';
import { OVERLAY_DOCS } from './pages/docs-overlays';
import { FEEDBACK_DOCS } from './pages/docs-feedback';

const COMPONENT_DOCS = {
  ...CONTROL_DOCS,
  ...DISCLOSURE_DOCS,
  ...OVERLAY_DOCS,
  ...FEEDBACK_DOCS,
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => window.scrollTo(0, 0), [pathname]);
  return null;
}

export function App() {
  return (
    <div className="layout">
      <Sidebar />
      <main className="content">
        <div className="content-inner">
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Introduction />} />
            <Route path="/installation" element={<Installation />} />
            <Route path="/styling" element={<Styling />} />
            <Route path="/state" element={<State />} />
            <Route path="/composition" element={<Composition />} />
            <Route path="/integration" element={<Integration />} />
            <Route path="/primitives" element={<Primitives />} />
            <Route path="/hooks" element={<Hooks />} />
            {Object.entries(COMPONENT_DOCS).map(([slug, doc]) => (
              <Route key={slug} path={`/${slug}`} element={<ComponentPage doc={doc} />} />
            ))}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
