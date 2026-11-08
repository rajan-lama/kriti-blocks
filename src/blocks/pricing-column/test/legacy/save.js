import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getPricingColumnStyles, getFeatureItems } from '../../helpers';

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

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, isHighlight ? 'is-featured' : '']
        .filter(Boolean)
        .join(' ') || undefined,
    style: getPricingColumnStyles(attributes),
  });

  const Tag = tagType;

  return (
    <Tag {...blockProps}>
      {isHighlight && (
        <span className="bw-pricing-badge">
          {__('Featured', 'kriti-blocks')}
        </span>
      )}
      {planName && (
        <RichText.Content
          tagName="h4"
          className="bw-pricing-plan"
          value={planName}
        />
      )}
      {(planPrice || planPeriod) && (
        <div className="bw-pricing-amount">
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
          {featureItems.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      )}
      {buttonText && buttonUrl && (
        <a className="bw-pricing-button" href={buttonUrl}>
          {buttonText}
        </a>
      )}
      {buttonText && !buttonUrl && (
        <span className="bw-pricing-button">{buttonText}</span>
      )}
    </Tag>
  );
}
