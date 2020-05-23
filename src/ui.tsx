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

import 'figma-plugin-ds/dist/figma-plugin-ds.css';
import './style/index.css';


const App = (): JSX.Element => {
  const [runStatus, setRunStatus] = React.useState(true);

  const {
    selectedNodes,
    setSelectedNodes,
    errorNodes,
    setErrorNodes,
    setSearchValue,
    setHeaderMessage,
    setFooterVisible,
    settingsStatus,
    setSettingsStatus,
    activePanel,
    setActivePanel,
    setSizeValue,
    userHasUpdatedSize,
    setUserHasUpdatedSize,
    footerVisible,
    userSettings,
    setUserSettings
  } = useAppState();

  /**
   * Recive messages from code.ts
   */
  window.onmessage = async (event): Promise<void> => {
    if (!event.data.pluginMessage) { return; }

    const { pluginMessage } = event.data;
    const userSelection = pluginMessage.initialSelection || pluginMessage.updateSelection;

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
          // setTimeout(() => {
          //   setActivePanel(<SuccessPanel length={pluginMessage.exportAssets.length} />);
          //   setRunStatus(false);
          // }, 2000);
        });
      });
    }

    // Show error message
    if (pluginMessage.errorNodes) {
      const { length } = pluginMessage.errorNodes;

      setActivePanel(<ErrorPanel />);
      setErrorNodes(pluginMessage.errorNodes);
      setHeaderMessage(`${length} error${length > 1 ? 's' : ''}`);
    }

    // Update user settings
    if (pluginMessage.userSettings) {
      setUserSettings(pluginMessage.userSettings);
    }

    // Render list of selected nodes or an empty state
    if (userSelection && errorNodes.length === 0) {
      // Copy status to the nodes that where previously unselected
      userSelection.forEach((entry: SelectedNode, index: number) => {
        const identicalNode = selectedNodes.filter((e: SelectedNode) => e.id === entry.id)[0];

        if (identicalNode) {
          userSelection[index].status = identicalNode.status;
        }
      });

      // Update header, footer, node list and panel
      const { length } = userSelection.filter((entry: SelectedNode) => entry.status);

      setHeaderMessage(`${length} icon${length > 1 || length === 0 ? 's' : ''}`);
      setSelectedNodes(userSelection);

      if (userSelection.length === 0) {
        setActivePanel(<EmptyPanel />);
        setSearchValue('');
        setSettingsStatus(false);
        setUserHasUpdatedSize(false);
      } else {
        setActivePanel(<SelectionPanel />);
        setFooterVisible(true);

        if (!userHasUpdatedSize) {
          setSizeValue(userSettings.size || `${modeNumber(userSelection.map((node) => node.size))}px`);
        }
      }

      if (settingsStatus) {
        setSettingsStatus(false);
      }
    }
  };


  return (
    <>
      <Header />
      <main className={`main ${footerVisible ? 'main--footer' : ''}`}>
        {activePanel}
      </main>
      <Footer />
    </>
  );
};

ReactDOM.render(<AppStateProvider><App /></AppStateProvider>, document.getElementById('plugin-ui'));
