import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import Inspector from './inspector';
import { getTimelineStyles } from './helpers';
import { getTimelineOptions } from './options';

import './editor.scss';

const TEMPLATE = [
  ['kriti-blocks/timeline-item'],
  ['kriti-blocks/timeline-item'],
  ['kriti-blocks/timeline-item'],
];

const ALLOWED_BLOCKS = ['kriti-blocks/timeline-item'];

export default function Edit({ attributes, setAttributes }) {
  const { htmlId, extraClass } = attributes;

  const options = getTimelineOptions(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: { ...getTimelineStyles(attributes), ...options.style },
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
