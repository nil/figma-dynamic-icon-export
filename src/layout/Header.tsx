/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import useAppState from '../utils/appState';

import IconSearch from '../assets/IconSearch';
import IconSettings from '../assets/IconSettings';


const Header = (): JSX.Element => {
  const {
    searchValue,
    setSearchValue,
    headerVisible,
    headerMessage,
    settingsStatus,
    setSettingsStatus
  } = useAppState();

  const searchLayout = (): JSX.Element => (
    <>
      <div className="header-message type type--pos-small-bold">{ headerMessage }</div>
      <div className="header-search type type--pos-small-normal">
        <label className="header-search-label" htmlFor="input-search">
          <IconSearch ariaLabel="Search" className="header-search-icon" />
        </label>
        <input
          type="text"
          id="input-search"
          className="header-search-input"
          placeholder="Search"
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
        {setSearchValue ? searchLayout() : null}
        {/* {button ? buttonEntry() : null} */}
        <button
          type="button"
          className={`header-settings-button ${settingsStatus ? 'header-settings-button--open' : ''}`}
          onClick={(): void => { updateSettingsStatus(); }}
        >
          <IconSettings className="header-settings-icon" aria-hidden />
        </button>
      </header>
    );
  }

  return null;
};

export default Header;
