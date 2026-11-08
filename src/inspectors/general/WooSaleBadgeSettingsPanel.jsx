import {
  ColorPalette,
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const WooSaleBadgeSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    text,
    showPercentage,
    badgeColor,
    textColor,
    fontSize,
    borderRadius,
    badgeType,
    newDays,
    position,
    shape,
    offset,
  } = attributes;

  const colors = [
    { name: 'Slate', color: '#1e293b' },
    { name: 'Red', color: '#b91c1c' },
    { name: 'Green', color: '#15803d' },
    { name: 'Amber', color: '#d97706' },
    { name: 'White', color: '#ffffff' },
  ];

  return (
    <>
      <PanelBody
        title={__('Sale Badge Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Badge type', 'kriti-blocks')}
          help={__(
            'The badge only shows when the product matches the type.',
            'kriti-blocks',
          )}
          value={badgeType || 'sale'}
          options={[
            { label: __('Sale', 'kriti-blocks'), value: 'sale' },
            { label: __('New', 'kriti-blocks'), value: 'new' },
            { label: __('Out of stock', 'kriti-blocks'), value: 'outofstock' },
            { label: __('Low stock', 'kriti-blocks'), value: 'lowstock' },
          ]}
          onChange={(value) => setAttributes({ badgeType: value })}
        />

        {badgeType === 'new' && (
          <RangeControl
            __nextHasNoMarginBottom
            label={__('Product counts as new for (days)', 'kriti-blocks')}
            value={newDays || 30}
            onChange={(value) => setAttributes({ newDays: value || 30 })}
            min={1}
            max={365}
          />
        )}

        <TextControl
          label={__('Badge text', 'kriti-blocks')}
          help={__('Leave empty to use the default label.', 'kriti-blocks')}
          value={text}
          onChange={(value) => setAttributes({ text: value })}
        />

        <ToggleControl
          label={__('Show discount percentage', 'kriti-blocks')}
          help={__(
            'Replaces the label with the calculated percentage off.',
            'kriti-blocks',
          )}
          checked={!!showPercentage}
          onChange={(value) => setAttributes({ showPercentage: value })}
        />

        <p>{__('Badge color', 'kriti-blocks')}</p>
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={badgeColor}
          onChange={(color) => setAttributes({ badgeColor: color || '' })}
          headingLevel="3"
        />

        <p>{__('Text color', 'kriti-blocks')}</p>
        <ColorPalette
          asButtons="true"
          colors={colors}
          value={textColor}
          onChange={(color) => setAttributes({ textColor: color || '' })}
          headingLevel="3"
        />

        <RangeControl
          __nextHasNoMarginBottom
          label={__('Font Size (px)', 'kriti-blocks')}
          value={fontSize || 0}
          onChange={(value) => setAttributes({ fontSize: value || 0 })}
          min={0}
          max={120}
          step={1}
          allowReset
          resetFallbackValue={0}
        />

        <RangeControl
          label={__('Corner radius (px)', 'kriti-blocks')}
          value={borderRadius}
          onChange={(value) => setAttributes({ borderRadius: value })}
          min={0}
          max={999}
          step={1}
          allowReset
          resetFallbackValue={999}
        />
      </PanelBody>

      <PanelBody
        title={__('Badge Shape & Position', 'kriti-blocks')}
        initialOpen={false}
      >
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Shape', 'kriti-blocks')}
          value={shape || 'default'}
          options={[
            {
              label: __('Default (uses corner radius)', 'kriti-blocks'),
              value: 'default',
            },
            { label: __('Square', 'kriti-blocks'), value: 'square' },
            { label: __('Circle', 'kriti-blocks'), value: 'circle' },
            { label: __('Ribbon', 'kriti-blocks'), value: 'ribbon' },
          ]}
          onChange={(value) => setAttributes({ shape: value })}
        />

        <SelectControl
          __nextHasNoMarginBottom
          label={__('Position over image', 'kriti-blocks')}
          help={__(
            'Overlays the badge on a corner of its container. Place the badge inside a block that has position: relative, such as a Group around the product image.',
            'kriti-blocks',
          )}
          value={position || 'none'}
          options={[
            {
              label: __('In flow (no overlay)', 'kriti-blocks'),
              value: 'none',
            },
            { label: __('Top left', 'kriti-blocks'), value: 'top-left' },
            { label: __('Top right', 'kriti-blocks'), value: 'top-right' },
            { label: __('Bottom left', 'kriti-blocks'), value: 'bottom-left' },
            {
              label: __('Bottom right', 'kriti-blocks'),
              value: 'bottom-right',
            },
          ]}
          onChange={(value) => setAttributes({ position: value })}
        />

        {position && position !== 'none' && (
          <RangeControl
            __nextHasNoMarginBottom
            label={__('Distance from edge (px)', 'kriti-blocks')}
            value={offset ?? 10}
            onChange={(value) => setAttributes({ offset: value ?? 10 })}
            min={0}
            max={100}
            allowReset
            resetFallbackValue={10}
          />
        )}
      </PanelBody>
    </>
  );
};

export default WooSaleBadgeSettingsPanel;
