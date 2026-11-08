import { useBlockProps } from '@wordpress/block-editor';
import { getIconExtras, getIconProps } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { size, color, bgColor, padding, borderRadius, svg } = attributes;

  // Prepare inline styles for the icon
  const style = {
    '--bw-icon-size': `${size}px`,
    '--bw-icon-color': color,
    '--bw-icon-bg': bgColor,
    '--bw-icon-padding': `${padding}px`,
    '--bw-icon-radius': `${borderRadius}px`,
  };

  const blockProps = useBlockProps.save(getIconProps(attributes, style));
  const { link, label } = getIconExtras(attributes);

  const icon = svg && (
    <div className="bw-icon" dangerouslySetInnerHTML={{ __html: svg }} />
  );

  if (!link && !label) {
    return <div {...blockProps}>{icon}</div>;
  }

  const inner = (
    <div className="bw-icon-inner">
      {icon}
      {label && <span className="bw-icon-label">{label}</span>}
    </div>
  );

  return <div {...blockProps}>{link ? <a {...link}>{inner}</a> : inner}</div>;
}
