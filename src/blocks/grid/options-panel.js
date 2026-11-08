import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const alignOptions = (first) => [
  { label: first, value: '' },
  { label: __('Start', 'kriti-blocks'), value: 'start' },
  { label: __('Center', 'kriti-blocks'), value: 'center' },
  { label: __('End', 'kriti-blocks'), value: 'end' },
];

export default function GridOptionsPanel({ attributes, setAttributes }) {
  const {
    colsTablet,
    colsMobile,
    autoFitMin,
    gridAlign,
    gridJustify,
    gridDense,
  } = attributes;
  const str = (key) => (value) => setAttributes({ [key]: value || undefined });

  return (
    <PanelBody title={__('Grid options', 'kriti-blocks')} initialOpen={false}>
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Columns on tablet (1024px and below)', 'kriti-blocks')}
        value={colsTablet}
        min={1}
        max={12}
        allowReset
        onChange={str('colsTablet')}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Columns on mobile (767px and below)', 'kriti-blocks')}
        value={colsMobile}
        min={1}
        max={12}
        allowReset
        onChange={str('colsMobile')}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Auto-fit: minimum column width (px)', 'kriti-blocks')}
        help={__(
          'Fills the row with as many columns as fit. Replaces the column count above; tablet and mobile counts still apply.',
          'kriti-blocks',
        )}
        value={autoFitMin}
        min={80}
        max={800}
        step={10}
        allowReset
        onChange={str('autoFitMin')}
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Align items vertically', 'kriti-blocks')}
        value={gridAlign || ''}
        options={alignOptions(__('Stretch', 'kriti-blocks'))}
        onChange={str('gridAlign')}
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Align items horizontally', 'kriti-blocks')}
        value={gridJustify || ''}
        options={alignOptions(__('Stretch', 'kriti-blocks'))}
        onChange={str('gridJustify')}
      />
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Dense packing', 'kriti-blocks')}
        help={__(
          'Fills gaps left by items that span several cells.',
          'kriti-blocks',
        )}
        checked={!!gridDense}
        onChange={str('gridDense')}
      />
    </PanelBody>
  );
}
