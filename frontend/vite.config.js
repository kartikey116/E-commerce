import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),tailwindcss()],
  server: {
    proxt:{
      "/api": {
        target: "http://localhost:3000",
      },
    }
  },

   resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
})
