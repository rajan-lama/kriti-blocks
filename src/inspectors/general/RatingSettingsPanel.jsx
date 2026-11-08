import {
  PanelBody,
  RangeControl,
  ToggleControl,
  ButtonGroup,
  Button,
  ColorPalette,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const RatingSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    ratingValue,
    maxRating,
    starSize,
    starColor,
    emptyStarColor,
    showValue,
  } = attributes;

  const sizeOptions = [
    { label: 'Small', value: 'small' },
    { label: 'Medium', value: 'medium' },
    { label: 'Large', value: 'large' },
  ];

  const starColors = [
    { name: 'Amber', color: '#f59e0b' },
    { name: 'Yellow', color: '#eab308' },
    { name: 'Orange', color: '#f97316' },
    { name: 'Rose', color: '#e11d48' },
    { name: 'Indigo', color: '#4f46e5' },
  ];

  const emptyColors = [
    { name: 'Light Gray', color: '#e5e7eb' },
    { name: 'Gray', color: '#d1d5db' },
    { name: 'Slate', color: '#cbd5e1' },
  ];

  return (
    <PanelBody title={__('Rating Settings', 'kriti-blocks')} initialOpen={true}>
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Rating Value', 'kriti-blocks')}
        value={ratingValue || 0}
        onChange={(value) => setAttributes({ ratingValue: value || 0 })}
        min={0}
        max={parseInt(maxRating, 10) || 5}
        step={0.5}
      />

      <RangeControl
        __nextHasNoMarginBottom
        label={__('Number of Stars', 'kriti-blocks')}
        value={parseInt(maxRating, 10) || 5}
        onChange={(value) => setAttributes({ maxRating: value || 5 })}
        min={1}
        max={10}
        step={1}
      />

      <ButtonGroup aria-label={__('Star Size', 'kriti-blocks')}>
        {sizeOptions.map((option) => (
          <Button
            key={option.value}
            variant="secondary"
            isSmall
            onClick={() => setAttributes({ starSize: option.value })}
            isPressed={starSize === option.value}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>

      <ToggleControl
        label={__('Show numeric value', 'kriti-blocks')}
        checked={!!showValue}
        onChange={(value) => setAttributes({ showValue: value })}
      />

      <p>{__('Star Color', 'kriti-blocks')}</p>
      <ColorPalette
        asButtons="true"
        colors={starColors}
        value={starColor}
        onChange={(color) => setAttributes({ starColor: color })}
        headingLevel="3"
      />

      <p>{__('Empty Star Color', 'kriti-blocks')}</p>
      <ColorPalette
        asButtons="true"
        colors={emptyColors}
        value={emptyStarColor}
        onChange={(color) => setAttributes({ emptyStarColor: color })}
        headingLevel="3"
      />
    </PanelBody>
  );
};

export default RatingSettingsPanel;
