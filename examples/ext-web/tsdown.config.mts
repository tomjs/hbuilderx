import { createRequire } from 'node:module';
import { defineConfig } from 'tsdown';

const require = createRequire(import.meta.url);
const pkg = require('./package.json');

export default defineConfig((cfg) => {
  return {
    entry: 'src/index.ts',
    target: 'node16.17',
    format: 'cjs',
    external: ['hbuilderx'],
    noExternal: cfg.watch ? [] : Object.keys(pkg.dependencies || {}),
    fixedExtension: false,
    loader: {
      '.html': 'text',
    },
  };
});
