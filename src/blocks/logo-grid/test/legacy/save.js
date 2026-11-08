import { useBlockProps } from '@wordpress/block-editor';

// (style import removed for tests)

export default function save({ attributes }) {
  const { logos, logoColumns, grayscale, htmlId, extraClass } = attributes;

  const items = Array.isArray(logos) ? logos : [];
  const columnCount = logoColumns || 4;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [
        extraClass,
        `bw-logo-cols-${columnCount}`,
        grayscale ? '' : 'bw-logo-grid-color',
      ]
        .filter(Boolean)
        .join(' ') || undefined,
  });

  return (
    <div {...blockProps}>
      {items.map((item, index) => (
        <div className="bw-logo-cell" key={item.id || index}>
          <img src={item.url} alt={item.alt || ''} loading="lazy" />
        </div>
      ))}
    </div>
  );
}
