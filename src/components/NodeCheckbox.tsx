import * as React from 'react';

type Props = {
  node: NodeEntry;
  exportableNodes;
  setExportableNodes;
};

const NodeCheckbox = ({ node }: Props): JSX.Element => {
  const updateExportableList = (selected: NodeEntry): void => {
    console.log(selected.name);


    // parent.postMessage({ pluginMessage: { [content]: true } }, '*');
  };

  return (
    <div className={`selection-node selection-node--${node.status ? 'active' : ''}`}>
      <input
        className="selection-node-checkbox"
        onClick={(): void => { updateExportableList(node); }}
        type="checkbox"
        aria-label={`Export ${node.name}`}
        aria-checked={node.status}
      />
      <span className="selecton-node-text">
        {node.name}
      </span>
    </div>
  );
};

export default NodeCheckbox;
