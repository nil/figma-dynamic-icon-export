import * as React from 'react';
import ErrorEntry from '../components/ErrorEntry';

type Props = {
  entries: ErrorEntry[] | {
    name: string;
    message: string;
    id: string;
    map;
  };
};

const ErrorPanel = ({ entries }: Props): JSX.Element => {
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
};

export default ErrorPanel;
