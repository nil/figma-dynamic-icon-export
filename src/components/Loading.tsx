import * as React from 'react';

const Loading = (): JSX.Element => (
  <div className="loading">
    <div className="loading-content">
      <span className="loading-spinner visual-bell__spinner" />
      <div className="loading-text type type--pos-medium-normal">
        Preparing your assets
        <br />
        to be exported
      </div>
    </div>
  </div>
);

export default Loading;
