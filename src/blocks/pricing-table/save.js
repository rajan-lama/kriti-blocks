import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import { getPricingTableOptions } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { htmlId, extraClass } = attributes;
  const options = getPricingTableOptions(attributes);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: Object.keys(options.style).length ? options.style : undefined,
  });

  return (
    <div {...blockProps}>
      {options.toggle && (
        <div
          className="kb-pt__toggle"
          role="group"
          aria-label={__('Billing period', 'kriti-blocks')}
          data-yearly-default={
            options.toggle.yearlyDefault ? 'true' : undefined
          }
        >
          <button
            type="button"
            className="kb-pt__toggle-btn"
            data-period="monthly"
          >
            {options.toggle.monthly}
          </button>
          <button
            type="button"
            className="kb-pt__toggle-btn"
            data-period="yearly"
          >
            {options.toggle.yearly}
          </button>
        </div>
      )}
      <InnerBlocks.Content />
    </div>
  );
}
