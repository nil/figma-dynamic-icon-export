import * as React from 'react';

import Header from '../components/Header';
import NodeCheckbox from '../components/NodeCheckbox';
import useAppState from '../utils/appState';

type Props = {
  nodes?: NodeEntry[];
};

const SelectionPanel = ({ nodes }: Props): JSX.Element => {
  const { exportableNodes, setExportableNodes, searchValue } = useAppState();
  const filteredList = exportableNodes.filter((entry) => entry.name.indexOf(searchValue) !== -1);

  window.onmessage = (event): void => {
    if (event.data.pluginMessage.updateSelection) {
      setExportableNodes(event.data.pluginMessage.updateSelection);
    }
  };

  React.useEffect(() => {
    setExportableNodes(nodes);
  }, []);

  return (
    <div className="selection">
      <Header message={`${exportableNodes.length} icons`} />
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
