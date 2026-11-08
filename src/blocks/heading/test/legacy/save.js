import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getHeadingStyles } from '../../helpers';

// (style import removed for tests)

export default function save({ attributes }) {
  const { tagType, content, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getHeadingStyles(attributes),
  });

  return <RichText.Content {...blockProps} tagName={tagType} value={content} />;
}
