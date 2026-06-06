import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Project page served at https://simohammadi.github.io/ai-consulting/
export default defineConfig({
  base: '/ai-consulting/',
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
  },
})
