import { useBlockProps, RichText } from '@wordpress/block-editor';
import { sprintf, __ } from '@wordpress/i18n';

import Star from '../../star';
import {
  getDisplayValue,
  getRatingClassName,
  getRatingStyles,
  getStarFillPercent,
} from '../../helpers';

// (style import removed for tests)

const MIN_STARS = 1;
const MAX_STARS = 10;

export default function save({ attributes }) {
  const { ratingValue, maxRating, showValue, ratingLabel, htmlId } = attributes;

  const starCount = Math.min(
    Math.max(parseInt(maxRating, 10) || 5, MIN_STARS),
    MAX_STARS,
  );

  const ariaLabel = sprintf(
    /* translators: 1: rating value, 2: maximum rating. */
    __('Rated %1$s out of %2$s', 'kriti-blocks'),
    getDisplayValue(ratingValue),
    starCount,
  );

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: getRatingClassName(attributes),
    style: getRatingStyles(attributes),
  });

  return (
    <div {...blockProps} role="img" aria-label={ariaLabel}>
      <span className="bw-rating__stars">
        {Array.from({ length: starCount }).map((_, index) => (
          <Star key={index} percent={getStarFillPercent(ratingValue, index)} />
        ))}
      </span>
      {showValue && (
        <span className="bw-rating__value">{getDisplayValue(ratingValue)}</span>
      )}
      {ratingLabel && (
        <RichText.Content
          tagName="span"
          className="bw-rating__label"
          value={ratingLabel}
        />
      )}
    </div>
  );
}
