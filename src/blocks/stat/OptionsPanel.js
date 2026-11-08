import {
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
  __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ColorField } from '../../shared/kbsb-controls';

export default function OptionsPanel({ attributes, setAttributes }) {
  const {
    enableCount,
    startValue,
    countDuration,
    decimals,
    separator,
    easing,
    valueColor,
    labelColor,
    valueSize,
    showProgress,
    progressValue,
    progressColor,
  } = attributes;

  return (
    <>
      {enableCount !== false && (
        <PanelBody
          title={__('Count-up Options', 'kriti-blocks')}
          initialOpen={false}
        >
          <NumberControl
            label={__('Start value', 'kriti-blocks')}
            value={startValue ?? 0}
            onChange={(value) =>
              setAttributes({
                startValue:
                  value === '' || Number(value) === 0
                    ? undefined
                    : Number(value),
              })
            }
          />
          <RangeControl
            __nextHasNoMarginBottom
            label={__('Duration (ms)', 'kriti-blocks')}
            value={countDuration ?? 1400}
            onChange={(value) => setAttributes({ countDuration: value })}
            min={200}
            max={10000}
            step={100}
            allowReset
            resetFallbackValue={undefined}
          />
          <SelectControl
            __nextHasNoMarginBottom
            label={__('Decimal places', 'kriti-blocks')}
            value={decimals === undefined ? '' : String(decimals)}
            options={[
              { label: __('Match the number', 'kriti-blocks'), value: '' },
              ...[0, 1, 2, 3, 4].map((n) => ({
                label: String(n),
                value: String(n),
              })),
            ]}
            onChange={(value) =>
              setAttributes({
                decimals: value === '' ? undefined : Number(value),
              })
            }
          />
          <SelectControl
            __nextHasNoMarginBottom
            label={__('Thousands separator', 'kriti-blocks')}
            value={separator || ''}
            options={[
              { label: __('Match the number', 'kriti-blocks'), value: '' },
              { label: __('Comma (1,000)', 'kriti-blocks'), value: 'comma' },
              { label: __('Space (1 000)', 'kriti-blocks'), value: 'space' },
              { label: __('Dot (1.000)', 'kriti-blocks'), value: 'dot' },
              { label: __('None (1000)', 'kriti-blocks'), value: 'none' },
            ]}
            onChange={(value) =>
              setAttributes({ separator: value || undefined })
            }
          />
          <SelectControl
            __nextHasNoMarginBottom
            label={__('Easing', 'kriti-blocks')}
            value={easing || ''}
            options={[
              { label: __('Ease out', 'kriti-blocks'), value: '' },
              { label: __('Linear', 'kriti-blocks'), value: 'linear' },
              { label: __('Ease in and out', 'kriti-blocks'), value: 'inout' },
            ]}
            onChange={(value) => setAttributes({ easing: value || undefined })}
          />
        </PanelBody>
      )}

      <PanelBody
        title={__('Stat Appearance', 'kriti-blocks')}
        initialOpen={false}
      >
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Number Size (px)', 'kriti-blocks')}
          value={valueSize ?? 52}
          onChange={(value) => setAttributes({ valueSize: value })}
          min={12}
          max={200}
          allowReset
          resetFallbackValue={undefined}
        />
        <ColorField
          label={__('Number Color', 'kriti-blocks')}
          value={valueColor}
          onChange={(value) => setAttributes({ valueColor: value })}
        />
        <ColorField
          label={__('Label Color', 'kriti-blocks')}
          value={labelColor}
          onChange={(value) => setAttributes({ labelColor: value })}
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Progress bar', 'kriti-blocks')}
          checked={!!showProgress}
          onChange={(value) =>
            setAttributes({ showProgress: value || undefined })
          }
        />
        {showProgress && (
          <>
            <RangeControl
              __nextHasNoMarginBottom
              label={__('Progress (%)', 'kriti-blocks')}
              value={progressValue ?? 50}
              onChange={(value) => setAttributes({ progressValue: value })}
              min={0}
              max={100}
            />
            <ColorField
              label={__('Bar Color', 'kriti-blocks')}
              value={progressColor}
              onChange={(value) => setAttributes({ progressColor: value })}
            />
          </>
        )}
      </PanelBody>
    </>
  );
}
