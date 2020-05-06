import * as React from 'react';
import useAppState from '../utils/appState';
import IconSettings from '../assets/IconSettings';

type Props = {
  message?: string;
  button?: {
    icon: string;
    label: string;
    onClick;
  };
};

const Header = ({ message, button }: Props): JSX.Element => {
  const {
    searchValue, setSearchValue, headerVisible, settingsStatus, setSettingsStatus
  } = useAppState();

  const searchLayout = (): JSX.Element => (
    <>
      <div className="header-message">{ message }</div>
      <div className="header-search">
        <label htmlFor="input-f83a" className="header-search-label">S</label>
        <input
          type="text"
          id="input-f83a"
          className="header-search-input"
          value={searchValue}
          onChange={(): void => { setSearchValue(event.target.value); }}
        />
      </div>
    </>
  );

  const buttonEntry = (): JSX.Element => (
    <button
      type="button"
      className="header-button"
      onClick={button.onClick}
    >
      <img src={button.icon} className="header-button-icon" alt="" aria-hidden="true" />
      <span className="header-button-text">{button.label}</span>
    </button>
  );

  const updateSettingsStatus = (): void => {
    if (!settingsStatus) {
      setSettingsStatus(true);
    }
  };


  if (headerVisible) {
    return (
      <header className={`header ${settingsStatus ? 'header--open' : ''}`}>
        <div className="header-layout type type--pos-small-bold">
          {setSearchValue ? searchLayout() : null}
          {button ? buttonEntry() : null}
          <button
            type="button"
            className={`header-settings-button ${settingsStatus ? 'header-settings-button--open' : ''}`}
            onClick={(): void => { updateSettingsStatus(); }}
          >
            <IconSettings className="header-settings-icon" aria-hidden width="16" />
          </button>
        </div>
      </header>
    );
  }

  return null;
};

export default Header;
