import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const productionPolicy = "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data:; font-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'; form-action 'none'";
const developmentPolicy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' ws://127.0.0.1:5175; object-src 'none'; base-uri 'none'; form-action 'none'";

export default defineConfig({
  base: './',
  plugins: [
    react(),
    {
      name: 'computer-production-csp',
      apply: 'build',
      transformIndexHtml() {
        return [{
          tag: 'meta',
          attrs: { 'http-equiv': 'Content-Security-Policy', content: productionPolicy },
          injectTo: 'head-prepend',
        }];
      },
    },
  ],
  server: {
    host: '127.0.0.1',
    port: 5175,
    strictPort: true,
    headers: { 'Content-Security-Policy': developmentPolicy },
  },
  preview: { host: '127.0.0.1', port: 4175, strictPort: true },
});
