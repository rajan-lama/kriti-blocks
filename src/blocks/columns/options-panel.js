import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function ColumnsOptionsPanel({ attributes, setAttributes }) {
  const {
    rowAlign,
    rowJustify,
    rowReverse,
    stackOn,
    stackReverse,
    colGap,
    rowGapY,
  } = attributes;
  const set = (key) => (value) =>
    setAttributes({
      [key]: value === '' || value === false ? undefined : value,
    });

  return (
    <PanelBody
      title={__('Columns options', 'kriti-blocks')}
      initialOpen={false}
    >
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Space between columns (px)', 'kriti-blocks')}
        value={colGap}
        min={0}
        max={120}
        allowReset
        onChange={(value) => setAttributes({ colGap: value })}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Space between rows when wrapped (px)', 'kriti-blocks')}
        value={rowGapY}
        min={0}
        max={120}
        allowReset
        onChange={(value) => setAttributes({ rowGapY: value })}
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Vertical alignment', 'kriti-blocks')}
        value={rowAlign || ''}
        options={[
          { label: __('Stretch (equal height)', 'kriti-blocks'), value: '' },
          { label: __('Top', 'kriti-blocks'), value: 'start' },
          { label: __('Middle', 'kriti-blocks'), value: 'center' },
          { label: __('Bottom', 'kriti-blocks'), value: 'end' },
        ]}
        onChange={set('rowAlign')}
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Horizontal distribution', 'kriti-blocks')}
        help={__(
          'Matters when the column widths do not fill the row.',
          'kriti-blocks',
        )}
        value={rowJustify || ''}
        options={[
          { label: __('Start', 'kriti-blocks'), value: '' },
          { label: __('Center', 'kriti-blocks'), value: 'center' },
          { label: __('End', 'kriti-blocks'), value: 'end' },
          { label: __('Space between', 'kriti-blocks'), value: 'between' },
          { label: __('Space around', 'kriti-blocks'), value: 'around' },
        ]}
        onChange={set('rowJustify')}
      />
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Reverse column order', 'kriti-blocks')}
        checked={!!rowReverse}
        onChange={set('rowReverse')}
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Stack columns', 'kriti-blocks')}
        help={__(
          'Columns go full width one under another at this screen size and below. A column can keep its own width in its settings.',
          'kriti-blocks',
        )}
        value={stackOn || ''}
        options={[
          { label: __('Never', 'kriti-blocks'), value: '' },
          {
            label: __('On tablet and mobile (1024px)', 'kriti-blocks'),
            value: 'tablet',
          },
          { label: __('On mobile (767px)', 'kriti-blocks'), value: 'mobile' },
        ]}
        onChange={set('stackOn')}
      />
      {stackOn && (
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Reverse order when stacked', 'kriti-blocks')}
          checked={!!stackReverse}
          onChange={set('stackReverse')}
        />
      )}
    </PanelBody>
  );
}
