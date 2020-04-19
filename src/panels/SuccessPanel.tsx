import * as React from 'react';

type Props = {
  length: number;
};

const SuccessPanel = ({ length }: Props): JSX.Element => {
  const sendMessage = (content): void => {
    parent.postMessage({ pluginMessage: content }, '*');
  };

  const button = (text: string, type: string, message): JSX.Element => (
    <button
      type="button"
      className={`button button--${type}`}
      onClick={(): void => sendMessage(message)}
    >
      {text}
    </button>
  );

  return (
    <div className="success panel">
      <span className="type type--pos-small-normal">{`Successfully exported ${length} icons`}</span>
      <div className="success-buttons">
        {button('Download again', 'primary', { downloadAgain: true })}
        {button('Close plugin', 'secondary', { closePlugin: true })}
      </div>
    </div>
  );
};

export default SuccessPanel;
