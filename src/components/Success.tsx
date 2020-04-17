import * as React from 'react';

type Props = {
  length: number;
};

class Success extends React.Component<Props, {}> {
  sendMessage = (content): void => {
    parent.postMessage({ pluginMessage: content }, '*');
  };

  button = (text: string, type: string, message): JSX.Element => (
    <button
      type="button"
      className={`button button--${type}`}
      onClick={(): void => this.sendMessage(message)}
    >
      {text}
    </button>
  );

  render(): JSX.Element {
    const { length } = this.props;

    return (
      <div className="success panel">
        <span className="type type--pos-small-normal">{`Successfully exported ${length} icons`}</span>
        <div className="success-buttons">
          {this.button('Download again', 'primary', { downloadAgain: true })}
          {this.button('Close plugin', 'secondary', { closePlugin: true })}
        </div>
      </div>
    );
  }
}

export default Success;
