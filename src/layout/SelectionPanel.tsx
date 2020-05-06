import * as React from 'react';

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
    searchValue
  } = useAppState();

  const filteredList = exportableNodes.filter((entry) => entry.name.indexOf(searchValue) !== -1);

  window.onmessage = (event): void => {
    const { updateSelection } = event.data.pluginMessage;

    if (updateSelection) {
      setExportableNodes(updateSelection);
      setHeaderMessage(`${updateSelection.length} icons`);
    }
  };

  React.useEffect(() => {
    setExportableNodes(nodes);
    setHeaderMessage(`${nodes.length} icons`);
  }, []);

  return (
    <div className="selection">
      {filteredList.map((node) => (
        <NodeCheckbox
          node={node}
          key={node.id}
        />
      ))}
    </div>
  );
};

export default SelectionPanel;
