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
    <>
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        value={userSettings[id]}
        placeholder={label}
        name={id}
        onChange={updateUserSettings}
      />
    </>
  );
};

export default HeaderEntry;
