//@ts-nocheck
import { defineConfig } from 'vite';
import {
  sallaBuildPlugin,
  sallaDemoPlugin,
  sallaTransformPlugin,
} from '@salla.sa/twilight-bundles/vite-plugins';

export default defineConfig({
  plugins: [
    sallaTransformPlugin(),
    sallaBuildPlugin(),
    sallaDemoPlugin({
      // Landing sections are full width, so the demo stacks them in one column
      grid: { columns: 'minmax(0, 1fr)', gap: '0' },
    }),
  ],
});
