import {
  PanelBody,
  SelectControl,
  RangeControl,
  ColorPalette,
  ButtonGroup,
  Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const DividerSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    dividerStyle,
    dividerColor,
    dividerWeight,
    dividerWidth,
    dividerAlign,
  } = attributes;

  const colors = [
    { name: 'Gray', color: '#d1d5db' },
    { name: 'Black', color: '#111111' },
    { name: 'White', color: '#ffffff' },
    { name: 'Accent', color: '#4f46e5' },
  ];

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  return (
    <PanelBody
      title={__('Divider Settings', 'kriti-blocks')}
      initialOpen={true}
    >
      <SelectControl
        label={__('Style', 'kriti-blocks')}
        value={dividerStyle}
        options={[
          { label: 'Solid', value: 'solid' },
          { label: 'Dashed', value: 'dashed' },
          { label: 'Dotted', value: 'dotted' },
          { label: 'Double', value: 'double' },
          { label: 'Gradient', value: 'gradient' },
        ]}
        onChange={(value) => setAttributes({ dividerStyle: value })}
      />

      <RangeControl
        __nextHasNoMarginBottom
        label={__('Thickness (px)', 'kriti-blocks')}
        value={dividerWeight}
        onChange={(value) => setAttributes({ dividerWeight: value })}
        min={1}
        max={20}
        step={1}
        allowReset
        resetFallbackValue={2}
      />

      <RangeControl
        __nextHasNoMarginBottom
        label={__('Width (%)', 'kriti-blocks')}
        value={dividerWidth}
        onChange={(value) => setAttributes({ dividerWidth: value })}
        min={10}
        max={100}
        step={1}
        allowReset
        resetFallbackValue={100}
      />

      <ButtonGroup aria-label={__('Alignment', 'kriti-blocks')}>
        {alignmentOptions.map((option) => (
          <Button
            key={option.value}
            variant="secondary"
            isSmall
            onClick={() => setAttributes({ dividerAlign: option.value })}
            isPressed={dividerAlign === option.value}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>

      <ColorPalette
        asButtons="true"
        colors={colors}
        value={dividerColor}
        onChange={(color) => setAttributes({ dividerColor: color })}
        headingLevel="3"
      />
    </PanelBody>
  );
};

export default DividerSettingsPanel;
