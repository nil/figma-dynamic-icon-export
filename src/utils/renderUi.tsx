import * as ReactDOM from 'react-dom';
import * as React from 'react';

import Header from '../components/Header';

export const renderHeader = (disabled: boolean): void => {
  ReactDOM.render(<Header disabled={disabled} />, document.getElementById('header'));
};

export const renderMain = (content: JSX.Element): void => {
  ReactDOM.render(content, document.getElementById('main'));
};
