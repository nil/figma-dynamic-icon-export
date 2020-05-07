import * as React from 'react';
import useAppState from '../utils/appState';

type Props = {
  node: NodeEntry;
};

const NodeCheckbox = ({ node }: Props): JSX.Element => {
  const [checkboxStatus, setCheckboxStatus] = React.useState(node.status);
  const {
    selectedNodes,
    setSelectedNodes,
    setHeaderMessage,
    setFooterVisible
  } = useAppState();

  const updateExportableList = (selected: NodeEntry): void => {
    selectedNodes.forEach((entry, index) => {
      if (entry.id === selected.id) {
        const updatedList = selectedNodes;
        updatedList[index].status = !checkboxStatus;

        setSelectedNodes(updatedList);
        setCheckboxStatus(!checkboxStatus);
      }
    });

    setHeaderMessage(`${selectedNodes.filter((entry) => entry.status).length} icons`);
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
      <span className="selection-node-text type type--pos-small-normal">
        {`${node.name}, ${node.status}`}
      </span>
    </div>
  );
};

export default NodeCheckbox;
