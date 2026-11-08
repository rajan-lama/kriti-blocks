import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getQuoteStyles } from './helpers';
import { getAuthorImage, getQuoteProps, getTextProps } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { content, citation, htmlId, authorImageAlt } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    ...getQuoteProps(attributes, getQuoteStyles(attributes)),
  });

  const text = getTextProps(attributes);
  const authorImage = getAuthorImage(attributes);

  const citeEl = (
    <RichText
      tagName="cite"
      className="bw-quote-citation"
      value={citation}
      onChange={(value) => setAttributes({ citation: value })}
      placeholder={__('Write attribution…', 'kriti-blocks')}
      {...text.cite}
    />
  );

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <blockquote {...blockProps}>
        <RichText
          tagName="p"
          className="bw-quote-content"
          value={content}
          onChange={(value) => setAttributes({ content: value })}
          placeholder={__('Write quote…', 'kriti-blocks')}
          allowedFormats={['core/bold', 'core/italic']}
          {...text.quote}
        />
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
    </>
  );
}
