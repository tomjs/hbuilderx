# @tomjs/hbuilderx

[![npm](https://img.shields.io/npm/v/@tomjs/hbuilderx)](https://www.npmjs.com/package/@tomjs/hbuilderx) ![node-current (scoped)](https://img.shields.io/node/v/@tomjs/hbuilderx) ![license](https://img.shields.io/npm/l/@tomjs/hbuilderx) [![jsDocs.io](https://img.shields.io/badge/jsDocs.io-reference-blue)](https://www.jsdocs.io/package/@tomjs/hbuilderx)

> 为 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 的 [插件](https://hx.dcloud.net.cn/ExtensionTutorial/README) 开发提供所需的 `types`、`API`，方便结合 [typescript](https://www.typescriptlang.org/zh/)、[tsdown](https://tsdown.dev/zh-CN/)、[vite](https://cn.vitejs.dev/) 等现代化工具使用。

## 安装

```bash
# pnpm
pnpm add @tomjs/hbuilderx

# yarn
yarn add @tomjs/hbuilderx

# npm
npm add @tomjs/hbuilderx
```

## 使用

### 插件配置

通以下任意方法，可以在 `ts` 支持 `hbuilderx` 库的代码提示，具体也可参考 `examples` 示例

1. 在插件源码文件夹 `src` 中添加 `env.d.ts` 或已存在的其他 `d.ts` 文件中，添加以下内容到文件头部

```ts
/// <reference types="@tomjs/hbuilderx/types" />
```

2. 在 `tsconfig.json` 中，将 `@tomjs/hbuilderx/types`添加 `compilerOptions.types` 配置项

```json
{
  "compilerOptions": {
    "types": ["@tomjs/hbuilderx/types"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts"]
}
```

插件示例代码

```ts
import type { ExtensionContext } from 'hbuilderx';
import { isAlphaVersion, setContext } from '@tomjs/hbuilderx';
import { commands, window } from 'hbuilderx';

export function activate(context: ExtensionContext) {
  setContext(context);

  context.subscriptions.push(
    commands.registerCommand('tomjs.xxx.showHello', async () => {
      window.showInformationMessage(`Hello World！这是 ${isAlphaVersion ? '测试' : '正式'}版本的 HBuilderX。`, ['确定1', '取消2']).then((result) => {
        window.showInformationMessage(`你点击了${result}`);
      });
    }),
  );
}

export function deactivate() { }
```

### webview 配置

在 `vue` 或 `react` 项目中支持 `hbuilderx.postMessage` 等提示，可以选择如下任意方式。

- 在 `d.ts` 文件，添加一下内容

```ts
/// <reference types="@tomjs/hbuilderx/client" />
```

- 在 `tsconfig.json` 文件，并添加以下内容

```json
{
  "compilerOptions": {
    "types": ["@tomjs/hbuilderx/client"]
  },
  "include": ["src/**/*.ts", "src/**/*.d.ts"]
}
```
