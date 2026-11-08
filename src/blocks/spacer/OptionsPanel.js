import {
  PanelBody,
  SelectControl,
  __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function OptionsPanel({ attributes, setAttributes }) {
  const { heightUnit, heightTablet, heightMobile } = attributes;
  const unit = heightUnit || 'px';

  const deviceField = (label, key, value) => (
    <NumberControl
      label={`${label} (${unit})`}
      help={__('Leave empty to use the main height.', 'kriti-blocks')}
      value={value ?? ''}
      min={0}
      onChange={(next) =>
        setAttributes({ [key]: next === '' ? undefined : Number(next) })
      }
    />
  );

  return (
    <PanelBody
      title={__('Responsive Height', 'kriti-blocks')}
      initialOpen={false}
    >
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Height unit', 'kriti-blocks')}
        value={unit}
        options={[
          { label: 'px', value: 'px' },
          { label: 'rem', value: 'rem' },
          { label: 'vh (screen height)', value: 'vh' },
        ]}
        onChange={(value) =>
          setAttributes({ heightUnit: value === 'px' ? undefined : value })
        }
      />
      {deviceField(
        __('Height on tablet', 'kriti-blocks'),
        'heightTablet',
        heightTablet,
      )}
      {deviceField(
        __('Height on mobile', 'kriti-blocks'),
        'heightMobile',
        heightMobile,
      )}
    </PanelBody>
  );
}
