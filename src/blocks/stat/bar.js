/**
 * Progress bar shown under the number when the option is on.
 *
 * @param {Object} props         Component props.
 * @param {number} props.percent Fill between 0 and 100.
 * @return {Element} Bar element.
 */
export default function ProgressBar({ percent }) {
  const value = Math.round(percent * 100) / 100;
  return (
    <div
      className="bw-stat-bar"
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="100"
      aria-valuenow={value}
    >
      <span className="bw-stat-bar-fill" style={{ width: `${value}%` }}></span>
    </div>
  );
}
