import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __, sprintf } from '@wordpress/i18n';
import { getTestimonialStyles } from './helpers';
import { getTestimonialOptions } from './options';

import './style.scss';

export default function save({ attributes }) {
  const {
    quote,
    authorName,
    authorRole,
    avatarUrl,
    avatarAlt,
    showQuoteMark,
    htmlId,
    extraClass,
  } = attributes;

  const options = getTestimonialOptions(attributes);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: { ...getTestimonialStyles(attributes), ...options.style },
  });

  return (
    <blockquote {...blockProps}>
      {showQuoteMark && (
        <span className="bw-testimonial-mark" aria-hidden="true">
          ”
        </span>
      )}
      {options.rating > 0 && (
        <div
          className="bw-testimonial-rating"
          role="img"
          aria-label={sprintf(
            /* translators: %d: rating from 1 to 5. */
            __('Rated %d out of 5', 'kriti-blocks'),
            options.rating,
          )}
        >
          <span aria-hidden="true">
            {'★'.repeat(options.rating)}
            <span className="bw-testimonial-rating__off">
              {'★'.repeat(5 - options.rating)}
            </span>
          </span>
        </div>
      )}
      <RichText.Content
        tagName="p"
        className="bw-testimonial-quote"
        value={quote}
      />
      <footer className="bw-testimonial-meta">
        {avatarUrl && (
          <img
            className="bw-testimonial-avatar"
            src={avatarUrl}
            alt={avatarAlt || ''}
            loading="lazy"
          />
        )}
        <div className="bw-testimonial-meta-text">
          {authorName && (
            <RichText.Content
              tagName="div"
              className="bw-testimonial-author"
              value={authorName}
            />
          )}
          {authorRole && (
            <RichText.Content
              tagName="div"
              className="bw-testimonial-role"
              value={authorRole}
            />
          )}
          {options.company && (
            <div className="bw-testimonial-company">{options.company}</div>
          )}
        </div>
        {options.logo && (
          <img
            className="bw-testimonial-logo"
            src={options.logo.url}
            alt={options.logo.alt}
            loading="lazy"
          />
        )}
      </footer>
    </blockquote>
  );
}
