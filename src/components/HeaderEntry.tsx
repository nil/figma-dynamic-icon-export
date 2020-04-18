import * as React from 'react';

type Props = {
  text: string;
  icon: string;
  open?: boolean;
  disabled?: boolean;
  onClick;
};

const HeaderEntry = ({
  text, icon, disabled, open, onClick
}: Props): JSX.Element => (
  <button
    type="button"
    className={`header-button-entry ${disabled ? 'header-button-entry--disabled' : ''} ${open ? 'header-button-entry--open' : ''}`}
    onClick={onClick}
  >
    <img src={icon} className="header-button-icon" alt="" aria-hidden="true" />
    <span className="header-button-text">{text}</span>
  </button>
);

export default HeaderEntry;
