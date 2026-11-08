import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getGridStyles } from './helpers';
import { getGridOptionClasses, joinClasses } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { tagType, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      joinClasses(extraClass, getGridOptionClasses(attributes)) || undefined,
    style: getGridStyles(attributes),
  });

  const Tag = tagType;

  return (
    <Tag {...blockProps}>
      <InnerBlocks.Content />
    </Tag>
  );
}
