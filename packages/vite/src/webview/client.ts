// @ts-ignore
if (window.TOMJS_STRICT && window.top === window.self) {
  throw new Error('[hbuilderx:client]: must run in hbuilderx webview');
}

const POST_MESSAGE_TYPE = '[hbuilderx:client]:postMessage';
console.log('[@tomjs:hbuilderx:client]: init');

type MessageListener = (message: any) => void;

const msgListeners: MessageListener[] = [];

// dev iframe 内始终使用本合成桥：中继外层转发进来的插件消息只会触发这里的 `window 'message'` → `msgListeners`，
// 必须保证 app 注册的回调进入同一 msgListeners。HBuilderX alpha(5.31) 会把原生 window.hbuilderx 一并注入进
// iframe，`window.hbuilderx || synth` 会被短路成原生对象 → app 注册到原生、分发到本数组（空）→ 分裂丢消息。
// 正常 dev（稳定版）iframe 内本无原生注入，合成桥一直是完整契约，无条件覆盖即恢复既有语义；built 不加载本文件。
window.hbuilderx = (function () {
  // 第一次执行webviewinterface.js,生成hbuilderx对象
  function postMessage(data: any) {
    window.parent.postMessage({ type: POST_MESSAGE_TYPE, data }, '*');
  }
  function dispatchMessage(message: any) {
    msgListeners.slice().forEach(listener => listener(message));
  }
  function onDidReceiveMessage(callback: MessageListener) {
    msgListeners.push(callback);
  }

  return {
    postMessage,
    dispatchMessage,
    onDidReceiveMessage,
  };
}());

// 只接收父级（dev 模板）转发来的插件消息
window.addEventListener('message', (e) => {
  if (e.source !== window.parent) {
    return;
  }
  for (const listener of msgListeners) {
    listener(e.data);
  }
});

document.addEventListener('keydown', (e) => {
  // @ts-ignore
  if (e.key === (window.TOMJS_REFRESH_KEY || 'F6')) {
    window.location.reload();
  }
});
