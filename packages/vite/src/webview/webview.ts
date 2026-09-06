import template from './template.html';

export interface WebviewHtmlOptions {
  /**
   * local server url
   */
  serverUrl: string;
  /**
   * 注入到 `<head>` 的额外代码（生产构建的 `getWebviewHtml` 同样支持，行为一致）
   */
  injectCode?: string;
}

/**
 * 生成 dev 模式下的 webview HTML：以 iframe 加载 vite dev server，
 * 并注入消息中继（iframe ⇄ 插件双向转发），支持 HMR。
 *
 * @param options
 */
export function getWebviewHtml(options: WebviewHtmlOptions = { serverUrl: '' }) {
  let html = template.replace(/\{\{serverUrl\}\}/g, options.serverUrl);
  if (options.injectCode) {
    html = html.replace('<head>', `<head>${options.injectCode}`);
  }
  return html;
}

export default getWebviewHtml;
