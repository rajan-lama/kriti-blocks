import { useBlockProps, RichText } from '@wordpress/block-editor';

import { getDisclosureProps, joinClasses } from '../../shared/disclosure';

import './style.scss';

export default function save({ attributes }) {
  const { faqItems, firstOpen, openOne, groupName, htmlId, extraClass } =
    attributes;
  const group = getDisclosureProps(attributes);

  const items = Array.isArray(faqItems) ? faqItems : [];

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: joinClasses(extraClass, group.classes),
    style: Object.keys(group.style).length ? group.style : undefined,
  });

  return (
    <div {...blockProps}>
      {items.map((item, index) => (
        <details
          className="bw-faq-item"
          key={index}
          open={firstOpen && index === 0}
          name={openOne && groupName ? groupName : undefined}
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
