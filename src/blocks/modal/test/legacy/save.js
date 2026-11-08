import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getModalStyleVars, getModalClassName } from './helpers';

import '../../style.scss';

export default function save({ attributes }) {
  const { triggerText, showCloseButton, closeOnBackdrop, htmlId, extraClass } =
    attributes;

  const label = triggerText || __('Open modal', 'kriti-blocks');

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, 'bw-modal', getModalClassName(attributes)]
        .filter(Boolean)
        .join(' ') || undefined,
    style: getModalStyleVars(attributes),
    'data-close-on-backdrop': closeOnBackdrop ? 'true' : 'false',
  });

  return (
    <div {...blockProps}>
      <button
        type="button"
        className="bw-modal__trigger"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-label={label}
      >
        {label}
      </button>
      <div className="bw-modal__overlay" hidden>
        <div
          className="bw-modal__panel"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
        >
          {showCloseButton && (
            <button
              type="button"
              className="bw-modal__close"
              aria-label={__('Close', 'kriti-blocks')}
            >
              ×
            </button>
          )}
          <div className="bw-modal__content">
            <InnerBlocks.Content />
          </div>
        </div>
      </div>
    </div>
  );
}
