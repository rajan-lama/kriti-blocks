import { useBlockProps, RichText } from '@wordpress/block-editor';
import { sprintf, __ } from '@wordpress/i18n';

import ShapeStar from './shape-star';
import {
  getDisplayValue,
  getRatingClassName,
  getRatingStyles,
  getStarFillPercent,
} from './helpers';
import {
  getFillValue,
  getRatingProps,
  getSchema,
  getShapePath,
  getVoteId,
} from './options';

import './style.scss';

const MIN_STARS = 1;
const MAX_STARS = 10;

export default function save({ attributes }) {
  const { ratingValue, maxRating, showValue, ratingLabel, htmlId, showMax } =
    attributes;

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
    'data-kb-vote': getVoteId(attributes),
    ...getRatingProps(
      attributes,
      getRatingClassName(attributes),
      getRatingStyles(attributes),
    ),
  });

  const fillValue = getFillValue(attributes);
  const path = getShapePath(attributes);
  const schema = getSchema(attributes);
  const schemaProps = schema
    ? {
        itemScope: true,
        itemType: 'https://schema.org/AggregateRating',
      }
    : {};

  return (
    <div {...blockProps} {...schemaProps} role="img" aria-label={ariaLabel}>
      <span className="bw-rating__stars">
        {Array.from({ length: starCount }).map((_, index) => (
          <ShapeStar
            key={index}
            path={path}
            percent={getStarFillPercent(fillValue, index)}
          />
        ))}
      </span>
      {showValue && (
        <span className="bw-rating__value">
          {showMax === true
            ? `${getDisplayValue(ratingValue)} / ${starCount}`
            : getDisplayValue(ratingValue)}
        </span>
      )}
      {schema && (
        <>
          <span
            itemProp="itemReviewed"
            itemScope
            itemType="https://schema.org/Thing"
          >
            <meta itemProp="name" content={schema.name} />
          </span>
          <meta itemProp="ratingValue" content={getDisplayValue(ratingValue)} />
          <meta itemProp="bestRating" content={starCount} />
          <meta itemProp="ratingCount" content={schema.count} />
        </>
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
