import { defineConfig } from 'vite';

// Simple config without dynamic imports
export default defineConfig({
  plugins: [],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5002',
    },
  },
});
