import * as React from 'react';

import Header from '../components/Header';
import NodeCheckbox from '../components/NodeCheckbox';

type Props = {
  nodes;
};

const SelectionPanel = ({ nodes }: Props): JSX.Element => {
  const [exportableNodes, setExportableNodes] = React.useState(nodes);
  const [searchValue, setSearchValue] = React.useState('');
  const filteredList = exportableNodes.filter((entry) => entry.name.indexOf(searchValue) !== -1);

  window.onmessage = (event): void => {
    if (event.data.pluginMessage.updateSelection) {
      setExportableNodes(event.data.pluginMessage.updateSelection);
    }
  };

  return (
    <div className="selection">
      <Header searchValue={searchValue} setSearchValue={setSearchValue} />
      {filteredList.map((node) => (
        <NodeCheckbox
          node={node}
          key={node.id}
          exportableNodes={exportableNodes}
          setExportableNodes={setExportableNodes}
        />
      ))}
    </div>
  );
};

export default SelectionPanel;
