import * as React from 'react';
import ErrorEntry from '../components/ErrorEntry';
import useAppState from '../utils/appState';


const ErrorPanel = (): JSX.Element => {
  const {
    errorNodes
  } = useAppState();

  const errorEntries = errorNodes.map((entry) => (
    <ErrorEntry
      key={entry.id}
      type={entry.type}
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
