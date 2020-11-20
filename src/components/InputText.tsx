/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';

import useAppState from '../utils/appState';


type Props = {
  id: string;
  label?: string;
  placeholder: string;
  onBlur?;
};

const InputText = ({
  id, label, placeholder, onBlur
}: Props): JSX.Element => {
  const {
    userValues,
    setUserValues,
    setUserHasUpdatedSize
  } = useAppState();

  // Update values and send them to the plugin
  const updateUserValues = (event): void => {
    const newUserValues = {
      ...userValues,
      [id]: event.target.value
    };

    if (id === 'sizeValue') {
      setUserHasUpdatedSize(true);
    }

    setUserValues(newUserValues);
    window.parent.postMessage({ pluginMessage: { userValues: newUserValues } }, '*');
  };

  return (
    <label className="input input--text">
      {label ? (
        <div className="input-label type">
          {label}
        </div>
      ) : null}
      <input
        type="text"
        placeholder={placeholder}
        value={userValues[id]}
        name={id}
        className="input-field type"
        onChange={updateUserValues}
        onBlur={onBlur}
      />
    </label>
  );
};

export default InputText;
