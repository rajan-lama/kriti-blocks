import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import {
  getBackToTopIconElement,
  getBackToTopOptionData,
  getLabel,
  ProgressRing,
} from './options';
import {
  getBackToTopStyleVars,
  getBackToTopPositionStyles,
  getBackToTopClassName,
} from './helpers';

import './style.scss';

export default function save({ attributes }) {
  const { showAfter, smooth, ariaLabel, htmlId, extraClass } = attributes;

  const label = getLabel(attributes.label);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, getBackToTopClassName(attributes)]
        .filter(Boolean)
        .join(' ') || undefined,
    style: {
      ...getBackToTopStyleVars(attributes),
      ...getBackToTopPositionStyles(attributes),
    },
    'data-show-after': showAfter,
    'data-smooth': smooth ? 'true' : 'false',
    ...getBackToTopOptionData(attributes),
  });

  return (
    <div {...blockProps}>
      <button
        type="button"
        className="bw-btt__button"
        aria-label={ariaLabel || __('Back to top', 'kriti-blocks')}
      >
        {getBackToTopIconElement(attributes.iconType)}
        {label && <span className="bw-btt__label">{label}</span>}
        {attributes.showProgress === true && <ProgressRing />}
      </button>
    </div>
  );
}
