import * as React from 'react';
import NodeCheckbox from '../components/NodeCheckbox';

type Props = {
  nodes: NodeEntry[];
};

const SelectionPanel = ({ nodes }: Props): JSX.Element => {
  const [exportableNodes, setExportableNodes] = React.useState(nodes);

  const sendMessage = (content): void => {
    parent.postMessage({ pluginMessage: { [content]: true } }, '*');
  };

  return (
    <div className="success panel">
      {exportableNodes.map((node) => (
        <NodeCheckbox
          node={node}
          exportableNodes={exportableNodes}
          setExportableNodes={setExportableNodes}
        />
      ))}
    </div>
  );
};

export default SelectionPanel;
