import * as React from 'react';
import * as ReactDOM from 'react-dom';

import JSZip from '../node_modules/jszip/dist/jszip.min.js';
import ErrorMessage from './components/ErrorMessage';

import './style/main.css';

const renderElement = document.getElementById('react-page');

onmessage = (event) => {
  const message = event.data.pluginMessage;

  if (message.name === 'contentError') {
    ReactDOM.render(<ErrorMessage entries={message.content} />, renderElement);
    // console.log(renderElement.offsetHeight);
    parent.postMessage({ pluginMessage: { uiHeight: renderElement.offsetHeight } }, '*')
  }

  if (message.name === 'exportableAssets') {
    return new Promise(resolve => {
      let zip = new JSZip();

      for (let asset of message.content) {
        zip.file(`${asset.name}.svg`, asset.svgCode);
      }

      zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
        const blobURL = window.URL.createObjectURL(content);
        const link = document.createElement('a');
        link.className = 'button button--primary';
        link.href = blobURL;
        link.download = "icons.zip"
        link.click()
        link.setAttribute('download', name + '.zip');
        resolve();
      });
    }).then(() => {
      window.parent.postMessage({ pluginMessage: 'done' }, '*')
    })
  }

  onmessage = null
}
