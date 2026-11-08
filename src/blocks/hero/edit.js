import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import Inspector from './inspector';
import { getHeroStyles, getHeroContentWidth } from './helpers';
import { CoverVideo, ScrollDown } from '../../shared/kbsb-cover-media';
import { getHeroContentStyle, getHeroProps } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { htmlId, contentAlign, contentWidth } = attributes;

  const blockProps = useBlockProps({
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
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <CoverVideo attributes={attributes} />
        <div className="bw-hero-content" style={contentStyle}>
          <InnerBlocks />
        </div>
        <ScrollDown attributes={attributes} />
      </div>
    </>
  );
}
