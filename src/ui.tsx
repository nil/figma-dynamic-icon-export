/* eslint-disable no-restricted-globals */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import * as React from 'react';

import JSZip from '../node_modules/jszip/dist/jszip.min';
import ErrorMessage from './components/ErrorMessage';

import Loading from './components/Loading';
import {
  renderHeader, renderMain
} from './utils/renderUi';


import './style/index.css';


// Render initial UI
renderHeader(true);
renderMain(<Loading />);


// function renderUI(component): void {
//   ReactDOM.render(
//     <main className="plugin-ui">
//       <Header />
//       {component}
//     </main>, document.getElementById('plugin-ui')
//   );
// }

onmessage = (event) => {
  const message = event.data.pluginMessage;

  if (!message) { return; }

  if (message.name === 'runAgain') {
    renderHeader(true);
    renderMain(<Loading />);
  }

  if (message.name === 'contentError') {
    let errorArray = [];

    if (Array.isArray(message.content)) {
      errorArray = message.content;
    } else {
      errorArray = [{ name: message.content.name, message: message.content.message, id: 'single' }];
    }
    renderHeader(false);
    renderMain(<ErrorMessage entries={errorArray} />);
  }

  // if (message.name === 'exportableAssets') {
  //   return new Promise((resolve) => {
  //     const zip = new JSZip();

  //     message.content.forEach((asset) => {
  //       zip.file(`${asset.name}.svg`, asset.svgCode);
  //     });

  //     zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
  //       const blobURL = window.URL.createObjectURL(content);
  //       const link = document.createElement('a');
  //       link.className = 'button button--primary';
  //       link.href = blobURL;
  //       link.download = 'icons.zip';
  //       link.click();
  //       // eslint-disable-next-line no-restricted-globals
  //       link.setAttribute('download', `${name}.zip`);
  //       resolve();
  //     });
  //   }).then(() => {
  //     window.parent.postMessage({ pluginMessage: 'done' }, '*');
  //   });
  // }
};
