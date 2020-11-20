import * as React from 'react';

type Props = {
  text: string;
  disabled?: boolean;
  onClick;
};

const Button = ({ text, disabled, onClick }: Props): JSX.Element => (
  <button
    type="button"
    className="ui-button type type--medium type--inverse"
    disabled={!!disabled}
    onClick={onClick}
  >
    {text}
  </button>
);

export default Button;
