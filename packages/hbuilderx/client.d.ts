// Make this a module
export { };
declare global {
  interface HBuilderXWebview {
    /**
     * 接收 HBuilderX 扩展发送到 webview 的消息
     * @param callback 响应收到消息的回调
     */
    onDidReceiveMessage: (callback: (message: any) => void) => void;
    /**
     * webview 发送消息给 HBuilderX 扩展
     * @param message 消息内容
     */
    postMessage: (message: any) => void;
    /**
     * webview 触发 `onDidReceiveMessage` 方法回调
     * @param message 响应的消息内容
     */
    dispatchMessage: (message: any) => void;
  }

  /**
   * HBuilderX Webview API
   */
  declare const hbuilderx: HBuilderXWebview;

  interface Window {
    /**
     * HBuilderX Webview API
     */
    hbuilderx: HBuilderXWebview;
  }
}
