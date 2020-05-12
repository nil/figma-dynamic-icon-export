import * as React from 'react';

import EmptyPanel from './EmptyPanel';
import NodeCheckbox from '../components/NodeCheckbox';
import useAppState from '../utils/appState';


const SelectionPanel = (): JSX.Element => {
  const {
    selectedNodes,
    searchValue
  } = useAppState();

  // Filtered list after search
  const filteredList = selectedNodes.filter((entry) => entry.name.indexOf(searchValue) !== -1);

  // Render empty state if the search does not return any result
  const panelToShow = (): JSX.Element => {
    if (selectedNodes.length > 0 && filteredList.length === 0) {
      return <EmptyPanel message={'No matches found.\nTry something different.'} />;
    }

    return filteredList.map((node) => (
      <NodeCheckbox node={node} key={node.id} />
    ));
  };

  return (
    <div className="selection">
      {panelToShow()}
    </div>
  );
};

export default SelectionPanel;
