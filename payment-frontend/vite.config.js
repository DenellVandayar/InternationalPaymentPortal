import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mkcert from 'vite-plugin-mkcert'

// https://vitejs.dev/config/
export default defineConfig({
  // The plugin automatically handles the HTTPS configuration
  server: { https: true },
  plugins: [react(), mkcert()],
})