import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getCardStyles } from '../../helpers';

export default function save({ attributes }) {
  const {
    cardImageUrl,
    cardImageAlt,
    cardPadding,
    tagType,
    htmlId,
    extraClass,
  } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, `bw-card-padding-${cardPadding || 'medium'}`]
        .filter(Boolean)
        .join(' ') || undefined,
    style: getCardStyles(attributes),
  });

  const Tag = tagType;

  return (
    <Tag {...blockProps}>
      {cardImageUrl && (
        <div className="bw-card-media">
          <img src={cardImageUrl} alt={cardImageAlt || ''} loading="lazy" />
        </div>
      )}
      <div className="bw-card-body">
        <InnerBlocks.Content />
      </div>
    </Tag>
  );
}
