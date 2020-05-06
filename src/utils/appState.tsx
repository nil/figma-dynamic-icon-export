import * as React from 'react';

const AppStateContext = React.createContext(undefined);

export function AppStateProvider({ children }): JSX.Element {
  const [exportableNodes, setExportableNodes] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');
  const [headerVisible, setHeaderVisible] = React.useState(true);
  const [headerMessage, setHeaderMessage] = React.useState('');
  const [settingsStatus, setSettingsStatus] = React.useState(false);

  const value = {
    exportableNodes,
    setExportableNodes,
    searchValue,
    setSearchValue,
    headerVisible,
    setHeaderVisible,
    headerMessage,
    setHeaderMessage,
    settingsStatus,
    setSettingsStatus
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

const useAppState = () => React.useContext(AppStateContext);

export default useAppState;
