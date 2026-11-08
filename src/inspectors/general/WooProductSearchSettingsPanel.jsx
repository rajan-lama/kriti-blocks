import {
  ColorPalette,
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const WooProductSearchSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    label,
    placeholder,
    buttonText,
    showButton,
    categoryDropdown,
    allCategoriesText,
    iconButton,
    joined,
    size,
    maxWidth,
    borderRadius,
    buttonColor,
    buttonTextColor,
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
        title={__('Product Search Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <TextControl
          label={__('Accessible label', 'kriti-blocks')}
          help={__(
            'Visually hidden label for the search field.',
            'kriti-blocks',
          )}
          value={label}
          onChange={(value) => setAttributes({ label: value })}
        />

        <TextControl
          label={__('Placeholder', 'kriti-blocks')}
          value={placeholder}
          onChange={(value) => setAttributes({ placeholder: value })}
        />

        <TextControl
          label={__('Button text', 'kriti-blocks')}
          value={buttonText}
          onChange={(value) => setAttributes({ buttonText: value })}
        />

        <ToggleControl
          label={__('Live suggestions', 'kriti-blocks')}
          help={__(
            'Shows matching products while the visitor types. They see the same products the normal search finds.',
            'kriti-blocks',
          )}
          checked={!!attributes.liveSearch}
          onChange={(value) =>
            setAttributes({ liveSearch: value || undefined })
          }
        />
        <ToggleControl
          label={__('Show search button', 'kriti-blocks')}
          checked={!!showButton}
          onChange={(value) => setAttributes({ showButton: value })}
        />

        <ToggleControl
          label={__('Show category dropdown', 'kriti-blocks')}
          help={__(
            'Lets visitors limit the search to one product category.',
            'kriti-blocks',
          )}
          checked={!!categoryDropdown}
          onChange={(value) => setAttributes({ categoryDropdown: value })}
        />

        {categoryDropdown && (
          <TextControl
            label={__('"All categories" text', 'kriti-blocks')}
            value={allCategoriesText || ''}
            onChange={(value) => setAttributes({ allCategoriesText: value })}
          />
        )}
      </PanelBody>

      <PanelBody title={__('Search Style', 'kriti-blocks')} initialOpen={false}>
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

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Icon button', 'kriti-blocks')}
          help={__(
            'Shows a magnifier instead of text. The button text stays as the accessible name.',
            'kriti-blocks',
          )}
          checked={!!iconButton}
          onChange={(value) => setAttributes({ iconButton: value })}
        />

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Join field and button', 'kriti-blocks')}
          checked={!!joined}
          onChange={(value) => setAttributes({ joined: value })}
        />

        <RangeControl
          __nextHasNoMarginBottom
          label={__('Maximum width (px)', 'kriti-blocks')}
          help={__('0 uses the default width (480px).', 'kriti-blocks')}
          value={maxWidth || 0}
          min={0}
          max={1200}
          step={10}
          onChange={(value) => setAttributes({ maxWidth: value || 0 })}
          allowReset
          resetFallbackValue={0}
        />

        <RangeControl
          __nextHasNoMarginBottom
          label={__('Corner radius (px)', 'kriti-blocks')}
          value={borderRadius >= 0 ? borderRadius : 4}
          min={0}
          max={50}
          onChange={(value) => setAttributes({ borderRadius: value ?? -1 })}
          allowReset
          resetFallbackValue={-1}
        />

        <p>{__('Button color', 'kriti-blocks')}</p>
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={buttonColor}
          onChange={(color) => setAttributes({ buttonColor: color || '' })}
          headingLevel="3"
        />

        <p>{__('Button text color', 'kriti-blocks')}</p>
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={buttonTextColor}
          onChange={(color) => setAttributes({ buttonTextColor: color || '' })}
          headingLevel="3"
        />
      </PanelBody>
    </>
  );
};

export default WooProductSearchSettingsPanel;
