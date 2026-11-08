import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import Inspector from './inspector';
import { getCoverStyles } from './helpers';
import { CoverVideo, ScrollDown } from '../../shared/kbsb-cover-media';
import { getContentProps, getCoverProps } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { tagType, htmlId } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    ...getCoverProps(attributes, getCoverStyles(attributes)),
  });

  const Tag = tagType;

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <Tag {...blockProps}>
        <CoverVideo attributes={attributes} />
        <div className="bw-cover-content" {...getContentProps(attributes)}>
          <InnerBlocks />
        </div>
        <ScrollDown attributes={attributes} />
      </Tag>
    </>
  );
}
