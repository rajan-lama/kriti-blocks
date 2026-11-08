import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import Inspector from './inspector';
import { getPricingTableOptions } from './options';

import './editor.scss';

const TEMPLATE = [
  ['kriti-blocks/pricing-column'],
  ['kriti-blocks/pricing-column'],
  ['kriti-blocks/pricing-column'],
];

const ALLOWED_BLOCKS = ['kriti-blocks/pricing-column'];

export default function Edit({ attributes, setAttributes }) {
  const { htmlId, extraClass } = attributes;

  const options = getPricingTableOptions(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: Object.keys(options.style).length ? options.style : undefined,
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <InnerBlocks
          template={TEMPLATE}
          allowedBlocks={ALLOWED_BLOCKS}
          templateInsertUpdatesSelection={false}
          renderAppender={InnerBlocks.ButtonBlockAppender}
        />
      </div>
    </>
  );
}
