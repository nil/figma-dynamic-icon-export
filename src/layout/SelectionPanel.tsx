import * as React from 'react';

import EmptyPanel from './EmptyPanel';
import NodeCheckbox from '../components/NodeCheckbox';
import useAppState from '../utils/appState';

type Props = {
  nodes?: NodeEntry[];
};

const SelectionPanel = ({ nodes }: Props): JSX.Element => {
  const {
    selectedNodes,
    setSelectedNodes,
    setHeaderMessage,
    searchValue,
    setSearchValue,
    setActivePanel,
    settingsStatus
  } = useAppState();

  // Filtered list after search
  const filteredList = selectedNodes.filter((entry) => entry.name.indexOf(searchValue) !== -1);

  // Listen for message to update UI and selectedNodes
  window.onmessage = (event): void => {
    const { updateSelection } = event.data.pluginMessage;

    updateSelection.forEach((entry, index) => {
      const identicalNode = selectedNodes.filter((e) => e.id === entry.id)[0];

      if (identicalNode) {
        updateSelection[index].status = identicalNode.status;
      }
    });

    if (!settingsStatus && updateSelection) {
      setSelectedNodes(updateSelection);
      setHeaderMessage(`${updateSelection.filter((entry) => entry.status).length} icons`);

      if (updateSelection.length === 0) {
        setActivePanel(<EmptyPanel />);
        setSearchValue('');
      }
    }
  };

  // Change value of selectedNodes on first render
  React.useEffect(() => {
    setSelectedNodes(nodes);
    setHeaderMessage(`${nodes.length} icons`);
  }, []);

  // Render empty state if the search does not return any result
  const panelToShow = (): JSX.Element => {
    if (selectedNodes.length > 0 && filteredList.length === 0) {
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
