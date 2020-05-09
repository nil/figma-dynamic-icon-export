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

  const createExport = (): void => {
    const exportNodes: ExportNodes = {
      nodes: selectedNodes.filter((node: SelectedNode) => node.status).map((node) => node.id),
      size: sizeValue
    };

    parent.postMessage({ pluginMessage: { exportNodes } }, '*');
  };

  if (footerVisible) {
    return (
      <footer className="footer">
        <div className="footer-size type type--pos-small-normal">
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
        <div
          className="footer-button button button--primary"
          role="button"
          tabIndex={0}
          onClick={(): void => { createExport(); }}
        >
          Export icons
        </div>
      </footer>
    );
  }

  return null;
};

export default Footer;
