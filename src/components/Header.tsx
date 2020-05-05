import * as React from 'react';

type Props = {
  search?: boolean;
  settings?: boolean;
  button?: {
    icon: string;
    label: string;
    onClick: Function;
  };
  list?;
  updateList?;
};

const HeaderEntry = ({
  search, settings, button, list, updateList
}: Props): JSX.Element => {
  const [searchValue, setSearchValue] = React.useState('');

  const updateSearch = (value): void => {
    setSearchValue(value);
    updateList(Object.values(list).filter((entry) => entry.name.indexOf(value) !== -1));
    console.log(list);
  };

  const searchLayout = (): JSX.Element => (
    <>
      <div className="header-message">140 icons</div>
      <div className="header-search">
        <label htmlFor="input-f83a" className="header-search-label">S</label>
        <input
          type="text"
          id="input-f83a"
          className="header-search-input"
          value={searchValue}
          onChange={(): void => { updateSearch(event.target.value); }}
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
        {search ? searchLayout() : null}
        {button ? buttonEntry() : null}
      </div>
    </header>
  );
};

export default HeaderEntry;
