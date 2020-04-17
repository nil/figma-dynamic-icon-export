import * as React from 'react';
import IconReload from '../assets/reload.svg';
import IconSettings from '../assets/settings.svg';

type Props = {
  disabled: boolean;
};

class Header extends React.Component<Props, {}> {
  viewNode = (id: string | boolean): void => {
    parent.postMessage({ pluginMessage: { viewNode: id } }, '*');
  };

  runAgainAction = (): void => {
    parent.postMessage({ pluginMessage: { runAgain: true } }, '*');
  };

  settingsAction = (): void => {
    console.log('SETTINGS');
  };

  button = (text: string, icon, callback, disabled?: boolean): JSX.Element => (
    <button
      type="button"
      className="header-button-entry"
      onClick={(): void => callback()}
      disabled={disabled}
    >
      <img src={icon} className="header-button-icon" alt="" aria-hidden="true" />
      <span className="header-button-text">{text}</span>
    </button>
  );

  render(): JSX.Element {
    const { disabled } = this.props;

    return (
      <>
        <div className="header-layout type type--pos-small-bold">
          {this.button('Run again', IconReload, this.runAgainAction, disabled)}
          {this.button('Settings', IconSettings, this.settingsAction)}
        </div>
      </>
    );
  }
}

export default Header;
