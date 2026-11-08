import { PanelColorSettings } from '@wordpress/block-editor';
import {
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

/**
 * Extra search options: button look, size, width, corner radius, category
 * filter and colours.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 */
export default function SearchOptionsPanel({ attributes, setAttributes }) {
  const {
    buttonStyle = 'text',
    size = 'md',
    maxWidth = 0,
    fieldAlign = 'left',
    fieldRadius = 8,
    showCategoryFilter = false,
    categoryLabel = '',
    postType = '',
  } = attributes;

  const colors = [
    ['buttonBg', __('Button background', 'kriti-blocks')],
    ['buttonColor', __('Button text', 'kriti-blocks')],
    ['buttonHoverBg', __('Button hover background', 'kriti-blocks')],
    ['inputBg', __('Field background', 'kriti-blocks')],
    ['inputBorder', __('Field border', 'kriti-blocks')],
  ].map(([name, label]) => ({
    value: attributes[name] || undefined,
    onChange: (value) => setAttributes({ [name]: value || '' }),
    label,
  }));

  return (
    <>
      <PanelBody
        title={__('Look & extras', 'kriti-blocks')}
        initialOpen={false}
      >
        <SelectControl
          label={__('Button shows', 'kriti-blocks')}
          value={buttonStyle}
          options={[
            { value: 'text', label: __('Text', 'kriti-blocks') },
            { value: 'icon', label: __('Search icon', 'kriti-blocks') },
          ]}
          onChange={(value) => setAttributes({ buttonStyle: value })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Size', 'kriti-blocks')}
          value={size}
          options={[
            { value: 'sm', label: __('Small', 'kriti-blocks') },
            { value: 'md', label: __('Medium', 'kriti-blocks') },
            { value: 'lg', label: __('Large', 'kriti-blocks') },
          ]}
          onChange={(value) => setAttributes({ size: value })}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Maximum width (px)', 'kriti-blocks')}
          help={__('0 uses the full width.', 'kriti-blocks')}
          value={maxWidth}
          min={0}
          max={1200}
          step={10}
          onChange={(value) => setAttributes({ maxWidth: value || 0 })}
          __nextHasNoMarginBottom
        />
        {maxWidth > 0 && (
          <SelectControl
            label={__('Position', 'kriti-blocks')}
            value={fieldAlign}
            options={[
              { value: 'left', label: __('Left', 'kriti-blocks') },
              { value: 'center', label: __('Center', 'kriti-blocks') },
              { value: 'right', label: __('Right', 'kriti-blocks') },
            ]}
            onChange={(value) => setAttributes({ fieldAlign: value })}
            __nextHasNoMarginBottom
          />
        )}
        <RangeControl
          label={__('Field corner radius (px)', 'kriti-blocks')}
          value={fieldRadius}
          min={0}
          max={40}
          onChange={(value) => setAttributes({ fieldRadius: value ?? 8 })}
          __nextHasNoMarginBottom
        />
        {(postType === '' || postType === 'post') && (
          <ToggleControl
            label={__('Show category filter', 'kriti-blocks')}
            checked={!!showCategoryFilter}
            onChange={(value) => setAttributes({ showCategoryFilter: value })}
            __nextHasNoMarginBottom
          />
        )}
        {showCategoryFilter && (
          <TextControl
            label={__('"All categories" label', 'kriti-blocks')}
            value={categoryLabel}
            onChange={(value) => setAttributes({ categoryLabel: value })}
            __nextHasNoMarginBottom
          />
        )}
      </PanelBody>
      <PanelColorSettings
        title={__('Search colors', 'kriti-blocks')}
        initialOpen={false}
        colorSettings={colors}
      />
    </>
  );
}
