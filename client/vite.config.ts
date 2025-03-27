import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// paths aliass
import * as path from "path"
import tailwindcss from "@tailwindcss/vite"
const ReactCompilerConfig = {
  // Enable React Compiler
  enabled: true,
  // Optional: configure development mode behavior
  development: {
    // Keep original component names for better debugging
    keepOriginalFunctionNames: true
  }
};

// https://vite.dev/config/
export default defineConfig({
  base: "/",
  plugins: [
    react({
      babel: {
        plugins: [["babel-plugin-react-compiler", ReactCompilerConfig]],
      },
    }),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  preview: {
    port: 5173,
    strictPort: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: "0.0.0.0",
    proxy: {
      '/api': {
        // target: 'http://192.168.1.115:3000',
        target: 'http://backend:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    },
    watch: {
      usePolling: true
    },
    origin: "http://localhost:5173",
  },
})
