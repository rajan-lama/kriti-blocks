import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getFigureStyles, getVideoProps } from '../../helpers';

// (style import removed for tests)

export default function save({ attributes }) {
  const { url, caption, htmlId, extraClass } = attributes;

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
      <video
        className="bw-video"
        src={url}
        style={{ width: '100%', display: 'block' }}
        {...getVideoProps(attributes)}
      />
      {caption && <RichText.Content tagName="figcaption" value={caption} />}
    </figure>
  );
}
