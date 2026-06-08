// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  site: 'https://bosqueworks.com',
  trailingSlash: 'ignore',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [
    sitemap({
      // Exclude internal API/management routes from the public sitemap
      filter: (page) => !page.includes('/api/') && !page.includes('/manage') && !page.includes('/concepts/'),
    }),
  ],
});
