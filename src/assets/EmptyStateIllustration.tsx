import * as React from 'react';

const SvgEmptyStateIllustration = (p): JSX.Element => {
  const props = {
    'aria-hidden': !p.ariaLabel,
    'aria-label': p.ariaLabel,
    className: p.className,
    height: p.height || p.size || p.width,
    width: p.width || p.size || p.height,
    role: 'img',
    viewBox: '0 0 128 72'
  };
  return (
    <svg viewBox="0 0 128 72" {...props}>
      <path d="M8 0H0v8h8V0zm0 64H0v8h8v-8zM120 0h8v8h-8V0zm8 64h-8v8h8v-8z" />
      <path fill="#FFFFFF" d="M0 0v-4h-4v4h4zm8 0h4v-4H8v4zM0 8h-4v4h4V8zm8 0v4h4V8H8zM0 64v-4h-4v4h4zm8 0h4v-4H8v4zm-8 8h-4v4h4v-4zm8 0v4h4v-4H8zM128 0h4v-4h-4v4zm-8 0v-4h-4v4h4zm8 8v4h4V8h-4zm-8 0h-4v4h4V8zm0 56v-4h-4v4h4zm8 0h4v-4h-4v4zm-8 8h-4v4h4v-4zm8 0v4h4v-4h-4zM0 4h8v-8H0v8zm4 4V0h-8v8h8zm4-4H0v8h8V4zM4 0v8h8V0H4zM0 68h8v-8H0v8zm4 4v-8h-8v8h8zm4-4H0v8h8v-8zm-4-4v8h8v-8H4zM128-4h-8v8h8v-8zm4 12V0h-8v8h8zm-12 4h8V4h-8v8zm-4-12v8h8V0h-8zm4 68h8v-8h-8v8zm4 4v-8h-8v8h8zm4-4h-8v8h8v-8zm-4-4v8h8v-8h-8z" />
      <path fill="#000000" d="M65.5 51.398c6.42 0 10.114-5.44 10.114-14.944 0-9.431-3.75-14.943-10.114-14.943-6.364 0-10.114 5.512-10.114 14.943 0 9.503 3.694 14.944 10.114 14.944zm0-3.125c-1.506 0-2.798-.54-3.82-1.577L70.755 28.3c.937 2.003 1.449 4.744 1.449 8.153 0 7.571-2.472 11.819-6.705 11.819zm-5.284-3.736c-.923-1.975-1.42-4.688-1.42-8.083 0-7.556 2.5-11.875 6.704-11.875 1.477 0 2.756.54 3.778 1.563l-9.062 18.395z" />
      <path fill="#18A0FB" fillRule="evenodd" d="M7 1H1v6h6V1zM1 0H0v8h3v56H0v8h8v-3h112v3h8v-8h-3V8h3V0h-8v3H8V0H1zm123 64V8h-4V4H8v4H4v56h4v4h112v-4h4zM1 71v-6h6v6H1zM127 1h-6v6h6V1zm-6 64h6v6h-6v-6z M86 51.5H45v-1h41v1z" />
    </svg>
  );
};

export default SvgEmptyStateIllustration;
