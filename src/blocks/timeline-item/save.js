import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

import { __ } from '@wordpress/i18n';
import { getTimelineItemOptions } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { itemDate, htmlId, extraClass } = attributes;

  const options = getTimelineItemOptions(attributes);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: Object.keys(options.style).length ? options.style : undefined,
  });

  return (
    <div {...blockProps}>
      {itemDate && (
        <RichText.Content
          tagName="div"
          className="bw-timeline-item__date"
          value={itemDate}
        />
      )}
      {options.image && (
        <img
          className="bw-timeline-item__image"
          src={options.image.url}
          alt={options.image.alt}
          loading="lazy"
        />
      )}
      <div className="bw-timeline-item__content">
        <InnerBlocks.Content />
      </div>
      {options.link && (
        <a
          className="bw-timeline-item__link"
          href={options.link.href}
          target={options.link.target}
          rel={options.link.rel}
        >
          {options.link.text || __('Read more', 'kriti-blocks')}
        </a>
      )}
    </div>
  );
}
