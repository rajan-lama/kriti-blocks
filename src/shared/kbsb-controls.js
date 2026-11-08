import {
  BaseControl,
  ColorPalette,
  SelectControl,
  TextControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * A labelled color picker that can be cleared.
 *
 * @param {Object}   props          Component props.
 * @param {string}   props.label    Field label.
 * @param {string}   props.value    Current color.
 * @param {Function} props.onChange Called with the color or undefined.
 * @return {Element} Control.
 */
export const ColorField = ({ label, value, onChange }) => (
  <BaseControl __nextHasNoMarginBottom>
    <BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>
    <ColorPalette
      value={value}
      onChange={(color) => onChange(color || undefined)}
      enableAlpha
      clearable
      headingLevel="3"
    />
  </BaseControl>
);

/**
 * Font family choice with an optional custom family list.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {Element} Controls.
 */
export const FontFamilyFields = ({ attributes, setAttributes }) => (
  <>
    <SelectControl
      __nextHasNoMarginBottom
      label={__('Font Family', 'kriti-blocks')}
      value={attributes.fontFamily || ''}
      options={[
        { label: __('Theme default', 'kriti-blocks'), value: '' },
        { label: __('Sans serif', 'kriti-blocks'), value: 'sans' },
        { label: __('Serif', 'kriti-blocks'), value: 'serif' },
        { label: __('Monospace', 'kriti-blocks'), value: 'mono' },
        { label: __('Custom', 'kriti-blocks'), value: 'custom' },
      ]}
      onChange={(value) => setAttributes({ fontFamily: value || undefined })}
    />
    {attributes.fontFamily === 'custom' && (
      <TextControl
        __nextHasNoMarginBottom
        label={__('Custom font family', 'kriti-blocks')}
        help={__(
          'Letters, numbers, commas and quotes only. The font must already be loaded by your theme.',
          'kriti-blocks',
        )}
        value={attributes.fontFamilyCustom || ''}
        onChange={(value) =>
          setAttributes({ fontFamilyCustom: value || undefined })
        }
      />
    )}
  </>
);

export const TEXT_SHADOW_CHOICES = [
  { label: __('None', 'kriti-blocks'), value: '' },
  { label: __('Soft', 'kriti-blocks'), value: 'soft' },
  { label: __('Medium', 'kriti-blocks'), value: 'medium' },
  { label: __('Strong', 'kriti-blocks'), value: 'strong' },
  { label: __('Glow', 'kriti-blocks'), value: 'glow' },
];
