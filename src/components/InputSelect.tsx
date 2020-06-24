/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import selectMenu from '../../node_modules/figma-plugin-ds/dist/modules/selectMenu';

import useAppState from '../utils/appState';

type Props = {
  id: string;
  options: {
    label: string;
    value: string;
  }[];
  className?: string;
};

const Input = ({ id, options, className }: Props): JSX.Element => {
  const {
    userValues,
    setUserValues
  } = useAppState();

  React.useEffect(() => {
    selectMenu.init();
  }, []);

  // Update values and send them to the plugin
  const updateUserValues = (event): void => {
    const newSettings = {
      ...userValues,
      [id]: event.target.value
    };

    setUserValues(newSettings);
    window.parent.postMessage({ pluginMessage: { userValues: newSettings } }, '*');
  };

  return (
    <label className={`input input--select ${className}`}>
      <select
        value={userValues[id]}
        name={id}
        className="select-menu"
        onChange={updateUserValues}
        onClick={updateUserValues}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>{option.label}</option>
        ))}
      </select>
    </label>
  );
};

export default Input;
