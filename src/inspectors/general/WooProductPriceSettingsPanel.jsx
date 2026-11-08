import {
  Button,
  ButtonGroup,
  ColorPalette,
  PanelBody,
  RangeControl,
  TextControl,
  ToggleControl,
  BaseControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const WooProductPriceSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    textAlign,
    fontSize,
    priceColor,
    salePriceColor,
    regularPriceColor,
    strikeColor,
    showStrikethrough,
    currencyScale,
    pricePrefix,
    taxSuffix,
    stackPrices,
  } = attributes;

  const colors = [
    { name: 'Black', color: '#111111' },
    { name: 'Gray', color: '#6b7280' },
    { name: 'Green', color: '#15803d' },
    { name: 'Red', color: '#b91c1c' },
    { name: 'Accent', color: '#4f46e5' },
  ];

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  return (
    <>
      <PanelBody
        title={__('Price Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <ButtonGroup aria-label={__('Price Alignment', 'kriti-blocks')}>
          {alignmentOptions.map((option) => (
            <Button
              key={option.value}
              variant="secondary"
              isSmall
              onClick={() =>
                setAttributes({
                  textAlign: textAlign === option.value ? '' : option.value,
                })
              }
              isPressed={textAlign === option.value}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>

        <RangeControl
          __nextHasNoMarginBottom
          label={__('Font Size (px)', 'kriti-blocks')}
          help={__('0 inherits the theme font size.', 'kriti-blocks')}
          value={fontSize || 0}
          onChange={(value) => setAttributes({ fontSize: value || 0 })}
          min={0}
          max={120}
          step={1}
          allowReset
          resetFallbackValue={0}
        />

        <ColorPalette
          asButtons="true"
          colors={colors}
          value={priceColor}
          onChange={(color) => setAttributes({ priceColor: color || '' })}
          headingLevel="3"
        />
      </PanelBody>

      <PanelBody
        title={__('Sale & Regular Price', 'kriti-blocks')}
        initialOpen={false}
      >
        <BaseControl __nextHasNoMarginBottom>
          <BaseControl.VisualLabel>
            {__('Sale price color', 'kriti-blocks')}
          </BaseControl.VisualLabel>
          <ColorPalette
            colors={colors}
            value={salePriceColor}
            onChange={(color) => setAttributes({ salePriceColor: color || '' })}
            headingLevel="3"
          />
        </BaseControl>

        <BaseControl __nextHasNoMarginBottom>
          <BaseControl.VisualLabel>
            {__('Regular price color', 'kriti-blocks')}
          </BaseControl.VisualLabel>
          <ColorPalette
            colors={colors}
            value={regularPriceColor}
            onChange={(color) =>
              setAttributes({ regularPriceColor: color || '' })
            }
            headingLevel="3"
          />
        </BaseControl>

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Strike through regular price', 'kriti-blocks')}
          checked={showStrikethrough !== false}
          onChange={(value) => setAttributes({ showStrikethrough: value })}
        />

        {showStrikethrough !== false && (
          <BaseControl __nextHasNoMarginBottom>
            <BaseControl.VisualLabel>
              {__('Strikethrough color', 'kriti-blocks')}
            </BaseControl.VisualLabel>
            <ColorPalette
              colors={colors}
              value={strikeColor}
              onChange={(color) => setAttributes({ strikeColor: color || '' })}
              headingLevel="3"
            />
          </BaseControl>
        )}

        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Stack sale and regular price', 'kriti-blocks')}
          checked={!!stackPrices}
          onChange={(value) => setAttributes({ stackPrices: value })}
        />

        <RangeControl
          __nextHasNoMarginBottom
          label={__('Currency symbol size (%)', 'kriti-blocks')}
          help={__('0 keeps the symbol the same size.', 'kriti-blocks')}
          value={currencyScale || 0}
          onChange={(value) =>
            setAttributes({
              currencyScale: value ? Math.max(value, 50) : 0,
            })
          }
          min={0}
          max={150}
          step={5}
          allowReset
          resetFallbackValue={0}
        />

        <TextControl
          __nextHasNoMarginBottom
          label={__('Text before price', 'kriti-blocks')}
          value={pricePrefix || ''}
          maxLength={40}
          onChange={(value) => setAttributes({ pricePrefix: value })}
        />

        <TextControl
          __nextHasNoMarginBottom
          label={__('Text after price (e.g. tax note)', 'kriti-blocks')}
          value={taxSuffix || ''}
          maxLength={60}
          onChange={(value) => setAttributes({ taxSuffix: value })}
        />
      </PanelBody>
    </>
  );
};

export default WooProductPriceSettingsPanel;
