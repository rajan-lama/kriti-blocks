import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import Inspector from './inspector';
import { getColumnOptions, joinClasses } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { colMd } = attributes;
  const options = getColumnOptions(attributes);

  const blockProps = useBlockProps({
    className: joinClasses(colMd || '', options.classes),
    style: options.style,
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <InnerBlocks
          template={[['core/paragraph', { placeholder: 'Add content...' }]]}
          templateLock={false}
        />
      </div>
    </>
  );
}
