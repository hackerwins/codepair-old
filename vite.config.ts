import { defineConfig, splitVendorChunkPlugin } from 'vite';
import path from 'path';
import react from '@vitejs/plugin-react';
// import eslint from 'vite-plugin-eslint';
// import { nodePolyfills } from 'vite-plugin-node-polyfills';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import rollupNodePolyFill from 'rollup-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
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
    rollupOptions: {
      plugins: [rollupNodePolyFill()],
    },
  },
  plugins: [
    react({
      // include: '**/*.tsx',
    }),
    // nodePolyfills({
    //   // Whether to polyfill `node:` protocol imports.
    //   // protocolImports: true,
    // }),
    // eslint(),
    // splitVendorChunkPlugin(),
  ],
  resolve: {
    alias: [
      { find: 'app', replacement: path.resolve(__dirname, 'src/app') },
      { find: 'features', replacement: path.resolve(__dirname, 'src/features') },
      { find: 'pages', replacement: path.resolve(__dirname, 'src/pages') },
      { find: 'components', replacement: path.resolve(__dirname, 'src/components') },
      { find: 'utils', replacement: path.resolve(__dirname, 'src/utils') },
      { find: 'assets', replacement: path.resolve(__dirname, 'src/assets') },
      { find: 'styles', replacement: path.resolve(__dirname, 'src/styles') },
      { find: 'hooks', replacement: path.resolve(__dirname, 'src/hooks') },
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
  define: {
    global: {},
  },
});
