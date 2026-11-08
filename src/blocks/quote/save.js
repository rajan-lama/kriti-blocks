import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getQuoteStyles } from './helpers';
import { getAuthorImage, getQuoteProps, getTextProps } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { content, citation, htmlId, authorImageAlt } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    ...getQuoteProps(attributes, getQuoteStyles(attributes)),
  });

  const text = getTextProps(attributes);
  const authorImage = getAuthorImage(attributes);

  const citeEl = citation && (
    <RichText.Content
      tagName="cite"
      className="bw-quote-citation"
      value={citation}
      {...text.cite}
    />
  );

  return (
    <blockquote {...blockProps}>
      {content && (
        <RichText.Content
          tagName="p"
          className="bw-quote-content"
          value={content}
          {...text.quote}
        />
      )}
      {authorImage ? (
        <div className="bw-quote-author">
          <img
            className="bw-quote-author-img"
            src={authorImage}
            alt={authorImageAlt || ''}
          />
          {citeEl}
        </div>
      ) : (
        citeEl
      )}
    </blockquote>
  );
}
