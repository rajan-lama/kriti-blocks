import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getTestimonialStyles } from '../../helpers';

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

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getTestimonialStyles(attributes),
  });

  return (
    <blockquote {...blockProps}>
      {showQuoteMark && (
        <span className="bw-testimonial-mark" aria-hidden="true">
          ”
        </span>
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
        </div>
      </footer>
    </blockquote>
  );
}
