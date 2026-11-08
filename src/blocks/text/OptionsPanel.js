import {
  PanelBody,
  RangeControl,
  SelectControl,
  __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import {
  FontFamilyFields,
  TEXT_SHADOW_CHOICES,
} from '../../shared/kbsb-controls';

export default function OptionsPanel({ attributes, setAttributes }) {
  const { textShadow, columns, columnGap, maxWidth, maxWidthUnit } = attributes;

  return (
    <PanelBody title={__('Text Options', 'kriti-blocks')} initialOpen={false}>
      <FontFamilyFields attributes={attributes} setAttributes={setAttributes} />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Text Shadow', 'kriti-blocks')}
        value={textShadow || ''}
        options={TEXT_SHADOW_CHOICES}
        onChange={(value) => setAttributes({ textShadow: value || undefined })}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Columns', 'kriti-blocks')}
        value={columns || 1}
        onChange={(value) =>
          setAttributes({ columns: value > 1 ? value : undefined })
        }
        min={1}
        max={4}
      />
      {columns > 1 && (
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Column Gap (px)', 'kriti-blocks')}
          value={columnGap ?? 32}
          onChange={(value) => setAttributes({ columnGap: value })}
          min={0}
          max={120}
        />
      )}
      <NumberControl
        label={__('Max Width', 'kriti-blocks')}
        help={__('Leave empty for full width.', 'kriti-blocks')}
        value={maxWidth ?? ''}
        min={1}
        onChange={(value) =>
          setAttributes({ maxWidth: value === '' ? undefined : Number(value) })
        }
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Max Width Unit', 'kriti-blocks')}
        value={maxWidthUnit || 'px'}
        options={[
          { label: 'px', value: 'px' },
          { label: '%', value: '%' },
          { label: 'em', value: 'em' },
          { label: 'ch', value: 'ch' },
        ]}
        onChange={(value) =>
          setAttributes({ maxWidthUnit: value === 'px' ? undefined : value })
        }
      />
    </PanelBody>
  );
}
