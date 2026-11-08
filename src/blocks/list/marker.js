const CHECK_PATH = 'M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z';
const ARROW_PATH = 'M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z';

/**
 * Render the marker for a list item based on the selected style.
 *
 * @param {Object} props       Component props.
 * @param {string} props.style Marker style.
 * @param {number} props.index Item index used by the numbered style.
 * @return {Element} Marker element.
 */
export default function ListMarker({ style, index }) {
  const className = `bw-list__marker bw-list__marker--${style}`;

  if (style === 'check' || style === 'arrow') {
    return (
      <span className={className} aria-hidden="true">
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <path d={style === 'arrow' ? ARROW_PATH : CHECK_PATH}></path>
        </svg>
      </span>
    );
  }

  if (style === 'number') {
    return (
      <span className={className} aria-hidden="true">
        {index + 1}
      </span>
    );
  }

  return <span className={className} aria-hidden="true"></span>;
}
