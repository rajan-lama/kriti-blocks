import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

import './style.scss';

export default function save({ attributes }) {
  const { itemTitle, itemOpen, titleTag, htmlId, extraClass } = attributes;
  const TitleTag = ['h2', 'h3', 'h4', 'h5', 'h6', 'div'].includes(titleTag)
    ? titleTag
    : 'h3';

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, itemOpen ? 'is-open' : ''].filter(Boolean).join(' ') ||
      undefined,
  });

  return (
    <div {...blockProps}>
      <TitleTag className="bw-accordion-title">
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
      </TitleTag>
      <div className="bw-accordion-panel" role="region" hidden={!itemOpen}>
        <InnerBlocks.Content />
      </div>
    </div>
  );
}
