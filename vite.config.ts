import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'yi-canon-01-32',
              test: 'hexagrams.v1.01-32.json',
              priority: 20,
              includeDependenciesRecursively: false,
            },
            {
              name: 'yi-canon-33-64',
              test: 'hexagrams.v1.33-64.json',
              priority: 20,
              includeDependenciesRecursively: false,
            },
          ],
        },
      },
    },
  },
  server: {
    port: 3000,
    strictPort: true,
  },
  test: {
    environment: 'jsdom',
  },
})
