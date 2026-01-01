# ext-simple

简单命令弹框插件

## 使用

### 前置

需要先编译 `@tomjs/hbuilderx` 的库，如果已编译过则跳过此步骤。

在 `packages/hbuilderx` 目录中，打开 `terminal/终端`，执行如下命令：

```bash
pnpm build
```

### 编译 ts 插件代码

打开本示例目录 `examples/ext-simple` ，执行如下命令编译代码

```bash
# 开发模式，不压缩代码
pnpm dev
# 生产模式，压缩代码
pnpm build
```

## 调试

根据以下步骤调试插件，具体参考官方[插件教程](https://hx.dcloud.net.cn/ExtensionTutorial/firstExtension)

- 将当前示例 `examples/ext-simple` 拖拽到 `HBuilderX` 中
- 点击左上 `运行` 图标，选择点击 `运行插件-[ext-simple]` 或 `调试插件-[ext-simple]`，会打开的 `HBuilderX` 窗口调试插件。
- 在调试导入或创建任意项目，打开任意文件，在文件编辑器中点击鼠标右唤出菜单，选择 `Hello World` 选项, 会在右下角弹出提示框。
