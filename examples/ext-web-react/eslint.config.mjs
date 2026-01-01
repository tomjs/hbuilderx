import defineConfig from '@tomjs/eslint';

export default defineConfig({
  react: true,
  node: true,
  typescript: true,
}, {
  files: ['vite.config.ts'],
  rules: {
    'react-hooks/rules-of-hooks': 'off',
  },
});
