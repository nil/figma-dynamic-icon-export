import * as React from 'react';

type Props = {
  name: string;
};

const NodeName = ({ name }: Props): JSX.Element => (
  <div>
    {name}
  </div>
);

export default NodeName;
