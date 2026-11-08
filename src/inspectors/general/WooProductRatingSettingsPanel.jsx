import {
  Button,
  ButtonGroup,
  ColorPalette,
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const WooProductRatingSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    showStars,
    showCount,
    textAlign,
    fontSize,
    textColor,
    starIcon,
    starColor,
    emptyStarColor,
    linkToReviews,
    showWhenEmpty,
    showRatingNumber,
    countFormat,
  } = attributes;

  const colors = [
    { name: 'Black', color: '#111111' },
    { name: 'Gray', color: '#6b7280' },
    { name: 'Amber', color: '#d97706' },
    { name: 'White', color: '#ffffff' },
  ];

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  return (
    <>
      <PanelBody
        title={__('Rating Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <ToggleControl
          label={__('Show stars', 'kriti-blocks')}
          checked={!!showStars}
          onChange={(value) => setAttributes({ showStars: value })}
        />

        <ToggleControl
          label={__('Show review count', 'kriti-blocks')}
          checked={!!showCount}
          onChange={(value) => setAttributes({ showCount: value })}
        />

        <ToggleControl
          label={__('Show average rating number', 'kriti-blocks')}
          checked={!!showRatingNumber}
          onChange={(value) => setAttributes({ showRatingNumber: value })}
        />

        <ToggleControl
          label={__('Link count to reviews', 'kriti-blocks')}
          checked={linkToReviews !== false}
          onChange={(value) => setAttributes({ linkToReviews: value })}
        />

        <ToggleControl
          label={__('Show when there are no reviews', 'kriti-blocks')}
          help={__(
            'Off hides the block for products without ratings.',
            'kriti-blocks',
          )}
          checked={!!showWhenEmpty}
          onChange={(value) => setAttributes({ showWhenEmpty: value })}
        />

        <ButtonGroup aria-label={__('Rating Alignment', 'kriti-blocks')}>
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

        <p>{__('Text color', 'kriti-blocks')}</p>
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={textColor}
          onChange={(color) => setAttributes({ textColor: color || '' })}
          headingLevel="3"
        />
      </PanelBody>

      <PanelBody title={__('Stars', 'kriti-blocks')} initialOpen={false}>
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Star icon', 'kriti-blocks')}
          value={starIcon || 'default'}
          options={[
            {
              label: __('WooCommerce default', 'kriti-blocks'),
              value: 'default',
            },
            { label: __('Star', 'kriti-blocks'), value: 'star' },
            { label: __('Heart', 'kriti-blocks'), value: 'heart' },
            { label: __('Circle', 'kriti-blocks'), value: 'circle' },
            { label: __('Square', 'kriti-blocks'), value: 'square' },
          ]}
          onChange={(value) => setAttributes({ starIcon: value })}
        />

        <SelectControl
          __nextHasNoMarginBottom
          label={__('Review count format', 'kriti-blocks')}
          value={countFormat || 'text'}
          options={[
            { label: __('12 reviews', 'kriti-blocks'), value: 'text' },
            { label: __('(12)', 'kriti-blocks'), value: 'parens' },
            { label: __('12', 'kriti-blocks'), value: 'number' },
          ]}
          onChange={(value) => setAttributes({ countFormat: value })}
        />

        <p>{__('Filled star color', 'kriti-blocks')}</p>
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={starColor}
          onChange={(color) => setAttributes({ starColor: color || '' })}
          headingLevel="3"
        />

        <p>{__('Empty star color', 'kriti-blocks')}</p>
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={emptyStarColor}
          onChange={(color) => setAttributes({ emptyStarColor: color || '' })}
          headingLevel="3"
        />
      </PanelBody>
    </>
  );
};

export default WooProductRatingSettingsPanel;
