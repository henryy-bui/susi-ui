import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    // Consume the library source directly, so edits hot-reload without a build.
    alias: {
      '@susi-ui/react': fileURLToPath(new URL('../../packages/react/src/index.ts', import.meta.url)),
    },
  },
});
