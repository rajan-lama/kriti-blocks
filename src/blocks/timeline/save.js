import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getTimelineStyles } from './helpers';
import { getTimelineOptions } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { htmlId, extraClass } = attributes;

  const options = getTimelineOptions(attributes);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: { ...getTimelineStyles(attributes), ...options.style },
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}
