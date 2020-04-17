import * as React from 'react';
import IconReload from '../assets/reload.svg';
import IconSettings from '../assets/settings.svg';

type Props = {
  disabled: boolean;
  settings: boolean;
};

class Header extends React.Component<Props, {}> {
  sendMessage = (content: string): void => {
    parent.postMessage({ pluginMessage: { headerAction: content } }, '*');
  };

  button = (text: string, icon, disabled: boolean, settings: boolean): JSX.Element => (
    <button
      type="button"
      className={`header-button-entry ${disabled ? 'header-button-entry--disabled' : ''} ${settings ? 'header-button-entry--open' : ''}`}
      onClick={(): void => this.sendMessage(text)}
    >
      <img src={icon} className="header-button-icon" alt="" aria-hidden="true" />
      <span className="header-button-text">{text}</span>
    </button>
  );

  render(): JSX.Element {
    const { disabled, settings } = this.props;

    return (
      <>
        <div className={`header-layout type type--pos-small-bold ${settings ? 'header-layout--open' : ''}`}>
          {this.button('Run again', IconReload, disabled, false)}
          {this.button('Settings', IconSettings, false, settings)}
        </div>
      </>
    );
  }
}

export default Header;
