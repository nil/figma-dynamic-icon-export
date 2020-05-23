/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import useAppState from '../utils/appState';
import FooterButton from '../components/FooterButton';
import SelectionPanel from './SelectionPanel';


const Footer = (): JSX.Element => {
  const {
    selectedNodes,
    errorNodes,
    setErrorNodes,
    sizeValue,
    setSizeValue,
    setUserHasUpdatedSize,
    footerVisible,
    setActivePanel
  } = useAppState();

  const exportNodeList = selectedNodes.filter((node: SelectedNode) => node.status);

  const createExport = (): void => {
    const exportNodes: ExportNodes = {
      nodes: exportNodeList.map((node) => node.id),
      size: sizeValue
    };

    parent.postMessage({ pluginMessage: { exportNodes } }, '*');
    setErrorNodes([]);
  };

  const tryAgain = (): void => {
    setErrorNodes([]);
    setActivePanel(<SelectionPanel />);

    parent.postMessage({ pluginMessage: { getSelection: true } }, '*');
  };

  const updateSizeValue = (event): void => {
    setSizeValue(event.target.value);
    setUserHasUpdatedSize(true);
  };

  const actionButton = (): JSX.Element => {
    if (errorNodes.length > 0) {
      return <FooterButton text="Try again" onClick={tryAgain} disabled={exportNodeList.length === 0} />;
    }

    return <FooterButton text="Export icons" onClick={createExport} />;
  };

  if (footerVisible) {
    return (
      <footer className="footer">
        {errorNodes.length === 0 ? (
          <div className="footer-size">
            <label className="footer-size-label" htmlFor="input-size">Size</label>
            <input
              id="input-size"
              type="text"
              className="footer-size-input"
              placeholder="Choose a size"
              value={sizeValue}
              onChange={updateSizeValue}
            />
          </div>
        ) : null}
        {actionButton()}
      </footer>
    );
  }

  return null;
};

export default Footer;
