import { defineConfig } from 'vitest/config';

export default defineConfig({
  esbuild: { jsx: 'automatic' },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    // Floating UI's position calculations lean on getComputedStyle, which is
    // slow under jsdom — the Popover tests need room beyond the 5s default.
    testTimeout: 20_000,
    coverage: { provider: 'v8', include: ['src/**/*.{ts,tsx}'], exclude: ['src/test/**'] },
  },
});
