import * as React from 'react';

const SvgIconSettings = (p): JSX.Element => {
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
      <path fillRule="evenodd" d="M8 5a3 3 0 100 6 3 3 0 000-6zM6 8a2 2 0 114 0 2 2 0 01-4 0z M5.97 1l-.42 2.075c-.204.101-.401.215-.59.34l-2.004-.672L.926 6.26l1.584 1.4a5.58 5.58 0 000 .679L.926 9.74l2.03 3.517 2.005-.672c.188.125.385.238.588.34L5.97 15h4.061l.42-2.075c.204-.101.401-.215.59-.34l2.004.672 2.03-3.518-1.584-1.4a5.622 5.622 0 000-.679l1.584-1.399-2.03-3.518-2.005.672a5.49 5.49 0 00-.588-.34L10.03 1H5.97zm.818 1h2.424l.36 1.774.237.104c.304.134.59.3.854.494l.21.154 1.714-.575 1.212 2.102-1.354 1.196.028.257a4.57 4.57 0 010 .988l-.028.257L13.8 9.947l-1.212 2.102-1.714-.575-.21.154a4.49 4.49 0 01-.854.494l-.237.104L9.212 14H6.788l-.36-1.774-.237-.104c-.304-.134-.59-.3-.854-.494l-.21-.154-1.714.575-1.212-2.102 1.354-1.196-.028-.257a4.555 4.555 0 010-.988l.028-.257L2.2 6.053 3.413 3.95l1.715.575.209-.154c.264-.194.55-.36.854-.494l.237-.104L6.788 2z" />
    </svg>
  );
};

export default SvgIconSettings;
