# @tomjs/vite-plugin-hbuilderx

[![npm](https://img.shields.io/npm/v/@tomjs/vite-plugin-hbuilderx)](https://www.npmjs.com/package/@tomjs/vite-plugin-hbuilderx) ![node-current (scoped)](https://img.shields.io/node/v/@tomjs/vite-plugin-hbuilderx) ![license](https://img.shields.io/npm/l/@tomjs/vite-plugin-hbuilderx) [![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@tomjs/vite-plugin-hbuilderx)

> 为 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 开发 [插件](https://hx.dcloud.net.cn/ExtensionTutorial/README) 提供 [vite](https://cn.vitejs.dev/) 插件，可以用 `vue`/`react` 来开发 [WebView视图](https://hx.dcloud.net.cn/ExtensionDocs/Api/windows/createWebView) 和 [WebView页面的对话框](https://hx.dcloud.net.cn/ExtensionDocs/Api/windows/createWebViewDialog)。

在开发模式时，使用 `iframe` 加载 `vue`/`react` 服务，在 `iframe` 和 `parent` 之间模拟 `hbuilderx.postMessage`等方法，用来支持 `HMR`；生产构建时，将最终生成的 `index.html` 代码注入到 `插件代码` 中，减少工作量。

## 特性

- 使用 [tsdown](https://tsdown.dev/zh-CN/) 快速构建 `插件代码`
- 配置简单，专注业务
- 支持 webview `HMR`
- 支持[多页面应用](https://cn.vitejs.dev/guide/build.html#multi-page-app)
- 支持 `vue` 、`react` 等其他 `vite` 支持的[框架](https://cn.vitejs.dev/guide/#trying-vite-online)

## 安装

```bash
# pnpm
pnpm add -D @tomjs/vite-plugin-hbuilderx

# yarn
yarn add -D @tomjs/vite-plugin-hbuilderx

# npm
npm add -D @tomjs/vite-plugin-hbuilderx
```

## 使用说明

### 推荐约定

设置 `recommended` 参数为 `true` 会修改一些预置配置，详细查看 [PluginOptions](#pluginoptions) 和 `recommended` 参数说明。

#### 目录结构

- 默认情况下，`recommended:true` 会根据如下目录结构作为约定

```
|--extension      // extension code
|  |--index.ts
|--src            // front-end code
|  |--App.vue
|  |--main.ts
|--index.html
```

- 零配置，默认 dist 输出目录

```
|--dist
|  |--extension
|  |  |--index.js
|  |  |--index.js.map
|  |--webview
|  |  |--index.html
```

- 如果你想修改 `extension` 源码目录为 `src`，可以设置 `{ extension: { entry: 'src/index.ts' } }`

```
|--src            // extension code
|  |--index.ts
|--webview        // front-end code
|  |--App.vue
|  |--main.ts
|--index.html
```

### extension

`tsconfig.json`

```json
{
  "compilerOptions": {
    "types": [
      "@tomjs/hbuilderx/types",
      "@tomjs/vite-plugin-hbuilderx/types"
    ]
  }
}
```

代码片段，更多配置看示例

```ts
import { ExtensionContext, WebviewPanel } from 'hbuilderx';
import { getWebviewHtml } from 'virtual:hbuilderx';

function createWebView(webviewPanel: WebViewPanel, context: ExtensionContext) {
// vite 开发模式和生产模式注入不同的webview代码，减少开发工作
  webviewPanel.webview.html = getWebviewHtml({
  // vite 开发模式 iframe 嵌入页面
    serverUrl: process.env.VITE_DEV_SERVER_URL,
    // vite 生产模式 将html代码注入到插件中
    // 来自插件激活时的上下文
    context,
    inputName: 'index',
    // 向 head 元素的结束前注入代码 <head>--inject--
    injectCode: `<script>window.__FLAG1__=666;window.__FLAG2__=888;</script>`,
  });
}

const panel = window.createWebView('showHelloWorld', {
  enableScripts: true,
});

createWebView(panel, context);
```

- `package.json`

```json
{
  "main": "dist/extension/index.js"
}
```

### vue

- `vite.config.ts`

```ts
import hbuilderx from '@tomjs/vite-plugin-hbuilderx';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    hbuilderx(),
    // 修改插件源码入口路径，同时修改`index.html`入口文件路径
    // hbuilderx({ extension: { entry: 'src/index.ts' } }),
  ],
  build: {
    // 将图片等静态资源文件转换为 base64
    assetsInlineLimit: 1024 * 100,
  },
});
```

### react

- `vite.config.ts`

```ts
import hbuilderx from '@tomjs/vite-plugin-hbuilderx';
import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), hbuilderx()],
});
```

### 多页面

#### 多页面应用

可查看 [ext-web-vue-multiple](./examples/ext-web-vue-multiple) 示例

- `vite.config.ts`

```ts
import path from 'node:path';
import hbuilderx from '@tomjs/vite-plugin-hbuilderx';

export default defineConfig({
  plugins: [hbuilderx()],
  build: {
    rollupOptions: {
      // https://cn.vitejs.dev/guide/build.html#multi-page-app
      input: [path.resolve(__dirname, 'index.html'), path.resolve(__dirname, 'index2.html')],
      // 也可自定义名称
      // input:{
      //   'index': path.resolve(__dirname, 'index.html'),
      //   'index2': path.resolve(__dirname, 'index2.html'),
      // }
    },
  },
});
```

- 页面一

```ts
import { ExtensionContext, WebviewPanel } from 'hbuilderx';
import { getWebviewHtml } from 'virtual:hbuilderx';

function createWebView(webviewPanel: WebViewPanel, context: ExtensionContext) {
  webviewPanel.webview.html = getWebviewHtml({
    serverUrl: process.env.VITE_DEV_SERVER_URL,
    context,
  });
}
```

- 页面二

```ts
import { ExtensionContext, WebviewPanel } from 'hbuilderx';
import { getWebviewHtml } from 'virtual:hbuilderx';

function createWebView(webviewPanel: WebViewPanel, context: ExtensionContext) {
  webviewPanel.webview.html = getWebviewHtml({
    serverUrl: process.env.VITE_DEV_SERVER_URL,
    context,
    // 页面input名称
    inputName: 'index2',
  });
}
```

#### 单页面传参

单个页面通过 URL 传参和注入代码实现传参，前端需要做兼容处理

- 插件代码 `extension.ts`

```ts
import { ExtensionContext, WebviewPanel } from 'hbuilderx';
import { getWebviewHtml } from 'virtual:hbuilderx';

function createWebView(webviewPanel: WebViewPanel, context: ExtensionContext) {
  webviewPanel.webview.html = getWebviewHtml({
    injectCode: `<script>window.__id__=666;</script>`,
    serverUrl: `${process.env.VITE_DEV_SERVER_URL}?id=666`,
    context,
  });
}
```

- 页面简易实现，根据实际情况自行实现

```ts
import qs from 'query-string';

export function getParams(key: string) {
  return window[`__${key}__`] || qs.parse(location.search)[key];
}
```

**virtual:hbuilderx** 说明

```ts
interface WebviewHtmlOptions {
  /**
   * `[vite serve]` vite开发服务器的url, 请用 `process.env.VITE_DEV_SERVER_URL`
   */
  serverUrl?: string;
  /**
   * `[vite build]` 插件的 ExtensionContext 实例
   */
  context: ExtensionContext;
  /**
   * `[vite build]` vite build.rollupOptions.input 设置的名称. 默认 `index`.
   */
  inputName?: string;
  /**
   * `[vite build]` 向 head 元素的结束前注入代码 <head>--inject--
   */
  injectCode?: string;
}
```

## 参数

### PluginOptions

| 参数名      | 类型                                                     | 默认值               | 说明                                                                                                                                                                           |
| ----------- | -------------------------------------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| recommended | `boolean`                                                | `true`               | 这个选项是为了提供推荐的默认参数和行为                                                                                                                                         |
| extension   | [ExtensionOptions](#ExtensionOptions)                    |                      | hbuilderx extension 可选配置                                                                                                                                                   |
| webview     | `boolean` \| `string` \| [WebviewOption](#WebviewOption) | `__getWebviewHtml__` | 注入 html 代码                                                                                                                                                                 |
| devtools    | `boolean`                                                | `false`              | 注入 script 代码用于 [react-devtools](https://github.com/facebook/react/tree/main/packages/react-devtools) 或 [vue-devtools](https://devtools.vuejs.org/guide/standalone) 调试 |

#### Notice

`recommended` 选项用于设置默认配置和行为，几乎可以达到零配置使用，默认为 `true` 。如果你要自定义配置，请设置它为`false`。以下默认的前提条件是使用推荐的 [项目结构](#目录结构)。

- 输出目录根据 `vite` 的 `build.outDir` 参数， 将 `extension`、`src` 分别输出到 `dist/extension`、`dist/webview`

- 其他待实现的行为

#### devtools

开发阶段，支持 `react` 和 `vue` 的独立开发工具应用，默认不开启。

- `react`: 注入 `<script src="http://localhost:8097"></script>`，支持 [react-devtools](https://github.com/facebook/react/tree/main/packages/react-devtools)
- `vue`: 注入 `<script src="http://localhost:8098"></script>`，支持 [vue-devtools](https://devtools.vuejs.org/guide/standalone)

### ExtensionOptions

继承自 [tsdown](https://tsdown.dev/zh-CN/) 的 [Options](https://tsdown.dev/zh-CN/reference/api/Interface.Options)，添加了一些默认值，方便使用。

| 参数名     | 类型                 | 默认值                | 说明                     |
| ---------- | -------------------- | --------------------- | ------------------------ |
| entry      | `string`             | `extension/index.ts`  | 入口文件                 |
| outDir     | `string`             | `dist-extension/main` | 输出文件夹               |
| watchFiles | `string`\/`string[]` | ``                    | 开发时监听插件代码的文件 |

### WebviewOption

| 参数名     | 类型     | 默认值                     | 说明   |
| ---------- | -------- | -------------------------- | ------ |
| refreshKey | `string` | 开发模式时刷新页面的快捷键 | `"F6"` |

### 补充说明

- `extension` 未配置相关参数时的默认值，目前 `HBuilderX 插件` 不支持 `sourcemap`

| 参数      | 开发模式默认值 | 生产模式默认值 |
| --------- | -------------- | -------------- |
| sourcemap | `true`         | `false`        |
| minify    | `false`        | `true`         |

## 环境变量

`hbuilderx extension` 使用

- `development` 模式

| 变量                  | 描述                |
| --------------------- | ------------------- |
| `VITE_DEV_SERVER_URL` | vite开发服务器的url |

- `production` 模式

| 变量                | 描述                      |
| ------------------- | ------------------------- |
| `VITE_WEBVIEW_DIST` | vite webview 页面输出路径 |

## Debug

查看官网的[如何调试插件？](https://hx.dcloud.net.cn/ExtensionTutorial/HowToDebug)

### 网页调试

- 可以使用 [react-devtools](https://github.com/facebook/react/tree/main/packages/react-devtools) 和 [vue-devtools](https://devtools.vuejs.org/guide/standalone) 的独立应用调试 `webview`
- `vue` 项目可以使用 [vite-plugin-vue-devtools](https://devtools.vuejs.org/guide/vite-plugin) 这个 `vite` 插件直接在页面调试
- 可以使用 `Google Chrome`，在地址栏输入 `chrome://inspect/#devices` 访问。如果 `Remote Target` 不显示，打开 `HBuilderX` 调试插件的控制台，查看会看到 `DevTools listening on ws://127.0.0.1:9500/devtools/browser/e964a967-04da-48f2-8656-9ba933f39e59`, 配置 `Discover network targets` 对应的 `localhost:9500` 即可。

## 示例

先执行以下命令安装依赖，并生成库文件：

```bash
pnpm install
pnpm build
```

打开 [examples](./examples) 目录，有 `vue` 和 `react` 示例。

- [ext-web-react](./examples/ext-web-react/README.md): 使用 [vite](https://cn.vite.dev/) + [typescript](https://www.typescriptlang.org/zh/) + [react](https://react.docschina.org/) 创建 `webview` 插件
- [ext-web-vue](./examples/ext-web-vue/README.md): 使用 [vite](https://cn.vite.dev/) + [typescript](https://www.typescriptlang.org/zh/) + [vue](https://cn.vuejs.org/) 创建 `webview` 插件

## 关联

- [@tomjs/hbuilderx](https://npmjs.com/package/@tomjs/hbuilderx): 为 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 的 [插件](https://hx.dcloud.net.cn/ExtensionTutorial/README) 开发提供所需的 `types`、`API`，方便结合 [typescript](https://www.typescriptlang.org/zh/)、[tsdown](https://tsdown.dev/zh-CN/)、[vite](https://cn.vitejs.dev/) 等现代化工具使用。
- [@tomjs/hbuilderx-cli](https://npmjs.com/package/@tomjs/hbuilderx-cli): 为 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 开发 [插件](https://hx.dcloud.net.cn/ExtensionTutorial/README) 提供便利的 `cli` 工具，根据 `package.json` 中的 `contributes` 配置，为 `hbuilderx` 的 `命令`、`视图` 等 `API` 提供 `id` 提示。
