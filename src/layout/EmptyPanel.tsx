import * as React from 'react';
import useAppState from '../utils/appState';

import EmptyStateIllustration from '../assets/EmptyStateIllustration';


type Props = {
  message?: string;
};

const EmptyPanel = ({ message }: Props): JSX.Element => {
  const { setFooterVisible } = useAppState();

  React.useEffect(() => {
    setFooterVisible(false);
  }, []);

  return (
    <div className="empty panel">
      <EmptyStateIllustration className="empty-illustration" />
      <div className="empty-message type type--pos-medium-normal">
        {message || 'There are no selected nodes. Select the frames or components you want to export as icons. '}
      </div>
    </div>
  );
};

export default EmptyPanel;
