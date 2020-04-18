import * as React from 'react';
import * as ReactDOM from 'react-dom';

import SettingsPanel from './panels/SettingsPanel';
import LoadingPanel from './panels/LoadingPanel';

import HeaderEntry from './components/HeaderEntry';
import IconReload from './assets/reload.svg';
import IconSettings from './assets/settings.svg';

import './style/index.css';


const App = (): JSX.Element => {
  const [runStatus, setRunStatus] = React.useState(false);
  const [settingsPanel, setSettingsPanel] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState(<LoadingPanel />);

  // Run plugin again
  const runAgain = (): void => {
    if (!runStatus) {
      window.parent.postMessage({ pluginMessage: { runAgain: true } }, '*');
      setRunStatus(true);
    }
  };

  // Open settings panel
  const openSettings = (): void => {
    window.parent.postMessage({ pluginMessage: { requestSettings: true } }, '*');
    setActivePanel(<SettingsPanel />);
    setSettingsPanel(true);
  };

  // Recive messages from code.ts
  window.onmessage = async (event): Promise<void> => {
    const { pluginMessage } = event.data;

    if (pluginMessage.changePanel) {
      switch (pluginMessage.changePanel) {
        default:
        case 'loading': setActivePanel(<LoadingPanel />); break;
        case 'settings': setActivePanel(<SettingsPanel />); break;
        // case 'success': setActivePanel(<SuccessPanel />); break;
      }
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
        {activePanel}
      </main>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('plugin-ui'));
