import * as React from 'react';
import useAppState from '../utils/appState';

type Props = {
  node: NodeEntry;
};

const NodeCheckbox = ({ node }: Props): JSX.Element => {
  const { exportableNodes, setExportableNodes } = useAppState();
  const [checkboxStatus, setCheckboxStatus] = React.useState(node.status);

  const updateExportableList = (selected: NodeEntry): void => {
    exportableNodes.forEach((entry, index) => {
      if (entry.id === selected.id) {
        const updatedList = exportableNodes;
        updatedList[index].status = !checkboxStatus;

        setExportableNodes(updatedList);
        setCheckboxStatus(!checkboxStatus);
      }
    });
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
