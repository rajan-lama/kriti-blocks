import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getOffcanvasStyleVars, getOffcanvasClassName } from './helpers';
import { getOffcanvasOptionData } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { triggerText, showCloseButton, closeOnBackdrop, htmlId, extraClass } =
    attributes;

  const label = triggerText || __('Open menu', 'kriti-blocks');

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, 'bw-offcanvas', getOffcanvasClassName(attributes)]
        .filter(Boolean)
        .join(' ') || undefined,
    style: getOffcanvasStyleVars(attributes),
    'data-close-on-backdrop': closeOnBackdrop ? 'true' : 'false',
    ...getOffcanvasOptionData(attributes),
  });

  return (
    <div {...blockProps}>
      <button
        type="button"
        className="bw-offcanvas__trigger"
        aria-haspopup="dialog"
        aria-expanded="false"
        aria-label={label}
      >
        {label}
      </button>
      <div className="bw-offcanvas__overlay" hidden>
        <aside
          className="bw-offcanvas__panel"
          role="dialog"
          aria-modal="true"
          aria-label={label}
          tabIndex={-1}
        >
          {showCloseButton && (
            <button
              type="button"
              className="bw-offcanvas__close"
              aria-label={__('Close', 'kriti-blocks')}
            >
              ×
            </button>
          )}
          <div className="bw-offcanvas__content">
            <InnerBlocks.Content />
          </div>
        </aside>
      </div>
    </div>
  );
}
