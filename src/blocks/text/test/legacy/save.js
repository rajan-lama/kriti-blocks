import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getTextStyles, getTextClasses } from '../../helpers';

// (style import removed for tests)

export default function save({ attributes }) {
  const { tagType, content, htmlId, extraClass } = attributes;

  const className = [extraClass, getTextClasses(attributes)]
    .filter(Boolean)
    .join(' ');

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: className || undefined,
    style: getTextStyles(attributes),
  });

  return <RichText.Content {...blockProps} tagName={tagType} value={content} />;
}
