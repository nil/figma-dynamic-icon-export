import * as React from 'react';

type Props = {
  label: string;
  type: string;
  id: string;
  userSettings;
  setUserSettings;
};

const HeaderEntry = ({
  label, type, id, userSettings, setUserSettings
}: Props): JSX.Element => {
  const updateUserSettings = (event): void => {
    const newSettings = {
      ...userSettings,
      [id]: event.target.value
    };

    setUserSettings(newSettings);
    window.parent.postMessage({ pluginMessage: { userSettings: newSettings } }, '*');
  };

  return (
    <div className="settings-entry">
      <label htmlFor={id} className="type type--pos-small-normal settings-label">{label}</label>
      <input
        type={type}
        value={userSettings[id]}
        placeholder={label}
        name={id}
        className={`input settings-input settings-input--${type}`}
        onChange={updateUserSettings}
      />
    </div>
  );
};

export default HeaderEntry;
