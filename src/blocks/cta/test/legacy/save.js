import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getCtaStyles } from '../../helpers';

export default function save({ attributes }) {
  const { tagType, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getCtaStyles(attributes),
  });

  const Tag = tagType;

  return (
    <Tag {...blockProps}>
      <div className="bw-cta-content">
        <InnerBlocks.Content />
      </div>
    </Tag>
  );
}
