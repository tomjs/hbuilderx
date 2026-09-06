import { App as AntdApp, Button, Flex, Space } from 'antd';
import { useEffect, useState } from 'react';
import reactLogo from '@/assets/react.svg';
import viteLogo from '@/assets/vite.svg';
import './App.css';

let registered = false;

function AppContent() {
  const { modal } = AntdApp.useApp();
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (registered)
      return;
    registered = true;
    hbuilderx.onDidReceiveMessage((msg) => {
      if (msg.command === 'ping-back') {
        modal.info({
          title: '后端消息',
          content: msg.text,
        });
      }
    });
  }, [modal]);

  function onPostMessage() {
    hbuilderx.postMessage({
      command: 'alert',
      text: `HelloWorld-${Date.now()}`,
    });
  }

  function onSendToBackend() {
    hbuilderx.postMessage({
      command: 'ping',
      text: `HelloWorld-${Date.now()}`,
    });
  }

  return (
    <>
      <Flex justify="center">
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </Flex>
      <h1>Vite + React</h1>
      <div className="card">
        <Space>
          <Button onClick={() => setCount(count => count + 1)}>
            count is
            {' '}
            {count}
          </Button>
          <Button onClick={onPostMessage}>
            发送消息
          </Button>
          <Button type="primary" onClick={onSendToBackend}>
            发送给后端
          </Button>
        </Space>
      </div>
    </>
  );
}

function App() {
  return (
    <AntdApp>
      <AppContent />
    </AntdApp>
  );
}

export default App;
