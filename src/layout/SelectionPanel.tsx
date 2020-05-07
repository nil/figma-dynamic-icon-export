import * as React from 'react';

import EmptyPanel from './EmptyPanel';
import NodeCheckbox from '../components/NodeCheckbox';
import useAppState from '../utils/appState';

type Props = {
  nodes?: NodeEntry[];
};

const SelectionPanel = ({ nodes }: Props): JSX.Element => {
  const {
    exportableNodes,
    setExportableNodes,
    setHeaderMessage,
    searchValue,
    setSearchValue,
    setActivePanel,
    setSelectionIsEmpty,
    settingsStatus
  } = useAppState();

  // Filtered list after search
  const filteredList = exportableNodes.filter((entry) => entry.name.indexOf(searchValue) !== -1);

  // Listen for message to update selectionList
  window.onmessage = (event): void => {
    const { updateSelection } = event.data.pluginMessage;

    if (!settingsStatus && updateSelection) {
      setExportableNodes(updateSelection);
      setHeaderMessage(`${updateSelection.length} icons`);

      if (updateSelection.length === 0) {
        setActivePanel(<EmptyPanel />);
        setSelectionIsEmpty(true);
        setSearchValue('');
      }
    }
  };

  // Change value of exportableNodes on first render
  React.useEffect(() => {
    setExportableNodes(nodes);
    setHeaderMessage(`${nodes.length} icons`);
  }, []);

  // Render empty state if the search does not return any result
  const panelToShow = (): JSX.Element => {
    if (exportableNodes.length > 0 && filteredList.length === 0) {
      return <EmptyPanel message={'No matches found.\nTry something different.'} />;
    }

    return filteredList.map((node) => (
      <NodeCheckbox node={node} key={node.id} />
    ));
  };

  return (
    <div className="selection">
      {panelToShow()}
    </div>
  );
};

export default SelectionPanel;
