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
    <div onClick={() => { updateExportableList(node); }}>
      {node.name}
    </div>
  );
};

export default NodeCheckbox;
