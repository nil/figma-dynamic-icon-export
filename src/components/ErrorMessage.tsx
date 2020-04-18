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

const ErrorMessage = ({ entries }: Props): JSX.Element => {
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

export default ErrorMessage;
