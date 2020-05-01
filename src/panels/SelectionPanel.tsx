import * as React from 'react';
import NodeName from '../components/NodeName';

type Props = {
  nodes;
};

const SelectionPanel = ({ nodes }: Props): JSX.Element => {
  const sendMessage = (content): void => {
    parent.postMessage({ pluginMessage: { [content]: true } }, '*');
  };

  return (
    <div className="success panel">
      {nodes.map((node) => (<NodeName name={node.name} />))}
    </div>
  );
};

export default SelectionPanel;
