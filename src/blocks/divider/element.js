import { getDividerStyles } from './helpers';
import {
  ICONS,
  getDividerLabel,
  getDividerShape,
  getLabelLineStyle,
} from './options';

/**
 * The divider line, or the line with a text and icon in the middle.
 * The plain line markup is unchanged.
 *
 * @param {Object} props            Component props.
 * @param {Object} props.attributes Block attributes.
 * @return {Element} Divider element.
 */
export default function DividerElement({ attributes }) {
  const label = getDividerLabel(attributes);
  const style = getDividerStyles(attributes);
  const shape = getDividerShape(attributes);

  if (shape) {
    return (
      <div
        className="bw-divider-shape"
        style={{
          width: style.width,
          marginLeft: style.marginLeft,
          marginRight: style.marginRight,
          height: `${shape.height}px`,
          color: shape.color,
          transform: shape.flip ? 'scaleY(-1)' : undefined,
        }}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          width="100%"
          height="100%"
          fill="currentColor"
        >
          <path d={shape.path}></path>
        </svg>
      </div>
    );
  }

  if (!label) {
    return <hr className="bw-divider" style={style} />;
  }

  const lineStyle = getLabelLineStyle(attributes);

  return (
    <div
      className="bw-divider-labeled"
      style={{
        width: style.width,
        marginLeft: style.marginLeft,
        marginRight: style.marginRight,
      }}
    >
      <span className="bw-divider-line" style={lineStyle}></span>
      <span className="bw-divider-label">
        {label.icon && (
          <svg
            className="bw-divider-icon"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d={ICONS[label.icon]}></path>
          </svg>
        )}
        {label.text}
      </span>
      <span className="bw-divider-line" style={lineStyle}></span>
    </div>
  );
}
