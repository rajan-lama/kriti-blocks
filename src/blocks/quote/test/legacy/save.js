import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getQuoteStyles } from '../../helpers';

// (style import removed for tests)

export default function save({ attributes }) {
  const { content, citation, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getQuoteStyles(attributes),
  });

  return (
    <blockquote {...blockProps}>
      {content && (
        <RichText.Content
          tagName="p"
          className="bw-quote-content"
          value={content}
        />
      )}
      {citation && (
        <RichText.Content
          tagName="cite"
          className="bw-quote-citation"
          value={citation}
        />
      )}
    </blockquote>
  );
}
