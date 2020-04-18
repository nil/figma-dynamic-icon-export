import * as ReactDOM from 'react-dom';
import * as React from 'react';

import Header from '../components/HeaderEntry';

export const renderHeader = (disabled: boolean, settings: boolean): void => {
  ReactDOM.render(<Header disabled={disabled} settings={settings} />, document.getElementById('header'));
};

export const renderMain = (content: JSX.Element): void => {
  ReactDOM.render(content, document.getElementById('main'));
};
