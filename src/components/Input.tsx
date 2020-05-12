/* eslint-disable react/prop-types */
/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import { selectMenu } from 'figma-plugin-ds';

import useAppState from '../utils/appState';


type Props = {
  id: string;
  type: string;
  label: string;
  subLabel?: string;
  options?: {
    text: string;
    value: string;
  }[];
};

const Input = ({
  id, type, label, subLabel, options
}: Props): JSX.Element => {
  const {
    setSizeValue,
    userSettings,
    setUserSettings
  } = useAppState();

  const [checkboxStatus, setCheckboxStatus] = React.useState(userSettings[id]);

  React.useEffect(() => {
    if (type === 'select') {
      selectMenu.init();
    }
  }, []);

  // Update values and send them to the plugin
  const updateUserSettings = (event): void => {
    const updateValue = type === 'checkbox' ? !checkboxStatus : event.target.value;
    const newSettings = {
      ...userSettings,
      [id]: updateValue
    };

    if (type === 'checkbox') {
      setCheckboxStatus(!checkboxStatus);
    }

    if (id === 'size') {
      setSizeValue(updateValue);
    }

    setUserSettings(newSettings);
    window.parent.postMessage({ pluginMessage: { userSettings: newSettings } }, '*');
  };

  const input = (): JSX.Element => {
    if (type === 'select') {
      return (
        <div className={`settings-input settings-input--${type}`}>
          <select
            value={userSettings[id]}
            name={id}
            className="select-menu"
            onChange={updateUserSettings}
            onClick={updateUserSettings}
          >
            {options.map((option) => (
              <option value={option.value} key={option.value}>{option.text}</option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <input
        type={type}
        placeholder="auto"
        value={userSettings[id]}
        defaultChecked={checkboxStatus}
        name={id}
        className={`settings-input settings-input--${type} type`}
        onChange={updateUserSettings}
      />
    );
  };

  return (
    <label className="settings-entry">
      <div className={`settings-label settings-label--${type}`}>
        <span className="settings-label-primary type--bold">{label}</span>
        {subLabel ? <span className="settings-label-secondary">{subLabel}</span> : null}
      </div>
      {input()}
    </label>
  );
};

export default Input;
