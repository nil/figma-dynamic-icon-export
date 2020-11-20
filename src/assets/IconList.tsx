import * as React from 'react';

const SvgIconList = (p): JSX.Element => {
  const props = {
    'aria-hidden': !p.ariaLabel,
    'aria-label': p.ariaLabel,
    className: p.className,
    height: p.height || p.size || p.width,
    width: p.width || p.size || p.height,
    role: 'img',
    viewBox: '0 0 16 16'
  };
  return (
    <svg viewBox="0 0 16 16" {...props}>
      <path fillRule="evenodd" d="M14 13H7v-1h7v1zM14 7H7V6h7v1zM14 4H7V3h7v1z M4.75 12.5a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0zM4.75 3.5a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z M14 10H7V9h7v1z M4.75 8a1.25 1.25 0 11-2.5 0 1.25 1.25 0 012.5 0z" />
    </svg>
  );
};

export default SvgIconList;
