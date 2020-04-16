import * as React from 'react';
import ErrorEntry from './ErrorEntry';

type Props = {
  entries: ErrorEntry[] | {
    name: string;
    message: string;
    id: string;
    map;
  };
};

class ErrorMessage extends React.Component<Props, {}> {
  viewNode = (id: string): void => {
    parent.postMessage({ pluginMessage: { viewNode: id } }, '*');
  };

  render(): JSX.Element {
    const { entries } = this.props;

    const errorEntries = entries.map((entry) => (
      <ErrorEntry
        key={entry.id}
        type={entry.type}
        message={entry.message}
        name={entry.name}
        id={entry.id}
      />
    ));

    return (
      <div className="error-message">
        {errorEntries}
      </div>
    );
  }
}

export default ErrorMessage;
