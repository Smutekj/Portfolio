import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
  base: '/Portfolio/',
    build: {
    sourcemap: true, // for production
    minify: "esbuild"
  },
  plugins: [react(), svgr()],
})
