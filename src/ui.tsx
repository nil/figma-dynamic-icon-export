import * as React from 'react';
import * as ReactDOM from 'react-dom';

import HeaderEntry from './components/HeaderEntry';
import SettingsInput from './components/SettingsInput';
import IconReload from './assets/reload.svg';
import IconSettings from './assets/settings.svg';

import './style/index.css';


const App = (): JSX.Element => {
  const [runStatus, setRunStatus] = React.useState(false);
  const [settingsPanel, setSettingsPanel] = React.useState(false);
  const [userSettings, setUserSettings] = React.useState({ start: 'hello', end: 'goodbye' });


  // Run plugin again
  const runAgain = (): void => {
    if (!runStatus) {
      window.parent.postMessage({ pluginMessage: { runAgain: true } }, '*');
      setRunStatus(true);
    }
  };

  // Open settings panel
  const openSettings = (): void => {
    setSettingsPanel(true);
  };

  // Recive messages from code.ts
  window.onmessage = async (event): Promise<void> => {
    const { pluginMessage } = event.data;

    if (event.data.pluginMessage.command === 'setKey') {
      // setEditingKey(true);
    }

    if (pluginMessage.userSettings) {
      setUserSettings(pluginMessage.userSettings);
    }
  };

  return (
    <>
      <header className={`header ${settingsPanel ? 'header--open' : ''}`}>
        <div className="header-layout type type--pos-small-bold">
          <HeaderEntry text="Run again" icon={IconReload} disabled={runStatus} onClick={runAgain} />
          <HeaderEntry text="Settings" icon={IconSettings} open={settingsPanel} onClick={openSettings} />
        </div>
      </header>
      <main className="main">
        <button type="button" className="action1className">Action 1</button>
        <button type="button" className="button button--secondary" onClick={(): void => {}}>Action 2</button>
        <div><SettingsInput label="Start mark" type="text" id="start" userSettings={userSettings} setUserSettings={setUserSettings} /></div>
        <div><SettingsInput label="End mark" type="text" id="end" userSettings={userSettings} setUserSettings={setUserSettings} /></div>
        {userSettings.start}
        ,
        {' '}
        {userSettings.end}
      </main>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('plugin-ui'));
