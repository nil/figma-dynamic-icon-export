import * as React from 'react';

type Props = {
  children: React.ReactNode | React.ReactNode[];
};

const AppStateContext = React.createContext(undefined);

const defaultValues: UserValues = {
  sizeValue: '',
  sizeMethod: 'not',
  prefix: '',
  suffix: ''
};

export function AppStateProvider({ children }: Props): JSX.Element {
  // Nodes selected by the user
  const [selectedNodes, setSelectedNodes] = React.useState([]);

  // The values defiend by the user
  const [userValues, setUserValues] = React.useState(defaultValues);

  // Whether the user has manually changed the value of the size input
  const [userHasUpdatedSize, setUserHasUpdatedSize] = React.useState('');

  const value = {
    selectedNodes,
    setSelectedNodes,
    userHasUpdatedSize,
    setUserHasUpdatedSize,
    userValues,
    setUserValues
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
