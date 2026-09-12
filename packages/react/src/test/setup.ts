import '@testing-library/jest-dom/vitest';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// jsdom ships no ResizeObserver. Without it Floating UI's autoUpdate falls back
// to per-frame polling, and every frame recomputes a position — which is very
// slow under jsdom. A no-op observer keeps the tests honest and quick.
if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  } as unknown as typeof ResizeObserver;
}

afterEach(cleanup);
