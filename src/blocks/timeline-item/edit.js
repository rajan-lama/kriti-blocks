import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getTimelineItemOptions } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { itemDate, htmlId, extraClass } = attributes;

  const options = getTimelineItemOptions(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: Object.keys(options.style).length ? options.style : undefined,
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <RichText
          tagName="div"
          className="bw-timeline-item__date"
          value={itemDate}
          onChange={(value) => setAttributes({ itemDate: value })}
          placeholder={__('Date', 'kriti-blocks')}
        />
        {options.image && (
          <img
            className="bw-timeline-item__image"
            src={options.image.url}
            alt={options.image.alt}
            loading="lazy"
          />
        )}
        <div className="bw-timeline-item__content">
          <InnerBlocks renderAppender={InnerBlocks.ButtonBlockAppender} />
        </div>
      </div>
    </>
  );
}
