/* eslint-disable jsx-a11y/label-has-associated-control */
import * as React from 'react';
import useAppState from '../utils/appState';

import IconList from '../assets/IconList';
import IconSearch from '../assets/IconSearch';
import IconSettings from '../assets/IconSettings';
import SelectionPanel from './SelectionPanel';
import SettingsPanel from './SettingsPanel';


const Header = (): JSX.Element => {
  const {
    searchValue,
    setSearchValue,
    headerVisible,
    headerMessage,
    settingsStatus,
    setSettingsStatus,
    setActivePanel
  } = useAppState();

  // Open settings panel
  const updateSettingsStatus = (action: 'open' | 'close'): void => {
    if (action === 'open') {
      setSettingsStatus(true);
      setActivePanel(<SettingsPanel />);
    } else if (action === 'close') {
      setSettingsStatus(false);
      setActivePanel(<SelectionPanel />);
    }
  };

  // Layout when a search input should be available
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

  // Layout when settings panel is open
  const settingsLayout = (): JSX.Element => (
    <button
      type="button"
      className="header-button type type--pos-small-bold"
      onClick={(): void => updateSettingsStatus('close')}
    >
      <IconList className="header-button-icon" aria-hidden="true" />
      <span className="header-button-text">View icon list</span>
    </button>
  );


  if (headerVisible) {
    return (
      <header className={`header ${settingsStatus ? 'header--open' : ''}`}>
        <div className="header-content">
          {!settingsStatus ? searchLayout() : null}
          {settingsStatus ? settingsLayout() : null}
        </div>

        <button
          type="button"
          className={`header-settings-button ${settingsStatus ? 'header-settings-button--open' : ''}`}
          onClick={(): void => updateSettingsStatus('open')}
        >
          <IconSettings className="header-settings-icon" aria-hidden />
        </button>
      </header>
    );
  }

  return null;
};

export default Header;
