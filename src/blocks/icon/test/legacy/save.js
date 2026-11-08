import { useBlockProps } from '@wordpress/block-editor';

// (style import removed for tests)

export default function save({ attributes }) {
  const { icon, size, color, bgColor, padding, borderRadius, svg } = attributes;

  // Prepare inline styles for the icon
  const style = {
    '--bw-icon-size': `${size}px`,
    '--bw-icon-color': color,
    '--bw-icon-bg': bgColor,
    '--bw-icon-padding': `${padding}px`,
    '--bw-icon-radius': `${borderRadius}px`,
  };

  const blockProps = useBlockProps.save({ style });

  return (
    <div {...blockProps}>
      {svg && (
        <div className="bw-icon" dangerouslySetInnerHTML={{ __html: svg }} />
      )}
    </div>
  );
}
