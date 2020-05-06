import * as React from 'react';
import * as ReactDOM from 'react-dom';
import JSZip from '../node_modules/jszip/dist/jszip.min';

import ErrorPanel from './panels/ErrorPanel';
import SettingsPanel from './panels/SettingsPanel';
import LoadingPanel from './panels/LoadingPanel';
import SuccessPanel from './panels/SuccessPanel';
import SelectionPanel from './panels/SelectionPanel';

import { AppStateProvider } from './utils/appState';
import HeaderEntry from './components/HeaderEntry';
import IconReload from './assets/reload.svg';
import IconSettings from './assets/settings.svg';

import './style/figma.css';
import './style/index.css';


const App = (): JSX.Element => {
  const [runStatus, setRunStatus] = React.useState(true);
  const [settingsPanel, setSettingsPanel] = React.useState(false);
  const [activePanel, setActivePanel] = React.useState(<LoadingPanel />);

  /**
   * Recive messages from code.ts
   */
  window.onmessage = async (event): Promise<void> => {
    const { pluginMessage } = event.data;

    if (!pluginMessage) { return; }

    // Replace current panel with a new one
    if (pluginMessage.changePanel) {
      switch (pluginMessage.changePanel.name) {
        default:
        case 'loading': setActivePanel(<LoadingPanel />); break;
        case 'settings': setActivePanel(<SettingsPanel />); break;
        // case 'success': setActivePanel(<SuccessPanel />); break;
      }
    }

    // Show error message
    if (pluginMessage.showError) {
      setActivePanel(<ErrorPanel entries={pluginMessage.showError} />);
      setRunStatus(false);
      setSettingsPanel(false);
    }

    // Generate exportable zip
    if (pluginMessage.exportableAssets) {
      // eslint-disable-next-line consistent-return
      return new Promise(() => {
        const zip = new JSZip();

        pluginMessage.exportableAssets.forEach(({ name, svg }) => {
          zip.file(`${name}.svg`, svg);
        });

        zip.generateAsync({ type: 'blob' }).then((content: Blob) => {
          const blobURL = window.URL.createObjectURL(content);
          const link = document.createElement('a');
          link.href = blobURL;
          link.download = 'icons.zip';
          link.click();
        }).then(() => {
          setTimeout(() => {
            setActivePanel(<SuccessPanel length={pluginMessage.exportableAssets.length} />);
            setRunStatus(false);
            setSettingsPanel(false);
          }, 2000);
        });
      });
    }

    if (pluginMessage.initialSelection) {
      setActivePanel(<SelectionPanel nodes={pluginMessage.initialSelection} />);
    }
  };

  /**
   * Run plugin again
   */
  const runAgain = (): void => {
    if (!runStatus) {
      window.parent.postMessage({ pluginMessage: { runAgain: true } }, '*');
      setRunStatus(true);
      setSettingsPanel(false);
    }
  };

  /**
   * Open settings panel
   */
  const openSettings = (): void => {
    window.parent.postMessage({ pluginMessage: { requestSettings: true } }, '*');
    setActivePanel(<SettingsPanel />);
    setSettingsPanel(true);
  };

  return (
    <>
      <main className="main">
        <AppStateProvider>
          {activePanel}
        </AppStateProvider>
      </main>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById('plugin-ui'));
