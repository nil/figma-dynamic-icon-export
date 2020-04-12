/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import JSZip from '../node_modules/jszip/dist/jszip.min';
import ErrorMessage from './components/ErrorMessage';
import NoContent from './components/NoContent';

import './style/main.css';

const renderElement = document.getElementById('react-page');

onmessage = (event) => {
  const message = event.data.pluginMessage;

  if (!message) { return; }

  if (message.name === 'contentError') {
    ReactDOM.render(<ErrorMessage entries={message.content} />, renderElement);
    parent.postMessage({ pluginMessage: { uiHeight: renderElement.offsetHeight } }, '*');
  }

  if (message.name === 'noContent') {
    ReactDOM.render(<NoContent message={message.content} />, renderElement);
    parent.postMessage({ pluginMessage: { uiHeight: renderElement.offsetHeight } }, '*');
  }

  if (message.name === 'exportableAssets') {
    return new Promise((resolve) => {
      const zip = new JSZip();

      message.content.forEach((asset) => {
        zip.file(`${asset.name}.svg`, asset.svgCode);
      });

      zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
        const blobURL = window.URL.createObjectURL(content);
        const link = document.createElement('a');
        link.className = 'button button--primary';
        link.href = blobURL;
        link.download = 'icons.zip';
        link.click();
        // eslint-disable-next-line no-restricted-globals
        link.setAttribute('download', `${name}.zip`);
        resolve();
      });
    }).then(() => {
      window.parent.postMessage({ pluginMessage: 'done' }, '*');
    });
  }

  onmessage = null;
};
