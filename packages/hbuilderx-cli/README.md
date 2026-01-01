# @tomjs/hbuilderx-cli

[![npm](https://img.shields.io/npm/v/@tomjs/hbuilderx-cli)](https://www.npmjs.com/package/@tomjs/hbuilderx-cli) ![node-current (scoped)](https://img.shields.io/node/v/@tomjs/hbuilderx-cli) ![license](https://img.shields.io/npm/l/@tomjs/hbuilderx-cli) [![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@tomjs/hbuilderx-cli)

> 为 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 开发 [插件](https://hx.dcloud.net.cn/ExtensionTutorial/README) 提供便利的 `cli` 工具，根据 `package.json` 中的 `contributes` 配置，为 `hbuilderx` `命令`、`视图` 等的 `API` 提供 `id` 提示。

## Install

```bash
# pnpm
pnpm add -D @tomjs/hbuilderx-cli

# yarn
yarn add -D @tomjs/hbuilderx-cli

# npm
npm add -D @tomjs/hbuilderx-cli
```

## 使用

安装后可以使用 `hx-cli` 命令行运行本 `CLI` 工具。

```bash
生成 d.ts 文件和打包插件

Usage
  $ hx-cli [options] <dir>

  dir                   指定扩展目录，默认 "extension”

Options
  --watch, -w           监听 package.json，生产 d.ts 文件
  --pack, -p            生成插件打包文件
  --config              指定配置文件，如 "hx-cli.config.mjs"
  --verbose             显示更多信息
  --help, -h            显示帮助信息
  --version, -v         显示版本信息

Examples
  $ hx-cli --watch
  $ hx-cli --pack
```

### scripts

`package.json` 的 `scripts` 中添加以下命令

```bash
# 开发模式，根据 package.json 中 contributes 配置，为 hbuilderx 增加命令、视图等 id 的提示
hx-cli --watch
# 打包模式，将当前项目打包成插件压缩包
hx-cli --pack
```

### 插件使用

在 `tsconfig.json` 中，将 `cli` 生成的 `hbuilderx.d.ts` 添加到 `include` 配置项,

`tsconfig.json`

```json
{
  "compilerOptions": {
    "types": ["@tomjs/hbuilderx/types"]
  },
  // 添加项目根目录的 hbuilderx.d.ts
  "include": ["hbuilderx.d.ts", "src/**/*.ts", "src/**/*.d.ts"]
}
```

示例

```ts
import type { ExtensionContext } from 'hbuilderx';
import { isAlphaVersion, setContext } from '@tomjs/hbuilderx';
import { commands, window } from 'hbuilderx';

export function activate(context: ExtensionContext) {
  setContext(context);

  context.subscriptions.push(
    // 此处会有命令id提示
    commands.registerCommand('tomjs.xxx.showHello', async () => {
      window.showInformationMessage(`Hello World！这是 ${isAlphaVersion ? '测试' : '正式'}版本的 HBuilderX。`, ['确定1', '取消2']).then((result) => {
        window.showInformationMessage(`你点击了${result}`);
      });
    }),
  );
}

export function deactivate() { }
```

## 示例

打开 [examples](./examples) 目录，查看 `cli` 使用示例。

- [ext-web](./examples/ext-web/README.md): 使用 [tsdown](https://tsdown.dev/zh-CN/) + [typescript](https://www.typescriptlang.org/zh/) 开发 `webview` 插件
- [ext-web-vue](./examples/ext-web-vue/README.md): 使用 [vite](https://cn.vite.dev/) + [typescript](https://www.typescriptlang.org/zh/) + [vue](https://cn.vuejs.org/) 创建 `webview` 插件
