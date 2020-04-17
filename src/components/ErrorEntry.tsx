import * as React from 'react';
import IconError from '../assets/error.svg';

type Props = {
  type?: string;
  message?: string;
  name: string;
  id: string;
};

class ErrorEntry extends React.Component<Props, {}> {
  viewNode = (name: string, type: string): void => {
    if (type === 'duplicated name') {
      parent.postMessage({ pluginMessage: { viewDuplicatedNode: name } }, '*');
    } else {
      parent.postMessage({ pluginMessage: { viewNode: name } }, '*');
    }
  };

  render(): JSX.Element {
    const {
      type,
      message,
      name
    } = this.props;

    const errorNameClass = 'error-name type type--pos-large-bold';

    let errorContext;
    let errorName;

    if (type) {
      errorContext = (
        <>
          <span className="error-notify">Error type: </span>
          <span className="error-type">{type}</span>
        </>
      );

      errorName = (
        <div
          className={errorNameClass}
          onClick={(): void => this.viewNode(name, type)}
          role="link"
          tabIndex={0}
        >
          {name}
        </div>
      );
    } else if (message) {
      errorContext = (
        <>{message}</>
      );

      errorName = (
        <div className={errorNameClass}>
          {name}
        </div>
      );
    }

    return (
      <div className="error-entry">
        <img src={IconError} alt="" aria-hidden="true" className="error-icon" />
        <div className="error-info">
          {errorName}
          <div className="error-context type type--pos-small-normal">
            {errorContext}
          </div>
        </div>
      </div>
    );
  }
}

export default ErrorEntry;
