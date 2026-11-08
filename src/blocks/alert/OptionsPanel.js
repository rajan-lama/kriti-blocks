import {
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ColorField } from '../../shared/kbsb-controls';

export default function OptionsPanel({ attributes, setAttributes }) {
  const {
    showTitle,
    alertTitle,
    customIcon,
    iconSize,
    accentColor,
    dismissible,
    rememberDismiss,
    dismissKey,
    dismissDays,
    htmlId,
  } = attributes;

  return (
    <PanelBody title={__('Alert Options', 'kriti-blocks')} initialOpen={false}>
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Show title', 'kriti-blocks')}
        checked={!!(showTitle || alertTitle)}
        onChange={(value) =>
          setAttributes({
            showTitle: value || undefined,
            alertTitle: value ? alertTitle : undefined,
          })
        }
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Icon', 'kriti-blocks')}
        value={customIcon || ''}
        options={[
          { label: __('Match alert type', 'kriti-blocks'), value: '' },
          { label: __('Bell', 'kriti-blocks'), value: 'bell' },
          { label: __('Star', 'kriti-blocks'), value: 'star' },
          { label: __('Heart', 'kriti-blocks'), value: 'heart' },
          { label: __('Bolt', 'kriti-blocks'), value: 'bolt' },
          { label: __('Shield', 'kriti-blocks'), value: 'shield' },
          { label: __('Question', 'kriti-blocks'), value: 'question' },
        ]}
        onChange={(value) => setAttributes({ customIcon: value || undefined })}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Icon Size (px)', 'kriti-blocks')}
        value={iconSize ?? 20}
        onChange={(value) => setAttributes({ iconSize: value })}
        min={12}
        max={64}
        allowReset
        resetFallbackValue={undefined}
      />
      <ColorField
        label={__('Accent Color (border and icon)', 'kriti-blocks')}
        value={accentColor}
        onChange={(value) => setAttributes({ accentColor: value })}
      />
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Dismiss button', 'kriti-blocks')}
        checked={!!dismissible}
        onChange={(value) => setAttributes({ dismissible: value || undefined })}
      />
      {dismissible && (
        <>
          <ToggleControl
            __nextHasNoMarginBottom
            label={__('Remember dismissal (cookie)', 'kriti-blocks')}
            checked={!!rememberDismiss}
            onChange={(value) =>
              setAttributes({ rememberDismiss: value || undefined })
            }
          />
          {rememberDismiss && (
            <>
              <TextControl
                __nextHasNoMarginBottom
                label={__('Dismissal key', 'kriti-blocks')}
                help={
                  htmlId
                    ? __('Leave empty to use the HTML ID.', 'kriti-blocks')
                    : __(
                        'Letters, numbers, dash and underscore. Required, or set an HTML ID.',
                        'kriti-blocks',
                      )
                }
                value={dismissKey || ''}
                onChange={(value) =>
                  setAttributes({ dismissKey: value || undefined })
                }
              />
              <RangeControl
                __nextHasNoMarginBottom
                label={__('Stay hidden for (days)', 'kriti-blocks')}
                value={dismissDays ?? 30}
                onChange={(value) => setAttributes({ dismissDays: value })}
                min={1}
                max={365}
              />
            </>
          )}
        </>
      )}
    </PanelBody>
  );
}
