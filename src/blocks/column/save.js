import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getColumnOptions, joinClasses } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { colMd } = attributes;
  const options = getColumnOptions(attributes);

  const blockProps = useBlockProps.save({
    className: joinClasses(colMd || '', options.classes),
    style: options.style,
  });

  return (
    <div {...blockProps}>
      <InnerBlocks.Content />
    </div>
  );
}
