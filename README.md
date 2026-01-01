# @tomjs/hbuilderx

> 为 [HBuilderX](https://www.dcloud.io/hbuilderx.html) 的 [插件](https://hx.dcloud.net.cn/ExtensionTutorial/README) 开发提供所需的 `hbuilderx` 库和封装的`API`，方便结合 [typescript](https://www.typescriptlang.org/zh/)、[tsdown](https://tsdown.dev/zh-CN/)、[vite](https://cn.vitejs.dev/) 等现代化工具使用。

## 包

| 包名                                                      | 说明                                        | 版本                                                                                                                            | node                                                                                 |
| --------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| [@tomjs/hbuilderx](./packages/hbuilderx/README.md)        | 为插件提供 `hbuilderx` 的 `types`和封装方法 | [![npm](https://img.shields.io/npm/v/@tomjs/hbuilderx)](https://www.npmjs.com/package/@tomjs/hbuilderx)                         | ![node-current (scoped)](https://img.shields.io/node/v/@tomjs/hbuilderx)             |
| [@tomjs/vite-plugin-hbuilderx](./packages/vite/README.md) | 支持使用 `vue`/`react` 开发 `webview`       | [![npm](https://img.shields.io/npm/v/@tomjs/vite-plugin-hbuilderx)](https://www.npmjs.com/package/@tomjs/vite-plugin-hbuilderx) | ![node-current (scoped)](https://img.shields.io/node/v/@tomjs/vite-plugin-hbuilderx) |

## 示例

- [ext-simple](./examples/ext-simple/README.md): 使用 [tsdown](https://tsdown.dev/zh-CN/) + [typescript](https://www.typescriptlang.org/zh/) 开发插件
- [ext-web](./examples/ext-web/README.md): 使用 [tsdown](https://tsdown.dev/zh-CN/) + [typescript](https://www.typescriptlang.org/zh/) 开发 `webview` 插件
- [ext-web-react](./examples/ext-web-react/README.md): 使用 [vite](https://cn.vite.dev/) + [typescript](https://www.typescriptlang.org/zh/) + [react](https://react.docschina.org/) 创建 `webview` 插件
- [ext-web-vue](./examples/ext-web-vue/README.md): 使用 [vite](https://cn.vite.dev/) + [typescript](https://www.typescriptlang.org/zh/) + [vue](https://cn.vuejs.org/) 创建 `webview` 插件
- [ext-web-vue-multiple](./examples/ext-web-vue-multiple/README.md): 使用 [vite](https://cn.vite.dev/) + [typescript](https://www.typescriptlang.org/zh/) + [vue](https://cn.vuejs.org/) 创建 `webview` 插件，多页面示例
