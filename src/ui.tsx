import * as React from 'react';
import * as ReactDOM from 'react-dom';
import JSZip from '../node_modules/jszip/dist/jszip.min';
import useAppState, { AppStateProvider } from './utils/appState';
import modeNumber from './utils/modeNumber';

import EmptyPanel from './layout/EmptyPanel';
import ErrorPanel from './layout/ErrorPanel';
import Footer from './layout/Footer';
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

  const {
    selectedNodes,
    setSelectedNodes,
    setSearchValue,
    setHeaderMessage,
    setFooterVisible,
    settingsStatus,
    activePanel,
    setActivePanel,
    setSizeValue
  } = useAppState();

  /**
   * Recive messages from code.ts
   */
  window.onmessage = async (event): Promise<void> => {
    if (!event.data.pluginMessage) { return; }

    const { pluginMessage } = event.data;
    const userSelection = pluginMessage.initialSelection || pluginMessage.updateSelection;

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
    if (pluginMessage.exportAssets) {
      // eslint-disable-next-line consistent-return
      return new Promise(() => {
        const zip = new JSZip();

        pluginMessage.exportAssets.forEach(({ name, svg }) => {
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
            setActivePanel(<SuccessPanel length={pluginMessage.exportAssets.length} />);
            setRunStatus(false);
            setSettingsPanel(false);
          }, 2000);
        });
      });
    }

    // Render list of selected nodes or an empty state
    if (!settingsStatus && userSelection) {
      // Copy status to the nodes that where previously unselected
      userSelection.forEach((entry: SelectedNode, index: number) => {
        const identicalNode = selectedNodes.filter((e: SelectedNode) => e.id === entry.id)[0];

        if (identicalNode) {
          userSelection[index].status = identicalNode.status;
        }
      });

      // Update header, footer, node list and panel
      setHeaderMessage(`${userSelection.filter((entry: SelectedNode) => entry.status).length} icons`);
      setSelectedNodes(userSelection);

      if (userSelection.length === 0) {
        setActivePanel(<EmptyPanel />);
        setSearchValue('');
      } else {
        setActivePanel(<SelectionPanel />);
        setSizeValue(`${modeNumber(userSelection.map((node) => node.size))}px`);
        setFooterVisible(true);
      }
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
      <Header />
      <main className="main">
        {activePanel}
      </main>
      <Footer />
    </>
  );
};

ReactDOM.render(<AppStateProvider><App /></AppStateProvider>, document.getElementById('plugin-ui'));
