import { defineConfig } from 'tsdown';

export default defineConfig((options) => {
  const isDev = !!options.watch;
  return [
    {
      entry: ['src/index.ts'],
      format: ['esm'],
      target: ['node20'],
      shims: true,
      clean: false,
      dts: false,
      publint: true,
      fixedExtension: false,
      env: {
        NODE_ENV: isDev ? 'development' : 'production',
      },
    },
    {
      entry: ['src/types.ts'],
      format: ['esm'],
      clean: false,
      dts: true,
      publint: true,
      fixedExtension: false,
    },
  ];
});
