import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';

const __dirname = dirname(fileURLToPath(import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true,
      rollupTypes: true,
      tsconfigPath: './tsconfig.app.json',
    }),
  ],

  define: {
    'process.env': {},
  },

  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },

  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.tsx'),
      name: 'WorkspacesMocker',
      fileName: 'index',
    },
  },
});
