import * as React from 'react';

type Props = {
  text: string;
  type: string;
  onClick;
};

const Button = ({ text, type, onClick }: Props): JSX.Element => (
  <button type="button" className={`button button--${type}`} onClick={onClick}>
    {text}
  </button>
);

export default Button;
