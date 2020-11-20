import * as React from 'react';

const SvgIconError = (p): JSX.Element => {
  const props = {
    'aria-hidden': !p.ariaLabel,
    'aria-label': p.ariaLabel,
    className: p.className,
    height: p.height || p.size || p.width,
    width: p.width || p.size || p.height,
    role: 'img',
    viewBox: '0 0 32 32'
  };
  return (
    <svg viewBox="0 0 32 32" {...props}>
      <path fillRule="evenodd" d="M13.4196 3H13.9999H17.9999H18.5803L18.8682 3.50386L30.8682 24.5039L31.1748 25.0405L30.832 25.5547L28.832 28.5547L28.5351 29H27.9999H3.99995H3.46476L3.1679 28.5547L1.1679 25.5547L0.825073 25.0405L1.1317 24.5039L13.1317 3.50386L13.4196 3ZM14.5803 5L3.17482 24.9595L4.53513 27H27.4648L28.8251 24.9595L17.4196 5H14.5803ZM14.5001 21H17.5001V24H14.5001V21ZM16.9801 18L16.9799 11L15.0203 11L15.0205 18L16.9801 18Z" />
    </svg>
  );
};

export default SvgIconError;
