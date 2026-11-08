import {
  PanelBody,
  SelectControl,
  ButtonGroup,
  Button,
  ColorPalette,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const QuoteSettingsPanel = ({ attributes, setAttributes }) => {
  const { quoteAlign, quoteSize, borderColor } = attributes;

  const colors = [
    { name: 'Accent', color: '#4f46e5' },
    { name: 'Green', color: '#10b981' },
    { name: 'Red', color: '#ef4444' },
    { name: 'Gray', color: '#6b7280' },
  ];

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  return (
    <PanelBody title={__('Quote Settings', 'kriti-blocks')} initialOpen={true}>
      <ButtonGroup aria-label={__('Quote Alignment', 'kriti-blocks')}>
        {alignmentOptions.map((option) => (
          <Button
            key={option.value}
            variant="secondary"
            isSmall
            onClick={() => setAttributes({ quoteAlign: option.value })}
            isPressed={quoteAlign === option.value}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>

      <SelectControl
        label={__('Size', 'kriti-blocks')}
        value={quoteSize}
        options={[
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
        ]}
        onChange={(value) => setAttributes({ quoteSize: value })}
      />

      <ColorPalette
        asButtons="true"
        colors={colors}
        value={borderColor}
        onChange={(color) => setAttributes({ borderColor: color })}
        headingLevel="3"
      />
    </PanelBody>
  );
};

export default QuoteSettingsPanel;
