import {
  PanelBody,
  ColorPalette,
  RangeControl,
  SelectControl,
  ToggleControl,
  BaseControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function StickyOptionsPanel({ attributes, setAttributes }) {
  const {
    disableOn,
    stickTo,
    stuckBackground,
    stuckPadding,
    hideOnScrollDown,
  } = attributes;
  const set = (key) => (value) => setAttributes({ [key]: value || undefined });

  return (
    <PanelBody
      title={__('Sticky behavior', 'kriti-blocks')}
      initialOpen={false}
    >
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Sticky on', 'kriti-blocks')}
        value={disableOn || ''}
        options={[
          { label: __('All screens', 'kriti-blocks'), value: '' },
          {
            label: __(
              'Desktop only (off on tablet and mobile)',
              'kriti-blocks',
            ),
            value: 'tablet',
          },
          {
            label: __('Desktop and tablet (off on mobile)', 'kriti-blocks'),
            value: 'mobile',
          },
        ]}
        onChange={set('disableOn')}
      />
      <SelectControl
        __nextHasNoMarginBottom
        label={__('Stick to', 'kriti-blocks')}
        value={stickTo || ''}
        options={[
          { label: __('Top of the screen', 'kriti-blocks'), value: '' },
          {
            label: __('Bottom of the screen', 'kriti-blocks'),
            value: 'bottom',
          },
        ]}
        onChange={set('stickTo')}
      />
      <BaseControl
        __nextHasNoMarginBottom
        id="kb-sticky-stuck-bg"
        label={__('Background when stuck', 'kriti-blocks')}
      >
        <ColorPalette
          value={stuckBackground}
          onChange={set('stuckBackground')}
          headingLevel={3}
        />
      </BaseControl>
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Shrink padding when stuck (px)', 'kriti-blocks')}
        help={__(
          'Top and bottom padding while stuck. Empty keeps the normal padding.',
          'kriti-blocks',
        )}
        value={stuckPadding}
        min={0}
        max={100}
        allowReset
        onChange={set('stuckPadding')}
      />
      {stickTo !== 'bottom' && (
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Hide while scrolling down', 'kriti-blocks')}
          help={__(
            'Slides back in as soon as the visitor scrolls up.',
            'kriti-blocks',
          )}
          checked={!!hideOnScrollDown}
          onChange={set('hideOnScrollDown')}
        />
      )}
    </PanelBody>
  );
}
