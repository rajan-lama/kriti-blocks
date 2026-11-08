import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import Inspector from './inspector';
import { getCtaStyles } from './helpers';
import { getCtaOptions } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { tagType, htmlId, extraClass } = attributes;

  const options = getCtaOptions(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: { ...getCtaStyles(attributes), ...options.style },
  });

  const Tag = tagType;

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <Tag {...blockProps}>
        <div className="bw-cta-content">
          <InnerBlocks />
        </div>
      </Tag>
    </>
  );
}
