import * as React from 'react';
import Button from '../components/Button';

type Props = {
  length: number;
};

const SuccessPanel = ({ length }: Props): JSX.Element => {
  const sendMessage = (content): void => {
    parent.postMessage({ pluginMessage: { [content]: true } }, '*');
  };

  return (
    <div className="success panel">
      <span className="type type--pos-small-normal">{`Successfully exported ${length} icons`}</span>
      <div className="success-buttons">
        <Button text="Download again" type="primary" onClick={(): void => { sendMessage('downloadAgain'); }} />
        <Button text="Close plugin" type="secondary" onClick={(): void => { sendMessage('closePlugin'); }} />
      </div>
    </div>
  );
};

export default SuccessPanel;
