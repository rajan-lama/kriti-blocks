import {
  ColorPalette,
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const WooMiniCartSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    title,
    toggleText,
    showToggle,
    showCount,
    openByDefault,
    display,
    drawerSide,
    icon,
    countStyle,
    showSubtotal,
    hideViewCart,
    hideCheckout,
    emptyText,
    toggleColor,
    toggleTextColor,
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
        title={__('Mini Cart Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <TextControl
          label={__('Title', 'kriti-blocks')}
          value={title}
          onChange={(value) => setAttributes({ title: value })}
        />

        <ToggleControl
          label={__('Show toggle button', 'kriti-blocks')}
          help={__(
            'When disabled the cart contents are always visible.',
            'kriti-blocks',
          )}
          checked={!!showToggle}
          onChange={(value) => setAttributes({ showToggle: value })}
        />

        {showToggle && (
          <>
            <TextControl
              label={__('Toggle text', 'kriti-blocks')}
              value={toggleText}
              onChange={(value) => setAttributes({ toggleText: value })}
            />

            <ToggleControl
              label={__('Show item count', 'kriti-blocks')}
              checked={!!showCount}
              onChange={(value) => setAttributes({ showCount: value })}
            />

            <ToggleControl
              label={__('Open by default', 'kriti-blocks')}
              checked={!!openByDefault}
              onChange={(value) => setAttributes({ openByDefault: value })}
            />
          </>
        )}
      </PanelBody>

      <PanelBody title={__('Cart Display', 'kriti-blocks')} initialOpen={false}>
        {showToggle && (
          <SelectControl
            __nextHasNoMarginBottom
            label={__('Display', 'kriti-blocks')}
            help={__(
              'Dropdown floats under the button. Drawer slides in from the side. Both fall back to an inline cart without JavaScript.',
              'kriti-blocks',
            )}
            value={display || 'inline'}
            options={[
              {
                label: __('Inline (expands in place)', 'kriti-blocks'),
                value: 'inline',
              },
              { label: __('Dropdown', 'kriti-blocks'), value: 'dropdown' },
              { label: __('Side drawer', 'kriti-blocks'), value: 'drawer' },
            ]}
            onChange={(value) => setAttributes({ display: value })}
          />
        )}

        {showToggle && display === 'drawer' && (
          <SelectControl
            __nextHasNoMarginBottom
            label={__('Drawer side', 'kriti-blocks')}
            value={drawerSide || 'right'}
            options={[
              { label: __('Right', 'kriti-blocks'), value: 'right' },
              { label: __('Left', 'kriti-blocks'), value: 'left' },
            ]}
            onChange={(value) => setAttributes({ drawerSide: value })}
          />
        )}

        {showToggle && (
          <>
            <SelectControl
              __nextHasNoMarginBottom
              label={__('Cart icon', 'kriti-blocks')}
              value={icon || 'none'}
              options={[
                { label: __('None', 'kriti-blocks'), value: 'none' },
                { label: __('Cart', 'kriti-blocks'), value: 'cart' },
                { label: __('Bag', 'kriti-blocks'), value: 'bag' },
                { label: __('Basket', 'kriti-blocks'), value: 'basket' },
              ]}
              onChange={(value) => setAttributes({ icon: value })}
            />

            {showCount && (
              <SelectControl
                __nextHasNoMarginBottom
                label={__('Item count style', 'kriti-blocks')}
                value={countStyle || 'text'}
                options={[
                  {
                    label: __('In text: Cart (2)', 'kriti-blocks'),
                    value: 'text',
                  },
                  { label: __('Badge', 'kriti-blocks'), value: 'badge' },
                ]}
                onChange={(value) => setAttributes({ countStyle: value })}
              />
            )}

            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Show subtotal on the button', 'kriti-blocks')}
              checked={!!showSubtotal}
              onChange={(value) => setAttributes({ showSubtotal: value })}
            />

            <p>{__('Button color', 'kriti-blocks')}</p>
            <ColorPalette
              asButtons="true"
              colors={colors}
              value={toggleColor}
              onChange={(color) => setAttributes({ toggleColor: color || '' })}
              headingLevel="3"
            />

            <p>{__('Button text color', 'kriti-blocks')}</p>
            <ColorPalette
              asButtons="true"
              colors={colors}
              value={toggleTextColor}
              onChange={(color) =>
                setAttributes({ toggleTextColor: color || '' })
              }
              headingLevel="3"
            />
          </>
        )}

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Hide "View cart" button', 'kriti-blocks')}
          checked={!!hideViewCart}
          onChange={(value) => setAttributes({ hideViewCart: value })}
        />

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Hide "Checkout" button', 'kriti-blocks')}
          checked={!!hideCheckout}
          onChange={(value) => setAttributes({ hideCheckout: value })}
        />

        <TextControl
          __nextHasNoMarginBottom
          label={__('Empty cart message', 'kriti-blocks')}
          help={__(
            'Leave empty to use the WooCommerce message.',
            'kriti-blocks',
          )}
          value={emptyText || ''}
          onChange={(value) => setAttributes({ emptyText: value })}
        />
      </PanelBody>
    </>
  );
};

export default WooMiniCartSettingsPanel;
