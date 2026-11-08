import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { itemTitle, titleTag, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className: extraClass || undefined,
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <div className="bw-accordion-title-row">
          <RichText
            tagName={
              ['h2', 'h3', 'h4', 'h5', 'h6', 'div'].includes(titleTag)
                ? titleTag
                : 'h3'
            }
            className="bw-accordion-title-text"
            value={itemTitle}
            onChange={(value) => setAttributes({ itemTitle: value })}
            placeholder={__('Accordion title', 'kriti-blocks')}
          />
          <span className="bw-accordion-icon" aria-hidden="true"></span>
        </div>
        <div className="bw-accordion-panel">
          <InnerBlocks renderAppender={InnerBlocks.ButtonBlockAppender} />
        </div>
      </div>
    </>
  );
}
