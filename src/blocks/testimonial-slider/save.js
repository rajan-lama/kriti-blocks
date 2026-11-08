import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __, sprintf } from '@wordpress/i18n';

import { getSliderOptions } from './options';

import './style.scss';

export default function save({ attributes }) {
  const {
    slides,
    autoplay,
    interval,
    showArrows,
    showDots,
    showQuoteMark,
    htmlId,
    extraClass,
  } = attributes;

  const hasMultiple = slides.length > 1;
  const options = getSliderOptions(attributes);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: Object.keys(options.style).length ? options.style : undefined,
    role: 'group',
    'aria-roledescription': 'carousel',
    'aria-label': __('Customer testimonials', 'kriti-blocks'),
    'data-autoplay': autoplay ? 'true' : 'false',
    'data-interval': interval,
    ...options.data,
  });

  return (
    <div {...blockProps}>
      <div className="bw-ts__viewport">
        <div className="bw-ts__track">
          {slides.map((slide, index) => (
            <figure
              className="bw-ts__slide"
              key={slide.id}
              role="group"
              aria-roledescription="slide"
              aria-label={sprintf(
                /* translators: %1$d: current slide number. %2$d: total slides. */
                __('%1$d of %2$d', 'kriti-blocks'),
                index + 1,
                slides.length,
              )}
            >
              {showQuoteMark && (
                <span className="bw-ts__mark" aria-hidden="true">
                  ”
                </span>
              )}
              <blockquote className="bw-ts__quote">
                <RichText.Content tagName="p" value={slide.quote} />
              </blockquote>
              <figcaption className="bw-ts__meta">
                {slide.avatarUrl && (
                  <img
                    className="bw-ts__avatar"
                    src={slide.avatarUrl}
                    alt={slide.avatarAlt || ''}
                    loading="lazy"
                  />
                )}
                <div className="bw-ts__meta-text">
                  {slide.authorName && (
                    <RichText.Content
                      tagName="div"
                      className="bw-ts__author"
                      value={slide.authorName}
                    />
                  )}
                  {slide.authorRole && (
                    <RichText.Content
                      tagName="div"
                      className="bw-ts__role"
                      value={slide.authorRole}
                    />
                  )}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
      {showArrows && hasMultiple && (
        <>
          <button
            type="button"
            className="bw-ts__arrow bw-ts__arrow--prev"
            aria-label={__('Previous testimonial', 'kriti-blocks')}
          >
            <span aria-hidden="true">‹</span>
          </button>
          <button
            type="button"
            className="bw-ts__arrow bw-ts__arrow--next"
            aria-label={__('Next testimonial', 'kriti-blocks')}
          >
            <span aria-hidden="true">›</span>
          </button>
        </>
      )}
      {showDots && hasMultiple && (
        <div className="bw-ts__dots">
          {slides.map((slide, index) => (
            <button
              type="button"
              className="bw-ts__dot"
              key={slide.id}
              aria-label={sprintf(
                /* translators: %d: slide number. */
                __('Go to testimonial %d', 'kriti-blocks'),
                index + 1,
              )}
              aria-current={index === 0 ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
