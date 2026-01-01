import type { WebViewDialog, WebViewPanel } from 'hbuilderx';
import { getContext } from '@tomjs/hbuilderx';
import { window } from 'hbuilderx';
import { getWebviewHtml } from 'virtual:hbuilderx';

/**
 * @description 显示webview page1
 */
function showWebView(webviewPanel: WebViewPanel | WebViewDialog) {
  const webview = webviewPanel.webView;

  webview.html = getWebviewHtml({
    serverUrl: process.env.VITE_DEV_SERVER_URL,
    context: getContext(),
  });

  // 插件接收webview发送的消息(可以被JSON化的数据)
  webview.onDidReceiveMessage((msg) => {
    console.log('extension msg:', msg);
    if (msg.command === 'alert') {
      window.showInformationMessage(msg.text);
    }
  });
};
/**
 * @description 显示webview page2
 */
function showWebView2(webviewPanel: WebViewPanel | WebViewDialog) {
  const webview = webviewPanel.webView;

  webview.html = getWebviewHtml({
    serverUrl: `${process.env.VITE_DEV_SERVER_URL}/index2.html`,
    context: getContext(),
    inputName: 'index2',
  });

  // 插件接收webview发送的消息(可以被JSON化的数据)
  webview.onDidReceiveMessage((msg) => {
    console.log('extension msg:', msg);
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
    containerId: 'tomjsActivitybar',
    viewId: 'tomjs.webview.left',
  });
};

let rightWebviewPanel: WebViewPanel;
export function createRightWebview() {
  if (!rightWebviewPanel) {
    rightWebviewPanel = window.createWebView('tomjs.webview.right', {
      enableScripts: true,
    });
  }

  showWebView2(rightWebviewPanel);

  window.showView({
    containerId: 'tomjsRightSide',
    viewId: 'tomjs.webview.right',
  });
};

export function createDialogWebview() {
  const dialogWebviewPanel = window.createWebViewDialog({
    title: 'Dialog Webview',
  }, {
    enableScripts: true,
  });

  showWebView(dialogWebviewPanel);

  dialogWebviewPanel.show();
};
