import * as React from 'react';
import JSZip from '../node_modules/jszip/dist/jszip.min';
import { renderHeader, renderMain } from './utils/renderUi';
import { startMark, sizeMark, endMark } from './utils/nameData';

import ErrorMessage from './components/ErrorMessage';
import Loading from './components/Loading';
import Settings from './components/Settings';
import Success from './components/Success';

import './style/index.css';

/**
 * Convert a simple object to an array of ErrorEntries, this is done so
 * multiple error types can be displayed with the same React component
 *
 * @param content - string or array
 */
const correctErrorArray = (content): ErrorEntry[] => {
  const { message, name } = content;
  let array = [];

  if (Array.isArray(content)) {
    array = content;
  } else {
    array = [{ name, message, id: 'single' }];
  }

  return array;
};


// Render initial UI
renderHeader(true, false);
renderMain(<Loading />);


onmessage = (event): Promise<Blob> => {
  const message = event.data.pluginMessage;

  if (!message) { return; }

  if (message.name === 'headerAction') {
    if (message.content === 'Run again') {
      renderHeader(true, false);
      renderMain(<Loading />);
    } else if (message.content === 'Settings') {
      renderHeader(false, true);
      renderMain(<Settings startMark={startMark} sizeMark={sizeMark} endMark={endMark} />);
    }
  }

  if (message.name === 'contentError') {
    renderHeader(false, false);
    renderMain(<ErrorMessage entries={correctErrorArray(message.content)} />);
  }

  if (message.name === 'exportableAssets') {
    // eslint-disable-next-line consistent-return
    return new Promise(() => {
      const zip = new JSZip();

      message.content.forEach(({ name, svg }) => {
        zip.file(`${name}.svg`, svg);
      });

      zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
        const blobURL = window.URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = blobURL;
        link.download = 'icons.zip';
        link.click();
      }).then(() => {
        setTimeout(() => {
          renderHeader(false, false);
          renderMain(<Success length={message.content.length} />);
        }, 2000);
      });
    });
  }
};
