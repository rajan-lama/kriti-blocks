import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

import '../../../blocks/accordion-item/style.scss';

export default function save({ attributes }) {
  const { itemTitle, itemOpen, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, itemOpen ? 'is-open' : ''].filter(Boolean).join(' ') ||
      undefined,
  });

  return (
    <div {...blockProps}>
      <h3 className="bw-accordion-title">
        <button
          type="button"
          className="bw-accordion-trigger"
          aria-expanded={itemOpen ? 'true' : 'false'}
        >
          {itemTitle && (
            <RichText.Content
              tagName="span"
              className="bw-accordion-title-text"
              value={itemTitle}
            />
          )}
          <span className="bw-accordion-icon" aria-hidden="true"></span>
        </button>
      </h3>
      <div className="bw-accordion-panel" role="region" hidden={!itemOpen}>
        <InnerBlocks.Content />
      </div>
    </div>
  );
}
