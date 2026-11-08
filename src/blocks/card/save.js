import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getCardStyles } from './helpers';
import { getCardOptions } from './options';

import './style.scss';

export default function save({ attributes }) {
  const {
    cardImageUrl,
    cardImageAlt,
    cardPadding,
    tagType,
    htmlId,
    extraClass,
  } = attributes;

  const options = getCardOptions(attributes);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [
        extraClass,
        `bw-card-padding-${cardPadding || 'medium'}`,
        ...options.classes,
      ]
        .filter(Boolean)
        .join(' ') || undefined,
    style: { ...getCardStyles(attributes), ...options.style },
  });

  const Tag = tagType;

  return (
    <Tag {...blockProps}>
      {options.badge && <span className="bw-card-badge">{options.badge}</span>}
      {cardImageUrl && (
        <div className="bw-card-media">
          <img src={cardImageUrl} alt={cardImageAlt || ''} loading="lazy" />
        </div>
      )}
      <div className="bw-card-body">
        <InnerBlocks.Content />
      </div>
      {options.link && (
        <a
          className="bw-card-link"
          href={options.link.href}
          target={options.link.target}
          rel={options.link.rel}
          aria-label={options.link.label || __('Read more', 'kriti-blocks')}
        ></a>
      )}
    </Tag>
  );
}
