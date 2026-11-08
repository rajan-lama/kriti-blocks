import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __, sprintf } from '@wordpress/i18n';
import Inspector from './inspector';
import { getTestimonialStyles } from './helpers';
import { getTestimonialOptions } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const {
    quote,
    authorName,
    authorRole,
    avatarUrl,
    avatarAlt,
    htmlId,
    extraClass,
  } = attributes;

  const options = getTestimonialOptions(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: { ...getTestimonialStyles(attributes), ...options.style },
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <blockquote {...blockProps}>
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
        <RichText
          tagName="p"
          multiline={false}
          className="bw-testimonial-quote"
          value={quote}
          onChange={(value) => setAttributes({ quote: value })}
          placeholder={__('Write a testimonial quote…', 'kriti-blocks')}
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
            <RichText
              tagName="div"
              className="bw-testimonial-author"
              value={authorName}
              onChange={(value) => setAttributes({ authorName: value })}
              placeholder={__('Author name', 'kriti-blocks')}
            />
            <RichText
              tagName="div"
              className="bw-testimonial-role"
              value={authorRole}
              onChange={(value) => setAttributes({ authorRole: value })}
              placeholder={__('Role, company', 'kriti-blocks')}
            />
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
    </>
  );
}
