import type { InlineConfig } from 'tsdown';

/**
 * hbuilderx 插件配置. 查看 [tsdown](https://tsdown.dev/) 和 [Config Options](https://tsdown.dev/reference/config-options) 获取更多信息.
 */
export interface ExtensionOptions
  extends Omit<
    InlineConfig,
    'entry' | 'format' | 'outDir' | 'watch'
  > {
  /**
   * 插件入口文件.
   * @default "extension/index.ts"
   */
  entry?: string;
  /**
   * 插件编译后文件输出目录. 默认 `dist-extension`.
   *
   * @default "dist-extension"
   */
  outDir?: string;
  /**
   * `tsdown`默认监听当前工作目录。可以设置需要监听的文件，这可能会提高性能。
   *
   * 如果未指定值，则 `recommended` 参数为 `true` 时的默认值为 `["extension"]`，否则为 `tsdown` 默认行为
   */
  watchFiles?: string | string[];
}

/**
 * hbuilderx webview 配置.
 */
export interface WebviewOption {
  /**
   * 开发模式，刷新页面的按键，如 F5/F6
   * @default "F6"
   */
  refreshKey?: string;
}

/**
 * vite 插件配置.
 */
export interface PluginOptions {
  /**
   * 推荐标识. 默认为 `true`.
   * 如果是 `true`, 将会有如下默认行为:
   * - 将会同步修改 `extension/webview` 的输出目录
   * - 如果 vite build.outDir 是 'dist', 将会修改`插件/webview` 目录为 `dist/extension` 和 `dist/webview`
   * @default true
   */
  recommended?: boolean;
  /**
   * 在开发过程中，将代码注入到 `hbuilderx 扩展代码` 和 `web页面` 代码中，以支持 `HMR`；
   *
   * 在生产构建过程中，将最终生成的 `index.html` 代码注入到 `hbuilderx 扩展代码` 中，以最大限度地减少开发工作。
   *
   * @example
   * extension file
   * ```ts
   *import {getWebviewHtml} from 'virtual:hbuilderx';
   *
   *function setupHtml(webview: Webview, context: ExtensionContext) {
   *  return getWebviewHtml({serverUrl:process.env.VITE_DEV_SERVER_URL, context});
   *}
   * ```
   */
  webview?: boolean | WebviewOption;
  /**
   * 插件配置
   */
  extension?: ExtensionOptions;
  /**
   * 是否开启 devtools. 注入 `<script src="http://localhost:<devtools-port>"></script>` 到 webview 端. 默认是 `false`.
   *  - `true`:
   *    - react: 注入 `<script src="http://localhost:8097"></script>`
   *    - vue: 注入 `<script src="http://localhost:8098"></script>`
   *  - `number`: 自定义端口号
   * @default false
   */
  devtools?: boolean | number;
}
