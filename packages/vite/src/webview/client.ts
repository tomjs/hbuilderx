// @ts-ignore
if (window.TOMJS_STRICT && window.top === window.self) {
  throw new Error('[hbuilderx:client]: must run in hbuilderx webview');
}

const POST_MESSAGE_TYPE = '[hbuilderx:client]:postMessage';
console.log('[@tomjs:hbuilderx:client]: init');

type MessageListener = (message: any) => void;

const msgListeners: MessageListener[] = [];

window.hbuilderx = window.hbuilderx || (function () {
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
