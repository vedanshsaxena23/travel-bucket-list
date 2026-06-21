import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Any request starting with '/api' will be proxied
      '/api': {
        target: 'http://127.0.0.1:5000', // The URL where your Flask server is running
        changeOrigin: true,
        // Optional: Rewrite the path if your Flask routes don't include '/api'
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
})
