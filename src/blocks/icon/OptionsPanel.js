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
    hoverColor,
    hoverBg,
    rotation,
    sizeTablet,
    sizeMobile,
    iconAlign,
    label,
    labelPosition,
    linkUrl,
    linkNewTab,
    linkNofollow,
    ariaLabel,
    size,
  } = attributes;

  return (
    <>
      <PanelBody
        title={__('Icon Appearance', 'kriti-blocks')}
        initialOpen={false}
      >
        <ColorField
          label={__('Hover Icon Color', 'kriti-blocks')}
          value={hoverColor}
          onChange={(value) => setAttributes({ hoverColor: value })}
        />
        <ColorField
          label={__('Hover Background', 'kriti-blocks')}
          value={hoverBg}
          onChange={(value) => setAttributes({ hoverBg: value })}
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Rotation (degrees)', 'kriti-blocks')}
          value={rotation ?? 0}
          onChange={(value) => setAttributes({ rotation: value || undefined })}
          min={-360}
          max={360}
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Size on tablet (px)', 'kriti-blocks')}
          value={sizeTablet ?? size ?? 24}
          onChange={(value) => setAttributes({ sizeTablet: value })}
          min={8}
          max={500}
          allowReset
          resetFallbackValue={undefined}
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Size on mobile (px)', 'kriti-blocks')}
          value={sizeMobile ?? size ?? 24}
          onChange={(value) => setAttributes({ sizeMobile: value })}
          min={8}
          max={500}
          allowReset
          resetFallbackValue={undefined}
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Alignment', 'kriti-blocks')}
          value={iconAlign || ''}
          options={[
            { label: __('Default', 'kriti-blocks'), value: '' },
            { label: __('Left', 'kriti-blocks'), value: 'left' },
            { label: __('Center', 'kriti-blocks'), value: 'center' },
            { label: __('Right', 'kriti-blocks'), value: 'right' },
          ]}
          onChange={(value) => setAttributes({ iconAlign: value || undefined })}
        />
      </PanelBody>

      <PanelBody
        title={__('Label and Link', 'kriti-blocks')}
        initialOpen={false}
      >
        <TextControl
          __nextHasNoMarginBottom
          label={__('Label', 'kriti-blocks')}
          value={label || ''}
          onChange={(value) => setAttributes({ label: value || undefined })}
        />
        {label && (
          <SelectControl
            __nextHasNoMarginBottom
            label={__('Label Position', 'kriti-blocks')}
            value={labelPosition || ''}
            options={[
              { label: __('Below the icon', 'kriti-blocks'), value: '' },
              {
                label: __('Right of the icon', 'kriti-blocks'),
                value: 'right',
              },
            ]}
            onChange={(value) =>
              setAttributes({ labelPosition: value || undefined })
            }
          />
        )}
        <TextControl
          __nextHasNoMarginBottom
          label={__('Link URL', 'kriti-blocks')}
          help={__(
            'http, https, mailto, tel or a relative URL.',
            'kriti-blocks',
          )}
          type="url"
          value={linkUrl || ''}
          onChange={(value) => setAttributes({ linkUrl: value || undefined })}
        />
        {linkUrl && (
          <>
            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Open in new tab', 'kriti-blocks')}
              checked={!!linkNewTab}
              onChange={(value) =>
                setAttributes({ linkNewTab: value || undefined })
              }
            />
            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Add nofollow', 'kriti-blocks')}
              checked={!!linkNofollow}
              onChange={(value) =>
                setAttributes({ linkNofollow: value || undefined })
              }
            />
            <TextControl
              __nextHasNoMarginBottom
              label={__('Accessible name for the link', 'kriti-blocks')}
              help={__('Describe where the icon link goes.', 'kriti-blocks')}
              value={ariaLabel || ''}
              onChange={(value) =>
                setAttributes({ ariaLabel: value || undefined })
              }
            />
          </>
        )}
      </PanelBody>
    </>
  );
}
