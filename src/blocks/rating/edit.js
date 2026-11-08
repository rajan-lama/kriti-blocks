import { useBlockProps, RichText } from '@wordpress/block-editor';
import { sprintf, __ } from '@wordpress/i18n';

import Inspector from './inspector';
import ShapeStar from './shape-star';
import {
  getDisplayValue,
  getRatingClassName,
  getRatingStyles,
  getStarFillPercent,
} from './helpers';
import { getFillValue, getRatingProps, getShapePath } from './options';

import './editor.scss';

const MIN_STARS = 1;
const MAX_STARS = 10;

export default function Edit({ attributes, setAttributes }) {
  const { ratingValue, maxRating, showValue, ratingLabel, showMax } =
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

  const blockProps = useBlockProps({
    id: attributes.htmlId || undefined,
    ...getRatingProps(
      attributes,
      getRatingClassName(attributes),
      getRatingStyles(attributes),
    ),
  });

  const fillValue = getFillValue(attributes);
  const path = getShapePath(attributes);

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps} role="img" aria-label={ariaLabel}>
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
        <RichText
          tagName="span"
          className="bw-rating__label"
          value={ratingLabel}
          onChange={(value) => setAttributes({ ratingLabel: value })}
          placeholder={__('Based on 120 reviews', 'kriti-blocks')}
        />
      </div>
    </>
  );
}
