import {
  PanelBody,
  ColorPalette,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
  BaseControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const COLORS = [
  { name: __('Indigo', 'kriti-blocks'), color: '#4f46e5' },
  { name: __('Emerald', 'kriti-blocks'), color: '#059669' },
  { name: __('Blue', 'kriti-blocks'), color: '#2563eb' },
  { name: __('Amber', 'kriti-blocks'), color: '#d97706' },
  { name: __('Rose', 'kriti-blocks'), color: '#e11d48' },
  { name: __('White', 'kriti-blocks'), color: '#ffffff' },
  { name: __('Slate', 'kriti-blocks'), color: '#334155' },
];

const ColorField = ({ id, label, value, onChange }) => (
  <BaseControl __nextHasNoMarginBottom id={id} label={label}>
    <ColorPalette
      colors={COLORS}
      value={value}
      onChange={onChange}
      headingLevel={3}
    />
  </BaseControl>
);

export default function BackToTopOptionsPanel({ attributes, setAttributes }) {
  const {
    hoverBackground,
    hoverIconColor,
    iconType,
    label,
    scrollDuration,
    showProgress,
    progressColor,
    borderWidth,
    borderColor,
    shadowStyle,
  } = attributes;
  const set = (key) => (value) => setAttributes({ [key]: value || undefined });

  return (
    <PanelBody title={__('Button options', 'kriti-blocks')} initialOpen={false}>
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Icon', 'kriti-blocks')}
        value={iconType || ''}
        options={[
          { label: __('Arrow (default)', 'kriti-blocks'), value: '' },
          { label: __('Thin arrow', 'kriti-blocks'), value: 'arrow' },
          { label: __('Chevron', 'kriti-blocks'), value: 'chevron' },
          { label: __('Double chevron', 'kriti-blocks'), value: 'double' },
        ]}
        onChange={set('iconType')}
      />
      <TextControl
        __nextHasNoMarginBottom
        label={__('Text label', 'kriti-blocks')}
        help={__(
          'Shown next to the icon. Leave empty for an icon-only button.',
          'kriti-blocks',
        )}
        value={label || ''}
        maxLength={30}
        onChange={set('label')}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Scroll duration (ms)', 'kriti-blocks')}
        help={__(
          'Used with smooth scrolling. Empty uses the browser default.',
          'kriti-blocks',
        )}
        value={scrollDuration}
        min={100}
        max={3000}
        step={100}
        allowReset
        onChange={set('scrollDuration')}
      />
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Scroll progress ring', 'kriti-blocks')}
        checked={!!showProgress}
        onChange={set('showProgress')}
      />
      {showProgress && (
        <ColorField
          id="kb-btt-ring"
          label={__('Progress ring color', 'kriti-blocks')}
          value={progressColor}
          onChange={set('progressColor')}
        />
      )}
      <ColorField
        id="kb-btt-hover-bg"
        label={__('Hover background', 'kriti-blocks')}
        value={hoverBackground}
        onChange={set('hoverBackground')}
      />
      <ColorField
        id="kb-btt-hover-icon"
        label={__('Hover icon color', 'kriti-blocks')}
        value={hoverIconColor}
        onChange={set('hoverIconColor')}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Border width (px)', 'kriti-blocks')}
        value={borderWidth || 0}
        min={0}
        max={10}
        onChange={set('borderWidth')}
      />
      {!!borderWidth && (
        <ColorField
          id="kb-btt-border"
          label={__('Border color', 'kriti-blocks')}
          value={borderColor}
          onChange={set('borderColor')}
        />
      )}
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Shadow', 'kriti-blocks')}
        value={shadowStyle || ''}
        options={[
          { label: __('Default', 'kriti-blocks'), value: '' },
          { label: __('None', 'kriti-blocks'), value: 'none' },
          { label: __('Large', 'kriti-blocks'), value: 'large' },
        ]}
        onChange={set('shadowStyle')}
      />
    </PanelBody>
  );
}
