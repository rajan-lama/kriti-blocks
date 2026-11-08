import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getTimelineStyles } from '../../helpers';

export default function save({ attributes }) {
  const { htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getTimelineStyles(attributes),
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}
