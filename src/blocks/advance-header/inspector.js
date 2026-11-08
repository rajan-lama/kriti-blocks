import { InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  ColorPalette,
  BaseControl,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const ColorField = ({ label, value, onChange }) => (
  <BaseControl __nextHasNoMarginBottom>
    <BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>
    <ColorPalette
      value={value}
      onChange={(color) => onChange(color || undefined)}
      headingLevel={3}
    />
  </BaseControl>
);

export default function Inspector({ attributes, setAttributes }) {
  const {
    subtitle,
    linkUrl,
    linkNewTab,
    headerBgColor,
    headerTextColor,
    headerIcon,
    iconPosition,
    headerIconColor,
    borderStyle,
    borderWidth,
    borderColor,
    borderRadius,
    marginBottom,
  } = attributes;
  const set = (key) => (value) =>
    setAttributes({
      [key]: value === '' || value === false ? undefined : value,
    });

  return (
    <InspectorControls>
      <PanelBody title={__('Heading', 'kriti-blocks')} initialOpen>
        <TextControl
          __nextHasNoMarginBottom
          label={__('Subtitle', 'kriti-blocks')}
          help={__('Optional line shown under the heading.', 'kriti-blocks')}
          value={subtitle || ''}
          onChange={set('subtitle')}
        />
        <TextControl
          __nextHasNoMarginBottom
          label={__('Link', 'kriti-blocks')}
          type="url"
          value={linkUrl || ''}
          onChange={set('linkUrl')}
        />
        {linkUrl && (
          <ToggleControl
            __nextHasNoMarginBottom
            label={__('Open in a new tab', 'kriti-blocks')}
            checked={!!linkNewTab}
            onChange={set('linkNewTab')}
          />
        )}
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Icon', 'kriti-blocks')}
          value={headerIcon || ''}
          options={[
            { label: __('None', 'kriti-blocks'), value: '' },
            { label: __('Chevron', 'kriti-blocks'), value: 'chevron' },
            { label: __('Arrow', 'kriti-blocks'), value: 'arrow' },
            { label: __('Star', 'kriti-blocks'), value: 'star' },
            { label: __('Check', 'kriti-blocks'), value: 'check' },
            { label: __('Plus', 'kriti-blocks'), value: 'plus' },
          ]}
          onChange={set('headerIcon')}
        />
        {headerIcon && (
          <>
            <SelectControl
              __nextHasNoMarginBottom
              label={__('Icon position', 'kriti-blocks')}
              value={iconPosition || 'before'}
              options={[
                {
                  label: __('Before the text', 'kriti-blocks'),
                  value: 'before',
                },
                { label: __('After the text', 'kriti-blocks'), value: 'after' },
              ]}
              onChange={(value) =>
                setAttributes({
                  iconPosition: value === 'before' ? undefined : value,
                })
              }
            />
            <ColorField
              label={__('Icon color', 'kriti-blocks')}
              value={headerIconColor}
              onChange={set('headerIconColor')}
            />
          </>
        )}
      </PanelBody>
      <PanelBody
        title={__('Heading style', 'kriti-blocks')}
        initialOpen={false}
      >
        <ColorField
          label={__('Text color', 'kriti-blocks')}
          value={headerTextColor}
          onChange={set('headerTextColor')}
        />
        <ColorField
          label={__('Background color', 'kriti-blocks')}
          value={headerBgColor}
          onChange={set('headerBgColor')}
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Border width (px)', 'kriti-blocks')}
          value={borderWidth || 0}
          min={0}
          max={20}
          onChange={(value) => setAttributes({ borderWidth: value || 0 })}
        />
        {!!borderWidth && (
          <>
            <SelectControl
              __nextHasNoMarginBottom
              label={__('Border style', 'kriti-blocks')}
              value={borderStyle || 'solid'}
              options={[
                { label: __('Solid', 'kriti-blocks'), value: 'solid' },
                { label: __('Dashed', 'kriti-blocks'), value: 'dashed' },
                { label: __('Dotted', 'kriti-blocks'), value: 'dotted' },
                { label: __('Double', 'kriti-blocks'), value: 'double' },
              ]}
              onChange={(value) => setAttributes({ borderStyle: value })}
            />
            <ColorField
              label={__('Border color', 'kriti-blocks')}
              value={borderColor}
              onChange={set('borderColor')}
            />
          </>
        )}
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Corner radius (px)', 'kriti-blocks')}
          value={borderRadius}
          min={0}
          max={60}
          allowReset
          onChange={(value) => setAttributes({ borderRadius: value })}
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Space below (px)', 'kriti-blocks')}
          value={marginBottom}
          min={0}
          max={120}
          allowReset
          onChange={(value) => setAttributes({ marginBottom: value })}
        />
      </PanelBody>
    </InspectorControls>
  );
}
