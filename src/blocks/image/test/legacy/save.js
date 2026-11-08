import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getFigureStyles, getImageStyles } from '../../helpers';

// (style import removed for tests)

export default function save({ attributes }) {
  const { url, alt, caption, htmlId, extraClass } = attributes;

  if (!url) {
    return null;
  }

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getFigureStyles(attributes),
  });

  return (
    <figure {...blockProps}>
      <img
        className="bw-image"
        src={url}
        alt={alt || ''}
        style={getImageStyles(attributes)}
      />
      {caption && <RichText.Content tagName="figcaption" value={caption} />}
    </figure>
  );
}
