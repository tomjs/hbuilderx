import type { WebViewDialog, WebViewPanel } from 'hbuilderx';
import { Uri, window, workspace } from 'hbuilderx';
import vueHtml from './vue.html';

/**
 * @description 显示webview
 */
function showWebView(webviewPanel: WebViewPanel | WebViewDialog) {
  const webview = webviewPanel.webView;

  let background = '';

  const config = workspace.getConfiguration();
  const colorScheme = config.get('editor.colorScheme');
  console.log('colorScheme', colorScheme);
  console.log('webview:', webview);
  console.log('webview.asWebviewUri:', webview.asWebviewUri);
  console.log('Uri:', Uri);

  if (colorScheme === 'Monokai') {
    background = '#272822';
  }
  else if (colorScheme === 'Atom One Dark') {
    background = '#282c34';
  }
  else {
    background = '#fffae8';
  };

  const defaultBg = '#fffae8';
  if (defaultBg !== background) {
    webview.html = vueHtml.replace(defaultBg, background);
  }
  else {
    webview.html = vueHtml;
  }

  // 插件发送消息(可以被JSON化的数据)到webview
  // webview.postMessage({
  //   command: 'test',
  // });

  // 插件接收webview发送的消息(可以被JSON化的数据)
  webview.onDidReceiveMessage((msg) => {
    if (msg.command === 'alert') {
      window.showInformationMessage(msg.text);
    }
  });
};

let leftWebviewPanel: WebViewPanel;
export function createLeftWebview() {
  if (!leftWebviewPanel) {
    leftWebviewPanel = window.createWebView('tomjs.webview.left', {
      enableScripts: true,
    });
  }

  showWebView(leftWebviewPanel);

  window.showView({
    viewId: 'tomjs.webview.left',
    containerId: 'tomjsActivitybar',
  });
};

let rightWebviewPanel: WebViewPanel;
export function createRightWebview() {
  if (!rightWebviewPanel) {
    rightWebviewPanel = window.createWebView('tomjs.webview.right', {
      enableScripts: true,
    });
  }

  showWebView(rightWebviewPanel);

  window.showView({
    viewId: 'tomjs.webview.right',
    containerId: 'tomjsRightSide',
  });
};

let dialogWebviewPanel: WebViewDialog;
export function createDialogWebview() {
  if (!dialogWebviewPanel) {
    dialogWebviewPanel = window.createWebViewDialog({
      title: 'Dialog Webview',
    }, {
      enableScripts: true,
    });
  }

  showWebView(dialogWebviewPanel);

  dialogWebviewPanel.show();
};
