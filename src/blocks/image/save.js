import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getFigureStyles, getImageStyles } from './helpers';
import { getFigureClass, getImageExtras, getImageLink } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { url, alt, caption, htmlId } = attributes;

  if (!url) {
    return null;
  }

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: getFigureClass(attributes),
    style: getFigureStyles(attributes),
  });

  const image = (
    <img
      className="bw-image"
      src={url}
      alt={alt || ''}
      style={{
        ...getImageStyles(attributes),
        ...getImageExtras(attributes).imgStyle,
      }}
    />
  );
  const link = getImageLink(attributes);

  return (
    <figure {...blockProps}>
      {link ? <a {...link}>{image}</a> : image}
      {caption && <RichText.Content tagName="figcaption" value={caption} />}
    </figure>
  );
}
