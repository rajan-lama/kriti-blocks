import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  RangeControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';

export default function Inspector({ attributes, setAttributes }) {
  const { title, emptyText, columns, showAddToCart } = attributes;

  return (
    <InspectorControls>
      <PanelBody title={__('Wishlist', 'kriti-blocks')} initialOpen>
        <TextControl
          label={__('Heading', 'kriti-blocks')}
          value={title}
          onChange={(value) => setAttributes({ title: value })}
        />
        <TextControl
          label={__('Message when empty', 'kriti-blocks')}
          placeholder={__('Your wishlist is empty.', 'kriti-blocks')}
          value={emptyText}
          onChange={(value) => setAttributes({ emptyText: value })}
        />
        <RangeControl
          label={__('Columns', 'kriti-blocks')}
          value={columns}
          min={1}
          max={4}
          onChange={(value) => setAttributes({ columns: value || 3 })}
        />
        <ToggleControl
          label={__('Show add to cart', 'kriti-blocks')}
          checked={showAddToCart !== false}
          onChange={(value) => setAttributes({ showAddToCart: value })}
        />
        <p className="components-base-control__help">
          {__(
            'Visitors save products with the heart on the Product Grid block. The list is kept in their own browser, so it is empty here in the editor.',
            'kriti-blocks',
          )}
        </p>
      </PanelBody>
    </InspectorControls>
  );
}
