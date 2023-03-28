import { defineConfig } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';

const ROOT = path.resolve(__dirname, '..');

// https://vitejs.dev/config/
export default defineConfig({
  mode: 'production',
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },
  build: {
    manifest: true,
    sourcemap: false,
    target: 'esnext',
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [react()],
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
    alias: [
      { find: 'app', replacement: path.resolve(ROOT, 'src/app') },
      { find: 'features', replacement: path.resolve(ROOT, 'src/features') },
      { find: 'constants', replacement: path.resolve(ROOT, 'src/constants') },
      { find: 'pages', replacement: path.resolve(ROOT, 'src/pages') },
      { find: 'components', replacement: path.resolve(ROOT, 'src/components') },
      { find: 'utils', replacement: path.resolve(ROOT, 'src/utils') },
      { find: 'assets', replacement: path.resolve(ROOT, 'src/assets') },
      { find: 'styles', replacement: path.resolve(ROOT, 'src/styles') },
      { find: 'hooks', replacement: path.resolve(ROOT, 'src/hooks') },
      { find: 'stream', replacement: 'rollup-plugin-node-polyfills/polyfills/stream' },
      { find: 'buffer', replacement: 'rollup-plugin-node-polyfills/polyfills/buffer-es6' },
    ],
  },
  optimizeDeps: {
    esbuildOptions: {
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        }),
      ],
    },
  },
});
