import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

// The layout attributes default to "normal", which means "use the CSS default".
const flexOptions = (choices) => [
  { label: __('Default', 'kriti-blocks'), value: 'normal' },
  ...choices,
];

export default function RowOptionsPanel({ attributes, setAttributes }) {
  const {
    rowDirection,
    flexWrap,
    justifyContent,
    alignItem,
    equalItems,
    stackOn,
    stackReverse,
    gapTablet,
    gapMobile,
  } = attributes;
  const flex = (key) => (value) => setAttributes({ [key]: value });
  const flag = (key) => (value) => setAttributes({ [key]: value || undefined });

  return (
    <PanelBody title={__('Flex layout', 'kriti-blocks')} initialOpen={true}>
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Direction', 'kriti-blocks')}
        value={rowDirection || 'normal'}
        options={flexOptions([
          { label: __('Row', 'kriti-blocks'), value: 'row' },
          { label: __('Row reversed', 'kriti-blocks'), value: 'row-reverse' },
          { label: __('Column', 'kriti-blocks'), value: 'column' },
          {
            label: __('Column reversed', 'kriti-blocks'),
            value: 'column-reverse',
          },
        ])}
        onChange={flex('rowDirection')}
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Wrap', 'kriti-blocks')}
        value={flexWrap || 'normal'}
        options={flexOptions([
          { label: __('No wrap', 'kriti-blocks'), value: 'nowrap' },
          { label: __('Wrap', 'kriti-blocks'), value: 'wrap' },
          { label: __('Wrap reversed', 'kriti-blocks'), value: 'wrap-reverse' },
        ])}
        onChange={flex('flexWrap')}
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Justify content', 'kriti-blocks')}
        value={justifyContent || 'normal'}
        options={flexOptions([
          { label: __('Start', 'kriti-blocks'), value: 'flex-start' },
          { label: __('Center', 'kriti-blocks'), value: 'center' },
          { label: __('End', 'kriti-blocks'), value: 'flex-end' },
          {
            label: __('Space between', 'kriti-blocks'),
            value: 'space-between',
          },
          { label: __('Space around', 'kriti-blocks'), value: 'space-around' },
          { label: __('Space evenly', 'kriti-blocks'), value: 'space-evenly' },
        ])}
        onChange={flex('justifyContent')}
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Align items', 'kriti-blocks')}
        value={alignItem || 'normal'}
        options={flexOptions([
          { label: __('Stretch', 'kriti-blocks'), value: 'stretch' },
          { label: __('Start', 'kriti-blocks'), value: 'flex-start' },
          { label: __('Center', 'kriti-blocks'), value: 'center' },
          { label: __('End', 'kriti-blocks'), value: 'flex-end' },
          { label: __('Baseline', 'kriti-blocks'), value: 'baseline' },
        ])}
        onChange={flex('alignItem')}
      />
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Equal width items', 'kriti-blocks')}
        help={__('Every item shares the row width equally.', 'kriti-blocks')}
        checked={!!equalItems}
        onChange={flag('equalItems')}
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Stack items', 'kriti-blocks')}
        value={stackOn || ''}
        options={[
          { label: __('Never', 'kriti-blocks'), value: '' },
          {
            label: __('On tablet and mobile (1024px)', 'kriti-blocks'),
            value: 'tablet',
          },
          { label: __('On mobile (767px)', 'kriti-blocks'), value: 'mobile' },
        ]}
        onChange={(value) => setAttributes({ stackOn: value || undefined })}
      />
      {stackOn && (
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Reverse order when stacked', 'kriti-blocks')}
          checked={!!stackReverse}
          onChange={flag('stackReverse')}
        />
      )}
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Gap on tablet (px)', 'kriti-blocks')}
        value={gapTablet}
        min={0}
        max={200}
        allowReset
        onChange={(value) => setAttributes({ gapTablet: value })}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Gap on mobile (px)', 'kriti-blocks')}
        value={gapMobile}
        min={0}
        max={200}
        allowReset
        onChange={(value) => setAttributes({ gapMobile: value })}
      />
    </PanelBody>
  );
}
