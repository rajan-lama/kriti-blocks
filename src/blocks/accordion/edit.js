import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import Inspector from './inspector';
import { getDisclosureProps, joinClasses } from '../../shared/disclosure';

import './editor.scss';

const TEMPLATE = [
  ['kriti-blocks/accordion-item'],
  ['kriti-blocks/accordion-item'],
];

const ALLOWED_BLOCKS = ['kriti-blocks/accordion-item'];

export default function Edit({ attributes, setAttributes }) {
  const { htmlId, extraClass } = attributes;

  const group = getDisclosureProps(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className: joinClasses(extraClass, group.classes),
    style: Object.keys(group.style).length ? group.style : undefined,
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
