import React from 'react';
import reactDom from 'react-dom';
import { OpenFinRouter } from './router';

export const App = () => {
  const [mode, setMode] = React.useState<'notifications' | 'chats'>('chats');

  return <OpenFinRouter />;
};

(() => {
  reactDom.render(<App />, document.getElementById('root')!);
})();
