import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
export default defineConfig({
  site: 'https://portfolio-rub.netlify.app',
  integrations: [tailwind(), mdx()],
  output: 'static',
  build: {
    inlineStylesheets: 'auto'
  }
});
