import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/** Dev-only: when `VITE_API_URL` is empty, API paths are same-origin; forward to backend. */
const devApiTarget = 'http://localhost:8080'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/auth': { target: devApiTarget, changeOrigin: true },
      '/company': { target: devApiTarget, changeOrigin: true },
      '/student': { target: devApiTarget, changeOrigin: true },
      '/internship': { target: devApiTarget, changeOrigin: true },
    },
  },
})
