import { useBlockProps } from '@wordpress/block-editor';
import { getLogoLink, getLogoProps } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { logos, logoColumns, grayscale, htmlId, extraClass } = attributes;

  const items = Array.isArray(logos) ? logos : [];
  const columnCount = logoColumns || 4;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    ...getLogoProps(
      attributes,
      [
        extraClass,
        `bw-logo-cols-${columnCount}`,
        grayscale ? '' : 'bw-logo-grid-color',
      ]
        .filter(Boolean)
        .join(' '),
    ),
  });

  return (
    <div {...blockProps}>
      {items.map((item, index) => {
        const image = (
          <img src={item.url} alt={item.alt || ''} loading="lazy" />
        );
        const link = getLogoLink(item);
        return (
          <div className="bw-logo-cell" key={item.id || index}>
            {link ? <a {...link}>{image}</a> : image}
          </div>
        );
      })}
    </div>
  );
}
