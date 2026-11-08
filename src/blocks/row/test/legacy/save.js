import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getRowStyles } from './helpers';

import '../../style.scss';

export default function save({ attributes }) {
  const { tagType, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getRowStyles(attributes),
  });

  const Tag = tagType;

  return (
    <Tag {...blockProps}>
      <InnerBlocks.Content />
    </Tag>
  );
}
