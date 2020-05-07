import * as React from 'react';
import LoadingPanel from '../layout/LoadingPanel';

const AppStateContext = React.createContext(undefined);

export function AppStateProvider({ children }): JSX.Element {
  // Nodes selected by the user
  const [selectedNodes, setSelectedNodes] = React.useState([]);

  // Value inside the search input
  const [searchValue, setSearchValue] = React.useState('');

  // Whether the header is visible or not
  const [headerVisible, setHeaderVisible] = React.useState(true);

  // The message on the header
  const [headerMessage, setHeaderMessage] = React.useState('');

  // Whether the settings panel is open or not
  const [settingsStatus, setSettingsStatus] = React.useState(false);

  // The current panel visisble in the UI
  const [activePanel, setActivePanel] = React.useState(<LoadingPanel />);

  const value = {
    selectedNodes,
    setSelectedNodes,
    searchValue,
    setSearchValue,
    headerVisible,
    setHeaderVisible,
    headerMessage,
    setHeaderMessage,
    settingsStatus,
    setSettingsStatus,
    activePanel,
    setActivePanel
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

const useAppState = () => React.useContext(AppStateContext);

export default useAppState;
