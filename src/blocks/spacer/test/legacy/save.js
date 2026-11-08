import { useBlockProps } from '@wordpress/block-editor';
import { getSpacerStyles } from '../../helpers';

// (style import removed for tests)

export default function save({ attributes }) {
  const { htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getSpacerStyles(attributes),
  });

  return <div {...blockProps} aria-hidden="true" />;
}
