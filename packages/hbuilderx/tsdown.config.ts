import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['cjs', 'esm'],
  target: ['node16'],
  external: ['hbuilderx'],
  shims: true,
  clean: true,
  dts: true,
  publint: true,
  fixedExtension: false,
  outputOptions: {
    exports: 'named',
  },
});
