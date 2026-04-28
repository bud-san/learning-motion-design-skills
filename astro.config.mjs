// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://bud-san.github.io',
  base: '/learning-motion-design-skills',
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()],
  },
});
