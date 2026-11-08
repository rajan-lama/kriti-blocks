import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getPricingColumnStyles, getFeatureItems } from './helpers';
import { getPricingColumnOptions, parseFeature } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const {
    planName,
    planPrice,
    planPeriod,
    features,
    buttonText,
    isHighlight,
    tagType,
    htmlId,
    extraClass,
  } = attributes;

  const featureItems = getFeatureItems(features);
  const options = getPricingColumnOptions(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, isHighlight ? 'is-featured' : '', ...options.classes]
        .filter(Boolean)
        .join(' ') || undefined,
    style: { ...getPricingColumnStyles(attributes), ...options.style },
  });

  const Tag = tagType;

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <Tag {...blockProps}>
        {(isHighlight || options.badgeText) && (
          <span className="bw-pricing-badge">
            {options.badgeText || __('Featured', 'kriti-blocks')}
          </span>
        )}
        <RichText
          tagName="h4"
          className="bw-pricing-plan"
          value={planName}
          onChange={(value) => setAttributes({ planName: value })}
          placeholder={__('Plan name', 'kriti-blocks')}
        />
        <div className="bw-pricing-amount">
          {options.originalPrice && (
            <del className="bw-pricing-original">{options.originalPrice}</del>
          )}
          {options.currency && (
            <span className="bw-pricing-currency">{options.currency}</span>
          )}
          <RichText
            tagName="span"
            className="bw-pricing-price"
            value={planPrice}
            onChange={(value) => setAttributes({ planPrice: value })}
            placeholder={__('$29', 'kriti-blocks')}
          />
          <RichText
            tagName="span"
            className="bw-pricing-period"
            value={planPeriod}
            onChange={(value) => setAttributes({ planPeriod: value })}
            placeholder={__('/ month', 'kriti-blocks')}
          />
        </div>
        {featureItems.length > 0 ? (
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
        ) : (
          <p className="bw-pricing-features-hint">
            {__(
              'Add features in block settings, one per line.',
              'kriti-blocks',
            )}
          </p>
        )}
        <span className={options.buttonClass}>
          {buttonText || __('Add button in settings', 'kriti-blocks')}
        </span>
      </Tag>
    </>
  );
}
