import * as React from 'react';
import IconReload from '../assets/reload.svg';
import IconSettings from '../assets/settings.svg';

type Props = {
  disabled: boolean;
  settings: boolean;
};

const Header = ({ disabled, settings }: Props): JSX.Element => {
  const sendMessage = (content: string): void => {
    parent.postMessage({ pluginMessage: { headerAction: content } }, '*');
  };

  const button = (text: string, icon, dState: boolean, sState: boolean): JSX.Element => (
    <button
      type="button"
      className={`header-button-entry ${dState ? 'header-button-entry--disabled' : ''} ${sState ? 'header-button-entry--open' : ''}`}
      onClick={(): void => sendMessage(text)}
    >
      <img src={icon} className="header-button-icon" alt="" aria-hidden="true" />
      <span className="header-button-text">{text}</span>
    </button>
  );

  return (
    <div className={`header-layout type type--pos-small-bold ${settings ? 'header-layout--open' : ''}`}>
      {button('Run again', IconReload, disabled, false)}
      {button('Settings', IconSettings, false, settings)}
    </div>
  );
};

export default Header;
