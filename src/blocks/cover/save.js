import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getCoverStyles } from './helpers';
import { CoverVideo, ScrollDown } from '../../shared/kbsb-cover-media';
import { getContentProps, getCoverProps } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { tagType, htmlId } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    ...getCoverProps(attributes, getCoverStyles(attributes)),
  });

  const Tag = tagType;

  return (
    <Tag {...blockProps}>
      <CoverVideo attributes={attributes} />
      <div className="bw-cover-content" {...getContentProps(attributes)}>
        <InnerBlocks.Content />
      </div>
      <ScrollDown attributes={attributes} />
    </Tag>
  );
}
