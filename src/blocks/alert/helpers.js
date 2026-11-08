/**
 * Get the SVG icon for the given alert type.
 *
 * @param {string} alertType Alert type key.
 * @return {Object|null} JSX element or null.
 */
export const getAlertIcon = (alertType) => {
  const props = {
    width: '20',
    height: '20',
    viewBox: '0 0 24 24',
    fill: 'currentColor',
    'aria-hidden': 'true',
  };

  switch (alertType) {
    case 'success':
      return (
        <svg {...props}>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1.2 14.2l-4-4 1.4-1.4 2.6 2.6 5.8-5.8 1.4 1.4-7.2 7.2z"></path>
        </svg>
      );
    case 'warning':
      return (
        <svg {...props}>
          <path d="M1 21h22L12 2 1 21zm10-3h2v2h-2v-2zm0-6h2v4h-2v-4z"></path>
        </svg>
      );
    case 'error':
      return (
        <svg {...props}>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm-1 5h2v6h-2V7zm0 8h2v2h-2v-2z"></path>
        </svg>
      );
    case 'info':
    default:
      return (
        <svg {...props}>
          <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"></path>
        </svg>
      );
  }
};
