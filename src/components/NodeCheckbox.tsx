import * as React from 'react';

type Props = {
  node: NodeEntry;
  exportableNodes;
  setExportableNodes;
};

const NodeCheckbox = ({ node, exportableNodes, setExportableNodes }: Props): JSX.Element => {
  const [checkboxStatus, setCheckboxStatus] = React.useState(node.status);

  const updateExportableList = (selected: NodeEntry): void => {
    setCheckboxStatus(!checkboxStatus);

    if (checkboxStatus) {
      const updatedList = exportableNodes;
      delete updatedList[selected.id];

      setExportableNodes(updatedList);
    } else {
      setExportableNodes({ [selected.id]: selected, ...exportableNodes });
    }
  };

  return (
    <div className={`selection-node ${checkboxStatus ? 'selection-node--active' : ''}`}>
      <input
        className="selection-node-checkbox"
        onChange={(): void => { updateExportableList(node); }}
        checked={checkboxStatus}
        type="checkbox"
        aria-label={`Export ${node.name}`}
        aria-checked={checkboxStatus}
      />
      <span className="selection-node-text type type--pos-small-normal">
        {node.name}
      </span>
    </div>
  );
};

export default NodeCheckbox;
