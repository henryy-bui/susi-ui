import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // Relative asset URLs, so the built site works from any path — a GitHub Pages
  // project subpath, an S3 prefix, or straight off the filesystem.
  base: './',
  plugins: [react()],
  resolve: {
    // Docs run against the library source, so examples can never document a
    // version of the API that doesn't exist yet.
    alias: {
      '@susi-ui/react': fileURLToPath(new URL('../../packages/react/src/index.ts', import.meta.url)),
    },
  },
});
