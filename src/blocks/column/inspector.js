import { InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const widthOptions = [
  { label: __('Same as desktop', 'kriti-blocks'), value: '' },
  ...Array.from({ length: 12 }, (_, i) => ({
    label: `${i + 1}/12`,
    value: String(i + 1),
  })),
];

export default function Inspector({ attributes, setAttributes }) {
  const { colTablet, colMobile, selfAlign, mobileOrder, sticky, stickyTop } =
    attributes;
  const num = (key) => (value) =>
    setAttributes({ [key]: value ? Number(value) : undefined });
  const str = (key) => (value) => setAttributes({ [key]: value || undefined });

  return (
    <InspectorControls>
      <PanelBody
        title={__('Column options', 'kriti-blocks')}
        initialOpen={true}
      >
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Width on tablet (1024px and below)', 'kriti-blocks')}
          value={colTablet ? String(colTablet) : ''}
          options={widthOptions}
          onChange={num('colTablet')}
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Width on mobile (767px and below)', 'kriti-blocks')}
          help={__(
            'Overrides "Stack columns" from the Columns block for this column.',
            'kriti-blocks',
          )}
          value={colMobile ? String(colMobile) : ''}
          options={widthOptions}
          onChange={num('colMobile')}
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Vertical alignment', 'kriti-blocks')}
          value={selfAlign || ''}
          options={[
            { label: __('Follow the row', 'kriti-blocks'), value: '' },
            { label: __('Top', 'kriti-blocks'), value: 'start' },
            { label: __('Middle', 'kriti-blocks'), value: 'center' },
            { label: __('Bottom', 'kriti-blocks'), value: 'end' },
          ]}
          onChange={str('selfAlign')}
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Order on mobile', 'kriti-blocks')}
          value={mobileOrder || ''}
          options={[
            { label: __('Normal', 'kriti-blocks'), value: '' },
            { label: __('Show first', 'kriti-blocks'), value: 'first' },
            { label: __('Show last', 'kriti-blocks'), value: 'last' },
          ]}
          onChange={str('mobileOrder')}
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Sticky column', 'kriti-blocks')}
          help={__(
            'Stays in view while the rest of the row scrolls. Off on tablet and mobile.',
            'kriti-blocks',
          )}
          checked={!!sticky}
          onChange={(value) => setAttributes({ sticky: value || undefined })}
        />
        {sticky && (
          <RangeControl
            __nextHasNoMarginBottom
            label={__('Distance from top (px)', 'kriti-blocks')}
            value={stickyTop}
            min={0}
            max={200}
            allowReset
            onChange={(value) =>
              setAttributes({ stickyTop: value || undefined })
            }
          />
        )}
      </PanelBody>
    </InspectorControls>
  );
}
