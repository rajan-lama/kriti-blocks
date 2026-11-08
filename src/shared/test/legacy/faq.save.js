import { useBlockProps, RichText } from '@wordpress/block-editor';

import '../../../blocks/faq/style.scss';

export default function save({ attributes }) {
  const { faqItems, firstOpen, htmlId, extraClass } = attributes;

  const items = Array.isArray(faqItems) ? faqItems : [];

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
  });

  return (
    <div {...blockProps}>
      {items.map((item, index) => (
        <details
          className="bw-faq-item"
          key={index}
          open={firstOpen && index === 0}
        >
          <summary className="bw-faq-item-question">
            <RichText.Content value={item.question} />
          </summary>
          <div className="bw-faq-item-answer">
            <RichText.Content value={item.answer} />
          </div>
        </details>
      ))}
    </div>
  );
}
