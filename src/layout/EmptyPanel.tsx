import * as React from 'react';
import EmptyStateIllustration from '../assets/EmptyStateIllustration';

type Props = {
  message?: string;
};

const ErrorPanel = ({ message }: Props): JSX.Element => (
  <div className="empty panel">
    <EmptyStateIllustration className="empty-illustration" />
    <div className="empty-message type type--pos-medium-normal">
      {message || 'There are no selected nodes. Select the frames or components you want to export as icons. '}
    </div>
  </div>
);

export default ErrorPanel;
