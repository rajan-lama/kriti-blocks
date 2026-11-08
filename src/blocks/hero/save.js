import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getHeroStyles, getHeroContentWidth } from './helpers';
import { CoverVideo, ScrollDown } from '../../shared/kbsb-cover-media';
import { getHeroContentStyle, getHeroProps } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { htmlId, contentAlign, contentWidth } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    ...getHeroProps(attributes, getHeroStyles(attributes)),
  });

  const contentStyle = getHeroContentStyle(
    {
      textAlign: contentAlign,
      maxWidth: getHeroContentWidth(contentWidth),
    },
    attributes,
  );

  return (
    <div {...blockProps}>
      <CoverVideo attributes={attributes} />
      <div className="bw-hero-content" style={contentStyle}>
        <InnerBlocks.Content />
      </div>
      <ScrollDown attributes={attributes} />
    </div>
  );
}
