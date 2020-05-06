import * as React from 'react';
import useAppState from '../utils/appState';

type Props = {
  settings?: boolean;
  message?: string;
  button?: {
    icon: string;
    label: string;
    onClick;
  };
};

const HeaderEntry = ({ settings, message, button }: Props): JSX.Element => {
  const { searchValue, setSearchValue } = useAppState();

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


  return (
    <header className={`header ${settings ? 'header--open' : ''}`}>
      <div className="header-layout type type--pos-small-bold">
        {setSearchValue ? searchLayout() : null}
        {button ? buttonEntry() : null}
      </div>
    </header>
  );
};

export default HeaderEntry;
