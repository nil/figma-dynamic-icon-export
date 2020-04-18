import * as React from 'react';
import SettingsInput from '../components/SettingsInput';


const SettingsPanel = (): JSX.Element => {
  const [userSettings, setUserSettings] = React.useState({ start: '', end: '' });

  window.onmessage = async (event): Promise<void> => {
    if (event.data.pluginMessage.userSettings) {
      setUserSettings(event.data.pluginMessage.userSettings);
    }
  };

  return (
    <div className="settings panel">
      <SettingsInput
        label="Start mark"
        type="text"
        id="start"
        userSettings={userSettings}
        setUserSettings={setUserSettings}
      />
      <SettingsInput
        label="End mark"
        type="text"
        id="end"
        userSettings={userSettings}
        setUserSettings={setUserSettings}
      />
    </div>
  );
};

export default SettingsPanel;
