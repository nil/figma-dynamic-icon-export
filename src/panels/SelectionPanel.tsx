import * as React from 'react';
import NodeCheckbox from '../components/NodeCheckbox';

type Props = {
  nodes;
};

const SelectionPanel = ({ nodes }: Props): JSX.Element => {
  const [exportableNodes, setExportableNodes] = React.useState(nodes);
  const realNodes: NodeEntry[] = [];

  const sendMessage = (content): void => {
    parent.postMessage({ pluginMessage: { [content]: true } }, '*');
  };

  Object.values(nodes).forEach((node) => {
    realNodes.push(node);
  });

  return (
    <div className="selection">
      {realNodes.map((node) => (
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
