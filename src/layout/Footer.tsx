/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import useAppState from '../utils/appState';


const Footer = (): JSX.Element => {
  const {
    selectedNodes,
    sizeValue,
    setSizeValue,
    footerVisible
  } = useAppState();

  const exportNodeList = selectedNodes.filter((node: SelectedNode) => node.status);

  const createExport = (): void => {
    const exportNodes: ExportNodes = {
      nodes: exportNodeList.map((node) => node.id),
      size: sizeValue
    };

    parent.postMessage({ pluginMessage: { exportNodes } }, '*');
  };

  if (footerVisible) {
    return (
      <footer className="footer">
        <div className="footer-size">
          <label className="footer-size-label" htmlFor="input-size">Size</label>
          <input
            id="input-size"
            type="text"
            className="footer-size-input"
            placeholder="Choose a size"
            value={sizeValue}
            onChange={(): void => { setSizeValue(event.target.value); }}
          />
        </div>
        <button
          type="button"
          disabled={exportNodeList.length === 0}
          className="footer-button button button--primary"
          onClick={(): void => { createExport(); }}
        >
          Export icons
        </button>
      </footer>
    );
  }

  return null;
};

export default Footer;
