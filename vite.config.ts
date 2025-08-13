import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/girard-music-boosters-updated/', // << Pages subpath
  plugins: [react()],
})
