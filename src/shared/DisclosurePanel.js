import { __ } from '@wordpress/i18n';
import { PanelColorSettings } from '@wordpress/block-editor';
import {
  PanelBody,
  SelectControl,
  RangeControl,
  ToggleControl,
} from '@wordpress/components';

/**
 * Sidebar panels for the options in ./disclosure.js.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @param {boolean}  props.schemaHelp    Show the FAQ schema toggle.
 */
export default function DisclosurePanel({ attributes, setAttributes }) {
  const {
    iconStyle,
    iconPosition,
    itemGap,
    itemRadius,
    faqSchema,
    titleColor,
    itemBg,
    openBg,
    hoverBg,
    borderColor,
    iconColor,
  } = attributes;

  return (
    <>
      <PanelBody
        title={__('Icon & spacing', 'kriti-blocks')}
        initialOpen={false}
      >
        <SelectControl
          label={__('Icon', 'kriti-blocks')}
          value={iconStyle || 'chevron'}
          options={[
            { value: 'chevron', label: __('Chevron', 'kriti-blocks') },
            { value: 'plus', label: __('Plus / minus', 'kriti-blocks') },
            { value: 'caret', label: __('Triangle', 'kriti-blocks') },
            { value: 'none', label: __('None', 'kriti-blocks') },
          ]}
          onChange={(v) => setAttributes({ iconStyle: v })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Icon position', 'kriti-blocks')}
          value={iconPosition || 'right'}
          options={[
            { value: 'right', label: __('Right', 'kriti-blocks') },
            { value: 'left', label: __('Left', 'kriti-blocks') },
          ]}
          onChange={(v) => setAttributes({ iconPosition: v })}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Space between items (px)', 'kriti-blocks')}
          value={itemGap}
          min={0}
          max={48}
          allowReset
          onChange={(v) => setAttributes({ itemGap: v })}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Corner radius (px)', 'kriti-blocks')}
          value={itemRadius}
          min={0}
          max={32}
          allowReset
          onChange={(v) => setAttributes({ itemRadius: v })}
          __nextHasNoMarginBottom
        />
      </PanelBody>

      <PanelColorSettings
        title={__('Colors', 'kriti-blocks')}
        initialOpen={false}
        colorSettings={[
          {
            label: __('Title text', 'kriti-blocks'),
            value: titleColor,
            onChange: (v) => setAttributes({ titleColor: v }),
          },
          {
            label: __('Item background', 'kriti-blocks'),
            value: itemBg,
            onChange: (v) => setAttributes({ itemBg: v }),
          },
          {
            label: __('Background when open', 'kriti-blocks'),
            value: openBg,
            onChange: (v) => setAttributes({ openBg: v }),
          },
          {
            label: __('Title background on hover', 'kriti-blocks'),
            value: hoverBg,
            onChange: (v) => setAttributes({ hoverBg: v }),
          },
          {
            label: __('Border', 'kriti-blocks'),
            value: borderColor,
            onChange: (v) => setAttributes({ borderColor: v }),
          },
          {
            label: __('Icon', 'kriti-blocks'),
            value: iconColor,
            onChange: (v) => setAttributes({ iconColor: v }),
          },
        ]}
      />

      <PanelBody title={__('SEO', 'kriti-blocks')} initialOpen={false}>
        <ToggleControl
          label={__('Add FAQ structured data', 'kriti-blocks')}
          help={__(
            'Adds FAQPage JSON-LD for search engines. Only use it when the items are real questions and answers.',
            'kriti-blocks',
          )}
          checked={!!faqSchema}
          onChange={(v) => setAttributes({ faqSchema: v })}
          __nextHasNoMarginBottom
        />
      </PanelBody>
    </>
  );
}
