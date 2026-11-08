// @ts-check
import { defineConfig } from 'astro/config';

// Static build for Vercel. Set `site` once the domain is chosen (used for canonical and social URLs).
export default defineConfig({
  output: 'static',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
