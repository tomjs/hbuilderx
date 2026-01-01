/// <reference types="@tomjs/hbuilderx/types" />

/**
 * 提供 webview 代码注入的虚拟模块
 */
declare module 'virtual:hbuilderx' {
  import type { ExtensionContext } from 'hbuilderx';

  export interface WebviewHtmlOptions {
    /**
     * `[vite serve]` vite dev 服务地址. 请使用 `process.env.VITE_DEV_SERVER_URL`
     */
    serverUrl?: string;
    /**
     * `[vite build]` 插件的上下文 `ExtensionContext`.
     */
    context: ExtensionContext;
    /**
     * `[vite build]` vite build.rollupOptions.input 设置的 index 名. 默认 `index`.
     */
    inputName?: string;
    /**
     * `[vite build]` 在 `<head>` 后面注入 `script` 或 `style` 代码
     */
    injectCode?: string;
  }

  /**
   * Get the html of the webview.
   *
   * @param options
   */
  export const getWebviewHtml: (options?: WebviewHtmlOptions) => string;

  export default getWebviewHtml;
}
