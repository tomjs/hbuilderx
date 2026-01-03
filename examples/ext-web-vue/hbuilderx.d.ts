// 通过 @tomjs/hbuilderx-cli 生成的 d.ts 文件
declare module 'hbuilderx' {
  /**
   * 命令管理
   */
  export const commands: CommandManager;
  /**
   * 内置命令
   */
  export type BuiltinCommand = undefined;
  /**
   * package.json 自定义命令
   */
  export type UserCommand = 'tomjs.ext.showLeftWebview' | 'tomjs.ext.showRightWebview' | 'tomjs.ext.showWebviewDialog';

  export interface CommandManager {
    /**
     * 注册一个指定id的命令，并关联一个自定义的函数
     */
    registerCommand: (id: UserCommand, handler: (result: any) => void) => Disposable;
    /**
     * 注册一个指定id的编辑器命令
     */
    registerTextEditorCommand: (id: UserCommand, handler: (result: TextEditor) => void) => Disposable;
    /**
     * 执行指定id的命令。除了插件扩展的命令外，还可以执行HBuilderX内置的命令，完整的内置命令列表可以通过HBuilderX的顶部菜单工具-自定义快捷键，然后在打开的配置文件左侧部门找到所有列出的command字段.
     */
    executeCommand: (id: BuiltinCommand | UserCommand) => void;
  }

  const containerToViews: {
    readonly tomjsActivitybar: readonly ['tomjs.webview.left'];
    readonly tomjsRightSide: readonly ['tomjs.webview.right'];
  };

  export type ContainerId = keyof typeof containerToViews;
  export type ViewId<C extends ContainerId = ContainerId> = typeof containerToViews[C][number];

  export interface ShowWebviewInfo<C extends ContainerId = ContainerId> {
    containerId: C;
    viewId: ViewId<C>;
  };

  /**
   * 视图id
   */
  export type UserViewId = 'tomjs.webview.left' | 'tomjs.webview.right';
  export interface WorkbenchWindow {
    /**
     * 创建指定viewId的视图，将会以tab的形式在左侧显示。viewId是在配置扩展点views中声明的id
     */
    createTreeView: (viewId: UserViewId, options: TreeViewOptions) => void;
    /**
     * 创建指定viewId的视图，将会以tab的形式在右侧显示。viewId是在配置扩展点views中声明的id。
     */
    createWebView: (viewId: UserViewId, options: WebViewOptions) => WebViewPanel;
    /**
     * 切换指定viewId的WebView控件视图。插件创建多个WebView视图并打开后，通过该接口切换视图区域中指定的tab页。该接口不适用于创建。
     */
    showView: <C extends ContainerId>(viewInfo: ShowWebviewInfo<C>) => void;
  }
}
