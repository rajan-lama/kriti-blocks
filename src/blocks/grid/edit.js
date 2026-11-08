import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import Inspector from './inspector';
import { getGridStyles } from './helpers';
import { getGridOptionClasses, joinClasses } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { tagType, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      joinClasses(extraClass, getGridOptionClasses(attributes)) || undefined,
    style: getGridStyles(attributes),
  });

  const Tag = tagType;

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <Tag {...blockProps}>
        <InnerBlocks />
      </Tag>
    </>
  );
}
