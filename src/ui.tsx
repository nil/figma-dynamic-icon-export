import * as React from 'react';
import * as ReactDOM from 'react-dom';
import JSZip from '../node_modules/jszip/dist/jszip.min';
import { AppStateProvider } from './utils/appState';

import ErrorPanel from './layout/ErrorPanel';
import Header from './layout/Header';
import SettingsPanel from './layout/SettingsPanel';
import LoadingPanel from './layout/LoadingPanel';
import SuccessPanel from './layout/SuccessPanel';
import SelectionPanel from './layout/SelectionPanel';

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
    <AppStateProvider>
      <Header />
      <main className="main">
        {activePanel}
      </main>
    </AppStateProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('plugin-ui'));
