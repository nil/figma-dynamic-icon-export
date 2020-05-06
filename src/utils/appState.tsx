import * as React from 'react';


const AppStateContext = React.createContext(undefined);

export function AppStateProvider({ children }): JSX.Element {
  const [exportableNodes, setExportableNodes] = React.useState([]);
  const [searchValue, setSearchValue] = React.useState('');

  const value = {
    exportableNodes,
    setExportableNodes,
    searchValue,
    setSearchValue
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

const useAppState = () => React.useContext(AppStateContext);

export default useAppState;
