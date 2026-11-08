import {
  PanelBody,
  SelectControl,
  RangeControl,
  TextControl,
  ToggleControl,
  ColorPalette,
  ButtonGroup,
  Button,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const TextSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    tagType,
    contentColor,
    fontSize,
    fontWeight,
    textAlign,
    textTransform,
    letterSpacing,
    lineHeight,
    dropCap,
  } = attributes;

  const colors = [
    { name: 'Black', color: '#111111' },
    { name: 'Gray', color: '#6b7280' },
    { name: 'White', color: '#ffffff' },
    { name: 'Accent', color: '#4f46e5' },
  ];

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  return (
    <PanelBody title={__('Text Settings', 'kriti-blocks')} initialOpen={true}>
      <SelectControl
        label={__('HTML Tag', 'kriti-blocks')}
        value={tagType}
        options={[
          { label: 'Paragraph (p)', value: 'p' },
          { label: 'Div', value: 'div' },
          { label: 'Span', value: 'span' },
        ]}
        onChange={(value) => setAttributes({ tagType: value })}
      />

      <RangeControl
        __nextHasNoMarginBottom
        label={__('Font Size (px)', 'kriti-blocks')}
        value={fontSize || 0}
        onChange={(value) => setAttributes({ fontSize: value || '' })}
        min={10}
        max={120}
        step={1}
        allowReset
        resetFallbackValue={undefined}
      />

      <SelectControl
        label={__('Font Weight', 'kriti-blocks')}
        value={fontWeight}
        options={[
          { label: 'Default', value: '' },
          { label: 'Regular (400)', value: '400' },
          { label: 'Medium (500)', value: '500' },
          { label: 'Semibold (600)', value: '600' },
          { label: 'Bold (700)', value: '700' },
        ]}
        onChange={(value) => setAttributes({ fontWeight: value })}
      />

      <ButtonGroup aria-label={__('Text Alignment', 'kriti-blocks')}>
        {alignmentOptions.map((option) => (
          <Button
            key={option.value}
            variant="secondary"
            isSmall
            onClick={() => setAttributes({ textAlign: option.value })}
            isPressed={textAlign === option.value}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>

      <SelectControl
        label={__('Text Transform', 'kriti-blocks')}
        value={textTransform}
        options={[
          { label: 'Default', value: '' },
          { label: 'Uppercase', value: 'uppercase' },
          { label: 'Lowercase', value: 'lowercase' },
          { label: 'Capitalize', value: 'capitalize' },
        ]}
        onChange={(value) => setAttributes({ textTransform: value })}
      />

      <TextControl
        label={__('Letter Spacing', 'kriti-blocks')}
        help={__('e.g. 0.5px or -0.02em', 'kriti-blocks')}
        value={letterSpacing}
        onChange={(value) => setAttributes({ letterSpacing: value })}
      />

      <TextControl
        label={__('Line Height', 'kriti-blocks')}
        help={__('e.g. 1.5 or 1.2em', 'kriti-blocks')}
        value={lineHeight}
        onChange={(value) => setAttributes({ lineHeight: value })}
      />

      <ToggleControl
        label={__('Drop Cap', 'kriti-blocks')}
        help={__('Make the first letter larger.', 'kriti-blocks')}
        checked={dropCap}
        onChange={(value) => setAttributes({ dropCap: value })}
      />

      <ColorPalette
        asButtons="true"
        colors={colors}
        value={contentColor}
        onChange={(color) => setAttributes({ contentColor: color })}
        headingLevel="3"
      />
    </PanelBody>
  );
};

export default TextSettingsPanel;
