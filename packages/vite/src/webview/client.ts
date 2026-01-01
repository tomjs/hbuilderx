if (window.top === window.self) {
  throw new Error('[hbuilderx:client]: must run in hbuilderx webview');
}

const POST_MESSAGE_TYPE = '[hbuilderx:client]:postMessage';
console.log('[@tomjs:hbuilderx:client]: init');

const msgListeners: any[] = [];
window.hbuilderx = window.hbuilderx || (function () {
  // 第一次执行webviewinterface.js,生成hbuilderx对象
  function postMessage(data: any) {
    window.parent.postMessage({ type: POST_MESSAGE_TYPE, data }, '*');
  }
  function dispatchMessage(message: any) {
    for (let i = 0; i < msgListeners.length; i++) {
      const listener = msgListeners[i];
      if (typeof listener === 'function') {
        listener(message);
      }
    }
  }
  function onDidReceiveMessage(callback) {
    msgListeners.push(callback);
  }

  return {
    postMessage,
    dispatchMessage,
    onDidReceiveMessage,
  };
}());

window.addEventListener('message', (e) => {
  for (let i = 0; i < msgListeners.length; i++) {
    const listener = msgListeners[i];
    if (typeof listener === 'function') {
      listener(e.data);
    }
  }
});

document.addEventListener('keydown', (e) => {
  // @ts-ignore
  if (e.key === (window.TOMJS_REFRESH_KEY || 'F6')) {
    window.location.reload();
  }
});
