import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// finverk Konfigurator – Vite config.
// `base: './'` hält die Build-Ausgabe portabel (Vercel, statisches Hosting, Unterverzeichnis).
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
})
