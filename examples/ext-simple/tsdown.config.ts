import { defineConfig } from 'tsdown';

export default defineConfig((cfg) => {
  return {
    entry: 'src/index.ts',
    format: ['cjs'],
    target: 'node16.17',
    externals: ['hbuilderx'],
    minify: cfg.watch ? false : cfg.minify,
    shims: false,
    clean: true,
    fixedExtension: false,
  };
});
