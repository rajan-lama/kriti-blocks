import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getColumnsOptions, joinClasses } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { colMd } = attributes;
  const options = getColumnsOptions(attributes);

  const blockProps = useBlockProps.save({
    className: joinClasses(colMd, options.classes) || colMd,
  });

  return (
    <div {...blockProps}>
      <div className="row" style={options.rowStyle}>
        <InnerBlocks.Content />
      </div>
    </div>
  );
}
