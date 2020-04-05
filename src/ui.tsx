import * as React from 'react';
import * as ReactDOM from 'react-dom';
import ErrorMessage from './components/ErrorMessage';

import './style/figma.css';
import './style/plugin.css';

const renderElement = document.getElementById('react-page');

onmessage = (event) => {
  const message = event.data.pluginMessage;

  if (message.name === 'contentError') {
    ReactDOM.render(<ErrorMessage entries={message.content} />, renderElement);
    // console.log(renderElement.offsetHeight);
    parent.postMessage({ pluginMessage: { uiHeight: renderElement.offsetHeight } }, '*')
  }

  onmessage = null
}
