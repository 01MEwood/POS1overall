import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      // Im Dev-Modus laufen Frontend (5173) und Backend (5317) getrennt
      '/api': 'http://localhost:5317',
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
