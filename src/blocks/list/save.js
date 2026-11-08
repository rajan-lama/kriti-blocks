import { useBlockProps, RichText } from '@wordpress/block-editor';

import ListMarker from './marker';
import { getListClassName, getListStyles, getVisibleItems } from './helpers';
import { getIndexOffset, getItemLink, getListProps } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { items, markerStyle, htmlId } = attributes;

  const visibleItems = getVisibleItems(items);

  if (visibleItems.length === 0) {
    return null;
  }

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    ...getListProps(
      attributes,
      getListClassName(attributes),
      getListStyles(attributes),
    ),
  });

  const offset = getIndexOffset(attributes);

  return (
    <div {...blockProps}>
      <ul className="bw-list__items">
        {visibleItems.map((item, index) => {
          const link = getItemLink(item);
          return (
            <li className="bw-list__item" key={index}>
              <ListMarker style={markerStyle} index={index + offset} />
              {link ? (
                <RichText.Content
                  tagName="a"
                  className="bw-list__text bw-list__link"
                  value={item.text}
                  {...link}
                />
              ) : (
                <RichText.Content
                  tagName="span"
                  className="bw-list__text"
                  value={item.text}
                />
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
