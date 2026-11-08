import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { BackToTopIcon } from './icon';
import {
  getBackToTopStyleVars,
  getBackToTopPositionStyles,
  getBackToTopClassName,
} from './helpers';

import '../../style.scss';

export default function save({ attributes }) {
  const { showAfter, smooth, ariaLabel, htmlId, extraClass } = attributes;

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
  });

  return (
    <div {...blockProps}>
      <button
        type="button"
        className="bw-btt__button"
        aria-label={ariaLabel || __('Back to top', 'kriti-blocks')}
      >
        {BackToTopIcon}
      </button>
    </div>
  );
}
