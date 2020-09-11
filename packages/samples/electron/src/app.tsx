import * as React from 'react';
import reactDom from 'react-dom';

console.log('ello');

(() => {
  reactDom.render(<div>Hello World</div>, document.getElementById('root'));
})();

