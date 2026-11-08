import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getStickyStyleVars } from './helpers';
import { getStickyOptionClasses } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { stickyOffset, showShadow, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, 'bw-sticky', ...getStickyOptionClasses(attributes)]
        .filter(Boolean)
        .join(' ') || undefined,
    style: getStickyStyleVars(attributes),
    'data-offset': stickyOffset,
    'data-shadow': showShadow ? 'true' : 'false',
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}
