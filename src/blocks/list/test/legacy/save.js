import { useBlockProps, RichText } from '@wordpress/block-editor';

import ListMarker from '../../marker';
import {
  getListClassName,
  getListStyles,
  getVisibleItems,
} from '../../helpers';

// (style import removed for tests)

export default function save({ attributes }) {
  const { items, markerStyle, htmlId } = attributes;

  const visibleItems = getVisibleItems(items);

  if (visibleItems.length === 0) {
    return null;
  }

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: getListClassName(attributes),
    style: getListStyles(attributes),
  });

  return (
    <div {...blockProps}>
      <ul className="bw-list__items">
        {visibleItems.map((item, index) => (
          <li className="bw-list__item" key={index}>
            <ListMarker style={markerStyle} index={index} />
            <RichText.Content
              tagName="span"
              className="bw-list__text"
              value={item.text}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
