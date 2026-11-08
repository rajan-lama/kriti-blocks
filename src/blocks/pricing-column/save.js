import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getPricingColumnStyles, getFeatureItems } from './helpers';
import { getPricingColumnOptions, parseFeature } from './options';

import './style.scss';

export default function save({ attributes }) {
  const {
    planName,
    planPrice,
    planPeriod,
    features,
    buttonText,
    buttonUrl,
    isHighlight,
    tagType,
    htmlId,
    extraClass,
  } = attributes;

  const featureItems = getFeatureItems(features);
  const options = getPricingColumnOptions(attributes);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, isHighlight ? 'is-featured' : '', ...options.classes]
        .filter(Boolean)
        .join(' ') || undefined,
    style: { ...getPricingColumnStyles(attributes), ...options.style },
  });

  const Tag = tagType;

  return (
    <Tag {...blockProps}>
      {(isHighlight || options.badgeText) && (
        <span className="bw-pricing-badge">
          {options.badgeText || __('Featured', 'kriti-blocks')}
        </span>
      )}
      {planName && (
        <RichText.Content
          tagName="h4"
          className="bw-pricing-plan"
          value={planName}
        />
      )}
      {(planPrice || planPeriod || options.originalPrice) && (
        <div
          className="bw-pricing-amount"
          data-yearly-price={options.yearlyPrice || undefined}
          data-yearly-period={options.yearlyPeriod || undefined}
        >
          {options.originalPrice && (
            <del className="bw-pricing-original">{options.originalPrice}</del>
          )}
          {planPrice && options.currency && (
            <span className="bw-pricing-currency">{options.currency}</span>
          )}
          {planPrice && (
            <RichText.Content
              tagName="span"
              className="bw-pricing-price"
              value={planPrice}
            />
          )}
          {planPeriod && (
            <RichText.Content
              tagName="span"
              className="bw-pricing-period"
              value={planPeriod}
            />
          )}
        </div>
      )}
      {featureItems.length > 0 && (
        <ul className="bw-pricing-features">
          {featureItems.map((item, index) => {
            const feature = parseFeature(item, options.markers);
            return (
              <li
                key={index}
                className={feature.excluded ? 'is-excluded' : undefined}
              >
                {feature.text}
              </li>
            );
          })}
        </ul>
      )}
      {buttonText && buttonUrl && (
        <a
          className={options.buttonClass}
          href={buttonUrl}
          target={options.target}
          rel={options.rel}
        >
          {buttonText}
        </a>
      )}
      {buttonText && !buttonUrl && (
        <span className={options.buttonClass}>{buttonText}</span>
      )}
    </Tag>
  );
}
