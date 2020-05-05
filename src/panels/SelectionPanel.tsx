import * as React from 'react';

import Header from '../components/Header';
import NodeCheckbox from '../components/NodeCheckbox';

type Props = {
  nodes;
};

const SelectionPanel = ({ nodes }: Props): JSX.Element => {
  const [exportableNodes, setExportableNodes] = React.useState(nodes);
  const [displayNodes, setDisplayNodes] = React.useState(Object.values(nodes).map((node) => node));

  const sendMessage = (content): void => {
    parent.postMessage({ pluginMessage: { [content]: true } }, '*');
  };

  return (
    <div className="selection">
      <Header search list={exportableNodes} updateList={setDisplayNodes} />
      {displayNodes.map((node) => (
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
