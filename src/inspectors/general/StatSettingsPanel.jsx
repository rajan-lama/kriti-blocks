import {
  PanelBody,
  ButtonGroup,
  Button,
  ToggleControl,
  TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const StatSettingsPanel = ({ attributes, setAttributes }) => {
  const { statAlign, enableCount } = attributes;

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  return (
    <PanelBody title={__('Stat Settings', 'kriti-blocks')} initialOpen={true}>
      <ButtonGroup aria-label={__('Alignment', 'kriti-blocks')}>
        {alignmentOptions.map((option) => (
          <Button
            key={option.value}
            variant="secondary"
            isSmall
            onClick={() => setAttributes({ statAlign: option.value })}
            isPressed={statAlign === option.value}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>

      <TextControl
        label={__('Prefix', 'kriti-blocks')}
        help={__('Shown before the number, for example $.', 'kriti-blocks')}
        value={attributes.statPrefix}
        onChange={(value) => setAttributes({ statPrefix: value })}
      />

      <TextControl
        label={__('Suffix', 'kriti-blocks')}
        help={__('Shown after the number, for example %.', 'kriti-blocks')}
        value={attributes.statSuffix}
        onChange={(value) => setAttributes({ statSuffix: value })}
      />

      <ToggleControl
        label={__('Animate number (count up)', 'kriti-blocks')}
        help={__('Counts up when the stat scrolls into view.', 'kriti-blocks')}
        checked={!!enableCount}
        onChange={(value) => setAttributes({ enableCount: value })}
      />
    </PanelBody>
  );
};

export default StatSettingsPanel;
