import path from 'node:path';
import hbuilderx from '@tomjs/vite-plugin-hbuilderx';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';
import devtools from 'vite-plugin-vue-devtools';

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': '/src',
    },
  },
  build: {
    assetsInlineLimit: 1024 * 100,
    rollupOptions: {
      // 多页面时配置
      input: [path.resolve(__dirname, 'index.html'), path.resolve(__dirname, 'index2.html')],
    },
  },
  plugins: [vue(), hbuilderx(), devtools()],
});
