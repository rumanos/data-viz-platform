import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
import tailwindcss from "@tailwindcss/vite"
/// <reference types="vitest" />
import { defineConfig as defineVitestConfig } from 'vitest/config'
import { mergeConfig } from 'vite'

// https://vitejs.dev/config/
// Merge Vite and Vitest configurations
const viteConfig = defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});

const vitestConfig = defineVitestConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    css: true,
  },
});

export default mergeConfig(viteConfig, vitestConfig);