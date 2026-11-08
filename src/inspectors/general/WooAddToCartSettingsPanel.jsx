import {
  ColorPalette,
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const WooAddToCartSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    text,
    buttonColor,
    textColor,
    fontSize,
    borderRadius,
    fullWidth,
    showQuantity,
    afterAdd,
    hoverColor,
    hoverTextColor,
    icon,
    iconPosition,
    size,
    outOfStockText,
  } = attributes;

  const colors = [
    { name: 'Slate', color: '#1e293b' },
    { name: 'Indigo', color: '#4f46e5' },
    { name: 'Green', color: '#15803d' },
    { name: 'Red', color: '#b91c1c' },
    { name: 'White', color: '#ffffff' },
  ];

  return (
    <>
      <PanelBody
        title={__('Add To Cart Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <TextControl
          label={__('Button label', 'kriti-blocks')}
          help={__('Leave empty to use the WooCommerce label.', 'kriti-blocks')}
          value={text}
          onChange={(value) => setAttributes({ text: value })}
        />

        <ToggleControl
          label={__('Full width', 'kriti-blocks')}
          help={__(
            'Stretch the button to the full column width.',
            'kriti-blocks',
          )}
          checked={!!fullWidth}
          onChange={(value) => setAttributes({ fullWidth: value })}
        />

        <p>{__('Button color', 'kriti-blocks')}</p>
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={buttonColor}
          onChange={(color) => setAttributes({ buttonColor: color || '' })}
          headingLevel="3"
        />

        <p>{__('Text color', 'kriti-blocks')}</p>
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={textColor}
          onChange={(color) => setAttributes({ textColor: color || '' })}
          headingLevel="3"
        />

        <RangeControl
          __nextHasNoMarginBottom
          label={__('Font Size (px)', 'kriti-blocks')}
          value={fontSize || 0}
          onChange={(value) => setAttributes({ fontSize: value || 0 })}
          min={0}
          max={120}
          step={1}
          allowReset
          resetFallbackValue={0}
        />

        <RangeControl
          label={__('Corner radius (px)', 'kriti-blocks')}
          value={borderRadius}
          onChange={(value) => setAttributes({ borderRadius: value })}
          min={0}
          max={999}
          step={1}
          allowReset
          resetFallbackValue={4}
        />
      </PanelBody>

      <PanelBody title={__('Behavior', 'kriti-blocks')} initialOpen={false}>
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Show quantity input', 'kriti-blocks')}
          help={__(
            'Simple products only. Uses the standard WooCommerce add to cart form.',
            'kriti-blocks',
          )}
          checked={!!showQuantity}
          onChange={(value) => setAttributes({ showQuantity: value })}
        />

        <SelectControl
          __nextHasNoMarginBottom
          label={__('After adding to cart', 'kriti-blocks')}
          help={__(
            'Simple products only. Cart and checkout open the page with the product added.',
            'kriti-blocks',
          )}
          value={afterAdd || 'default'}
          options={[
            {
              label: __('Stay on page (store default)', 'kriti-blocks'),
              value: 'default',
            },
            { label: __('Go to cart', 'kriti-blocks'), value: 'cart' },
            { label: __('Go to checkout', 'kriti-blocks'), value: 'checkout' },
          ]}
          onChange={(value) => setAttributes({ afterAdd: value })}
        />

        <TextControl
          __nextHasNoMarginBottom
          label={__('Out of stock message', 'kriti-blocks')}
          help={__(
            'Shown instead of the button when the product is out of stock. Leave empty for the default behavior.',
            'kriti-blocks',
          )}
          value={outOfStockText || ''}
          onChange={(value) => setAttributes({ outOfStockText: value })}
        />
      </PanelBody>

      <PanelBody title={__('Button Style', 'kriti-blocks')} initialOpen={false}>
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Size', 'kriti-blocks')}
          value={size || 'medium'}
          options={[
            { label: __('Small', 'kriti-blocks'), value: 'small' },
            { label: __('Medium', 'kriti-blocks'), value: 'medium' },
            { label: __('Large', 'kriti-blocks'), value: 'large' },
          ]}
          onChange={(value) => setAttributes({ size: value })}
        />

        <SelectControl
          __nextHasNoMarginBottom
          label={__('Icon', 'kriti-blocks')}
          value={icon || 'none'}
          options={[
            { label: __('None', 'kriti-blocks'), value: 'none' },
            { label: __('Cart', 'kriti-blocks'), value: 'cart' },
            { label: __('Bag', 'kriti-blocks'), value: 'bag' },
            { label: __('Plus', 'kriti-blocks'), value: 'plus' },
            { label: __('Check', 'kriti-blocks'), value: 'check' },
          ]}
          onChange={(value) => setAttributes({ icon: value })}
        />

        {icon && icon !== 'none' && (
          <SelectControl
            __nextHasNoMarginBottom
            label={__('Icon position', 'kriti-blocks')}
            value={iconPosition || 'before'}
            options={[
              { label: __('Before text', 'kriti-blocks'), value: 'before' },
              { label: __('After text', 'kriti-blocks'), value: 'after' },
            ]}
            onChange={(value) => setAttributes({ iconPosition: value })}
          />
        )}

        <p>{__('Hover background color', 'kriti-blocks')}</p>
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={hoverColor}
          onChange={(color) => setAttributes({ hoverColor: color || '' })}
          headingLevel="3"
        />

        <p>{__('Hover text color', 'kriti-blocks')}</p>
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={hoverTextColor}
          onChange={(color) => setAttributes({ hoverTextColor: color || '' })}
          headingLevel="3"
        />
      </PanelBody>
    </>
  );
};

export default WooAddToCartSettingsPanel;
