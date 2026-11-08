/**
 * A rating icon with partial fill support and a configurable shape.
 * Markup matches star.js exactly when given the star path.
 *
 * @param {Object} props         Component props.
 * @param {number} props.percent Fill percentage between 0 and 100.
 * @param {string} props.path    SVG path data.
 * @return {Element} Icon element.
 */
export default function ShapeStar({ percent, path }) {
  return (
    <span className="bw-rating__star" aria-hidden="true">
      <svg
        className="bw-rating__icon bw-rating__icon--empty"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        focusable="false"
      >
        <path d={path}></path>
      </svg>
      <span className="bw-rating__fill" style={{ width: `${percent}%` }}>
        <svg
          className="bw-rating__icon bw-rating__icon--filled"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          focusable="false"
        >
          <path d={path}></path>
        </svg>
      </span>
    </span>
  );
}
