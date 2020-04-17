import * as React from 'react';

const Loading = (): JSX.Element => (
  <div className="loading panel">
    <span className="loading-spinner visual-bell__spinner" />
    <div className="loading-text type type--pos-small-normal">
      Preparing your assets
      <br />
      to be exported
    </div>
  </div>
);

export default Loading;
