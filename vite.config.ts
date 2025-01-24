import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],

  define: {
    'process.env': {},
  },

  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, './src'),
  //   },
  // },

  build: {
    lib: {
      entry: 'src/main.tsx',
      name: 'Workspaces-mocker',
      fileName: 'mocker',
      formats: ['es', 'cjs'],
    },
    target: 'ESNext',
  },
});
