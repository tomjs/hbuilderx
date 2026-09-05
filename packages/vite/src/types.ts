import type { UserConfig as ViteOptions } from 'vite';

type Arrayable<T> = T | T[];

/**
 * hbuilderx extension 配置. 插件代码现在由 [vite](https://vite.dev/) 自身编译（替换了之前的 tsdown 构建），
 * 因此该接口继承 [Vite UserConfig](https://vite.dev/config/) 的所有顶层配置。
 *
 * 由插件管理、不参与继承的字段：`configFile`、`base`、`root`、`build`。
 */
export interface ExtensionOptions
  extends Omit<ViteOptions, 'configFile' | 'base' | 'root' | 'build'> {
  /**
   * 插件入口文件.
   * @default "extension/index.ts"
   */
  entry?: string | string[] | Record<string, string>;
  /**
   * 插件编译格式. 默认根据 `package.json` 的 `type` 字段.
   */
  format?: 'cjs' | 'esm';
  /**
   * 插件编译后文件输出目录. 默认 `dist-extension`.
   *
   * @default "dist-extension"
   */
  outDir?: string;
  /**
   * 不打进产物中的模块. `hbuilderx` 和 Node.js 内置模块始终会被排除.
   */
  external?: Arrayable<string | RegExp> | ((id: string, parentId?: string, isResolved?: boolean) => boolean | void);
  /**
   * 构建前清空输出目录.
   * @default true
   */
  clean?: boolean;
  /**
   * 是否启用 tree-shaking.
   * @default 生产环境 true，开发环境 false
   */
  treeshake?: boolean;
  /**
   * 构建目标，传给 Vite 的 `build.target`.
   * @default cjs: ['es2019', 'node16']，esm: 'node20'
   */
  target?: string | string[] | false;
  /**
   * 是否生成 sourcemap.
   * @default 开发环境 true，生产环境 false
   */
  sourcemap?: boolean | 'inline' | 'hidden';
  /**
   * 压缩输出. `true` 是 `'oxc'` 的别名.
   * @default 开发环境 false，生产环境 true
   */
  minify?: boolean | 'oxc' | 'terser' | 'esbuild';
  /**
   * 开发模式下额外监听的文件或目录. vite 模块依赖图始终会被监听，这里仅用于依赖图之外的文件.
   */
  watchFiles?: string | string[];
  /**
   * 开发模式忽略监听的文件或目录.
   * @default ['.history', '.temp', '.tmp', '.cache', 'dist']
   */
  ignoreWatch?: Arrayable<string | RegExp>;
  /**
   * 每次构建成功后执行的 shell 命令或回调.
   */
  onSuccess?: string | ((config?: unknown, signal?: unknown) => void | Promise<void>);
  /**
   * 通过 Vite 的 `define` 内联到产物中的环境变量.
   * @internal
   */
  env?: Record<string, string>;
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
