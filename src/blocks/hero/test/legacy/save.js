import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getHeroStyles, getHeroContentWidth } from '../../helpers';

// (style import removed for tests)

export default function save({ attributes }) {
  const { htmlId, extraClass, contentAlign, contentWidth } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getHeroStyles(attributes),
  });

  const contentStyle = {
    textAlign: contentAlign,
    maxWidth: getHeroContentWidth(contentWidth),
  };

  return (
    <div {...blockProps}>
      <div className="bw-hero-content" style={contentStyle}>
        <InnerBlocks.Content />
      </div>
    </div>
  );
}
