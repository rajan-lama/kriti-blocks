import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button, ButtonGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getDisclosureProps, joinClasses } from '../../shared/disclosure';
import { addFaqItem, removeFaqItem, updateFaqItem } from './helpers';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { faqItems, firstOpen, htmlId, extraClass } = attributes;

  const items = Array.isArray(faqItems) ? faqItems : [];

  const group = getDisclosureProps(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className: joinClasses(extraClass, group.classes),
    style: Object.keys(group.style).length ? group.style : undefined,
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        {items.length === 0 && (
          <p className="bw-faq-empty">
            {__('No FAQ items yet. Add one below.', 'kriti-blocks')}
          </p>
        )}

        {items.map((item, index) => (
          <div className="bw-faq-item" key={index}>
            <div className="bw-faq-item-header">
              <span className="bw-faq-item-icon" aria-hidden="true">
                {firstOpen && index === 0 ? '▾' : '▸'}
              </span>
              <RichText
                tagName="span"
                className="bw-faq-item-question"
                value={item.question}
                onChange={(value) =>
                  updateFaqItem(
                    index,
                    'question',
                    value,
                    faqItems,
                    setAttributes,
                  )
                }
                placeholder={__('Question…', 'kriti-blocks')}
              />
            </div>
            <RichText
              tagName="div"
              className="bw-faq-item-answer"
              value={item.answer}
              onChange={(value) =>
                updateFaqItem(index, 'answer', value, faqItems, setAttributes)
              }
              placeholder={__('Answer…', 'kriti-blocks')}
            />
            {items.length > 1 && (
              <ButtonGroup className="bw-faq-item-actions">
                <Button
                  variant="link"
                  isDestructive
                  isSmall
                  onClick={() => removeFaqItem(index, faqItems, setAttributes)}
                >
                  {__('Remove', 'kriti-blocks')}
                </Button>
              </ButtonGroup>
            )}
          </div>
        ))}

        <Button
          variant="secondary"
          isSmall
          onClick={() => addFaqItem(faqItems, setAttributes)}
        >
          {__('Add FAQ Item', 'kriti-blocks')}
        </Button>
      </div>
    </>
  );
}
