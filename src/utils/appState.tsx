import * as React from 'react';

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const AppStateContext = React.createContext(undefined);

export function AppStateProvider({ children }: Props): JSX.Element {
  // Nodes selected by the user
  const [selectedNodes, setSelectedNodes] = React.useState([]);

  // Nodes that return some error
  const [errorNodes, setErrorNodes] = React.useState([]);

  // Value inside the search input
  const [searchValue, setSearchValue] = React.useState('');

  // Value inside the size input
  const [sizeValue, setSizeValue] = React.useState('');

  // Whether the user has manually changed the value of the size input
  const [userHasUpdatedSize, setUserHasUpdatedSize] = React.useState('');

  // Whether the header is visible or not
  const [headerVisible, setHeaderVisible] = React.useState(true);

  // The message on the header
  const [headerMessage, setHeaderMessage] = React.useState('');

  // Whether the footer is visible or not
  const [footerVisible, setFooterVisible] = React.useState(false);

  // Whether the settings panel is open or not
  const [settingsStatus, setSettingsStatus] = React.useState(false);

  // The current panel visisble in the UI
  const [activePanel, setActivePanel] = React.useState(undefined);

  // The values defiend by the user in the settings
  const [userSettings, setUserSettings] = React.useState({});

  const value = {
    selectedNodes,
    setSelectedNodes,
    errorNodes,
    setErrorNodes,
    searchValue,
    setSearchValue,
    sizeValue,
    setSizeValue,
    userHasUpdatedSize,
    setUserHasUpdatedSize,
    headerVisible,
    setHeaderVisible,
    headerMessage,
    setHeaderMessage,
    footerVisible,
    setFooterVisible,
    settingsStatus,
    setSettingsStatus,
    activePanel,
    setActivePanel,
    userSettings,
    setUserSettings
  };

  return (
    <AppStateContext.Provider value={value}>
      {children}
    </AppStateContext.Provider>
  );
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
const useAppState = () => React.useContext(AppStateContext);

export default useAppState;
