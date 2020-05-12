import * as React from 'react';
import useAppState from '../utils/appState';

type Props = {
  node: SelectedNode;
};

const NodeCheckbox = ({ node }: Props): JSX.Element => {
  const [checkboxStatus, setCheckboxStatus] = React.useState(node.status);
  const {
    selectedNodes,
    setSelectedNodes,
    setHeaderMessage,
    setFooterVisible
  } = useAppState();

  const updateExportableList = (selected: SelectedNode): void => {
    selectedNodes.forEach((entry: SelectedNode, index: number) => {
      if (entry.id === selected.id) {
        const updatedList = selectedNodes;
        updatedList[index].status = !checkboxStatus;

        setSelectedNodes(updatedList);
        setCheckboxStatus(!checkboxStatus);
      }
    });

    setHeaderMessage(`${selectedNodes.filter((entry: SelectedNode) => entry.status).length} icons`);
  };

  React.useEffect(() => {
    setFooterVisible(true);
  }, []);

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
      <span className="selection-node-text">
        {node.name}
      </span>
    </div>
  );
};

export default NodeCheckbox;
