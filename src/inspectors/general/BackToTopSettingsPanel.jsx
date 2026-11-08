import {
  PanelBody,
  ColorPalette,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const BackToTopSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    position,
    offset,
    showAfter,
    buttonSize,
    iconSize,
    shape,
    backgroundColor,
    iconColor,
    ariaLabel,
    smooth,
  } = attributes;

  const colors = [
    { name: 'Indigo', color: '#4f46e5' },
    { name: 'Emerald', color: '#059669' },
    { name: 'Blue', color: '#2563eb' },
    { name: 'Amber', color: '#d97706' },
    { name: 'Rose', color: '#e11d48' },
    { name: 'Slate', color: '#334155' },
  ];

  return (
    <PanelBody
      title={__('Back To Top Settings', 'kriti-blocks')}
      initialOpen={true}
    >
      <SelectControl
        label={__('Position', 'kriti-blocks')}
        value={position}
        options={[
          {
            label: __('Bottom right', 'kriti-blocks'),
            value: 'bottom-right',
          },
          {
            label: __('Bottom left', 'kriti-blocks'),
            value: 'bottom-left',
          },
        ]}
        onChange={(value) => setAttributes({ position: value })}
      />

      <RangeControl
        label={__('Edge offset (px)', 'kriti-blocks')}
        value={offset}
        min={8}
        max={80}
        step={4}
        onChange={(value) => setAttributes({ offset: value })}
      />

      <RangeControl
        label={__('Show after scrolling (px)', 'kriti-blocks')}
        value={showAfter}
        min={0}
        max={1000}
        step={50}
        onChange={(value) => setAttributes({ showAfter: value })}
      />

      <SelectControl
        label={__('Shape', 'kriti-blocks')}
        value={shape}
        options={[
          { label: __('Circle', 'kriti-blocks'), value: 'circle' },
          {
            label: __('Rounded', 'kriti-blocks'),
            value: 'rounded',
          },
          { label: __('Square', 'kriti-blocks'), value: 'square' },
        ]}
        onChange={(value) => setAttributes({ shape: value })}
      />

      <RangeControl
        label={__('Button size (px)', 'kriti-blocks')}
        value={buttonSize}
        min={32}
        max={80}
        step={2}
        onChange={(value) => setAttributes({ buttonSize: value })}
      />

      <RangeControl
        label={__('Icon size (px)', 'kriti-blocks')}
        value={iconSize}
        min={12}
        max={32}
        step={2}
        onChange={(value) => setAttributes({ iconSize: value })}
      />

      <p>{__('Background color', 'kriti-blocks')}</p>
      <ColorPalette
        asButtons="true"
        colors={colors}
        value={backgroundColor}
        onChange={(color) => setAttributes({ backgroundColor: color })}
        headingLevel="3"
      />

      <p>{__('Icon color', 'kriti-blocks')}</p>
      <ColorPalette
        asButtons="true"
        colors={colors}
        value={iconColor}
        onChange={(color) => setAttributes({ iconColor: color })}
        headingLevel="3"
      />

      <TextControl
        label={__('Accessible label', 'kriti-blocks')}
        value={ariaLabel}
        onChange={(value) => setAttributes({ ariaLabel: value })}
      />

      <ToggleControl
        label={__('Smooth scrolling', 'kriti-blocks')}
        checked={!!smooth}
        onChange={(value) => setAttributes({ smooth: value })}
      />
    </PanelBody>
  );
};

export default BackToTopSettingsPanel;
