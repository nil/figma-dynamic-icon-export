import * as React from 'react';

type Props = {
  text: string;
  disabled?: boolean;
  onClick;
};

const Button = ({ text, disabled, onClick }: Props): JSX.Element => (
  <button
    type="button"
    className="footer-button button button--primary"
    disabled={!!disabled}
    onClick={onClick}
  >
    {text}
  </button>
);

export default Button;
