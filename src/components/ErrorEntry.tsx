import * as React from 'react';
import IconError from '../assets/error.svg';

type Props = {
  type: string;
  name: string;
  id: string;
};

const ErrorEntry = ({ type, name, id }: Props): JSX.Element => {
  const viewNode = (): void => {
    parent.postMessage({ pluginMessage: { viewNode: id } }, '*');
  };

  return (
    <div className="error-entry">
      <img src={IconError} alt="" aria-hidden="true" className="error-icon" />
      <div className="error-info">
        <div
          className="error-name type type--large type--bold"
          onClick={(): void => viewNode()}
          role="link"
          tabIndex={0}
        >
          {name}
          {/** show proper name */}
        </div>
        <div className="error-context type type--pos-small-normal">
          <span className="error-notify">Error type: </span>
          <span className="error-type">{type}</span>
        </div>
      </div>
    </div>
  );
};

export default ErrorEntry;
