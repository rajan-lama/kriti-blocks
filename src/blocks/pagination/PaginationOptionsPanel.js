import { PanelColorSettings } from '@wordpress/block-editor';
import { PanelBody, SelectControl, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export const STYLE_OPTIONS = () => [
  { value: 'outline', label: __('Outline', 'kriti-blocks') },
  { value: 'solid', label: __('Solid', 'kriti-blocks') },
  { value: 'pill', label: __('Pill', 'kriti-blocks') },
  { value: 'minimal', label: __('Minimal', 'kriti-blocks') },
];

export const SIZE_OPTIONS = () => [
  { value: 'sm', label: __('Small', 'kriti-blocks') },
  { value: 'md', label: __('Medium', 'kriti-blocks') },
  { value: 'lg', label: __('Large', 'kriti-blocks') },
];

export const ARROW_OPTIONS = () => [
  { value: 'text', label: __('Text only', 'kriti-blocks') },
  { value: 'both', label: __('Arrow and text', 'kriti-blocks') },
  { value: 'arrows', label: __('Arrow only', 'kriti-blocks') },
];

/**
 * Builds the colour settings for PanelColorSettings. Colours are stored as hex
 * strings and validated again on the server.
 *
 * @param {Object}   attributes    Block attributes.
 * @param {Function} setAttributes Attribute setter.
 * @return {Object[]} Colour settings.
 */
export function buildColorSettings(attributes, setAttributes) {
  const fields = [
    ['linkColor', __('Text', 'kriti-blocks')],
    ['linkBg', __('Background', 'kriti-blocks')],
    ['linkBorder', __('Border', 'kriti-blocks')],
    ['hoverColor', __('Hover text', 'kriti-blocks')],
    ['hoverBg', __('Hover background', 'kriti-blocks')],
    ['hoverBorder', __('Hover border', 'kriti-blocks')],
    ['currentColor', __('Current page text', 'kriti-blocks')],
    ['currentBg', __('Current page background', 'kriti-blocks')],
  ];

  return fields.map(([name, label]) => ({
    value: attributes[name] || undefined,
    onChange: (value) => setAttributes({ [name]: value || '' }),
    label,
  }));
}

/**
 * Extra pagination options: style, size, arrows, first / last, page info and colours.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 */
export default function PaginationOptionsPanel({ attributes, setAttributes }) {
  const {
    paginationStyle = 'outline',
    size = 'md',
    arrowStyle = 'text',
    showFirstLast = false,
    showPageInfo = false,
  } = attributes;

  return (
    <>
      <PanelBody
        title={__('Look & extras', 'kriti-blocks')}
        initialOpen={false}
      >
        <SelectControl
          label={__('Style', 'kriti-blocks')}
          value={paginationStyle}
          options={STYLE_OPTIONS()}
          onChange={(value) => setAttributes({ paginationStyle: value })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Size', 'kriti-blocks')}
          value={size}
          options={SIZE_OPTIONS()}
          onChange={(value) => setAttributes({ size: value })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Previous / next arrows', 'kriti-blocks')}
          value={arrowStyle}
          options={ARROW_OPTIONS()}
          onChange={(value) => setAttributes({ arrowStyle: value })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Show first and last links', 'kriti-blocks')}
          checked={!!showFirstLast}
          onChange={(value) => setAttributes({ showFirstLast: value })}
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Show "Page X of Y"', 'kriti-blocks')}
          checked={!!showPageInfo}
          onChange={(value) => setAttributes({ showPageInfo: value })}
          __nextHasNoMarginBottom
        />
      </PanelBody>
      <PanelColorSettings
        title={__('Pagination colors', 'kriti-blocks')}
        initialOpen={false}
        colorSettings={buildColorSettings(attributes, setAttributes)}
      />
    </>
  );
}
