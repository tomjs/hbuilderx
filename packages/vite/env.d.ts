/// <reference types="./env-hbuilderx.d.ts" />

export { };
declare global {

  type UnionType<T> = T | (string & {});

  namespace NodeJS {
    interface ProcessEnv {
      /**
       * Node.js 环境变量
       */
      NODE_ENV: UnionType<'development' | 'production'>;
      /**
       * `[vite serve]` vite dev 服务地址
       */
      VITE_DEV_SERVER_URL?: string;
      /**
       * `[vite build]` web端静态资源输出目录
       */
      VITE_WEBVIEW_DIST?: string;
    }
  }
}
