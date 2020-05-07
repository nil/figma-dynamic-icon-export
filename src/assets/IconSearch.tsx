import * as React from 'react';

const SvgIconSearch = (p): JSX.Element => {
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
      <path fillRule="evenodd" d="M7 3a4 4 0 100 8 4 4 0 000-8zM2 7a5 5 0 118.871 3.164l3.983 3.982-.708.708-3.982-3.982A5 5 0 012 7z" />
    </svg>
  );
};

export default SvgIconSearch;
