import { useBlockProps, RichText } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { plus, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import Inspector from './inspector';
import ListMarker from './marker';
import { getListClassName, getListStyles } from './helpers';
import { getIndexOffset, getListProps } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { items, markerStyle, htmlId } = attributes;

  const listItems = Array.isArray(items) ? items : [];

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    ...getListProps(
      attributes,
      getListClassName(attributes),
      getListStyles(attributes),
    ),
  });

  const updateItem = (index, text) => {
    setAttributes({
      items: listItems.map((item, itemIndex) =>
        itemIndex === index ? { ...item, text } : item,
      ),
    });
  };

  const addItem = () => {
    setAttributes({ items: [...listItems, { text: '' }] });
  };

  const removeItem = (index) => {
    setAttributes({
      items: listItems.filter((item, itemIndex) => itemIndex !== index),
    });
  };

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        {listItems.length === 0 && (
          <p className="bw-list__hint">
            {__('Add your list items below.', 'kriti-blocks')}
          </p>
        )}
        <ul className="bw-list__items">
          {listItems.map((item, index) => (
            <li className="bw-list__item" key={index}>
              <ListMarker
                style={markerStyle}
                index={index + getIndexOffset(attributes)}
              />
              <RichText
                tagName="span"
                className="bw-list__text"
                value={item.text}
                onChange={(value) => updateItem(index, value)}
                placeholder={__('List item', 'kriti-blocks')}
              />
              <Button
                className="bw-list__remove"
                icon={trash}
                label={__('Remove item', 'kriti-blocks')}
                isSmall
                isDestructive
                disabled={listItems.length <= 1}
                onClick={() => removeItem(index)}
              />
            </li>
          ))}
        </ul>
        <Button
          className="bw-list__add"
          variant="secondary"
          icon={plus}
          onClick={addItem}
        >
          {__('Add Item', 'kriti-blocks')}
        </Button>
      </div>
    </>
  );
}
