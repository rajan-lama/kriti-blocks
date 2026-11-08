import {
  PanelBody,
  ColorPalette,
  RangeControl,
  TextControl,
  ToggleControl,
  BaseControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const OVERLAY_COLORS = [
  { name: __('Black', 'kriti-blocks'), color: '#000000' },
  { name: __('Slate', 'kriti-blocks'), color: '#0f172a' },
  { name: __('Indigo', 'kriti-blocks'), color: '#312e81' },
  { name: __('White', 'kriti-blocks'), color: '#ffffff' },
];

export default function OffcanvasBehaviorPanel({ attributes, setAttributes }) {
  const {
    overlayColor,
    overlayBlur,
    animationSpeed,
    hamburger,
    hideTrigger,
    widthTablet,
    widthMobile,
    closeOnLink,
    triggerSelector,
  } = attributes;
  const set = (key) => (value) => setAttributes({ [key]: value || undefined });

  return (
    <PanelBody title={__('Drawer options', 'kriti-blocks')} initialOpen={false}>
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Hamburger icon trigger', 'kriti-blocks')}
        help={__(
          'Shows a menu icon instead of the text. The text stays as the accessible label.',
          'kriti-blocks',
        )}
        checked={!!hamburger}
        onChange={set('hamburger')}
      />
      <TextControl
        __nextHasNoMarginBottom
        label={__('Also open from CSS selector', 'kriti-blocks')}
        help={__(
          'For example .menu-toggle. Matching elements on the page open this drawer.',
          'kriti-blocks',
        )}
        value={triggerSelector || ''}
        onChange={set('triggerSelector')}
      />
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Hide the trigger button', 'kriti-blocks')}
        help={__('Use together with a CSS selector.', 'kriti-blocks')}
        checked={!!hideTrigger}
        onChange={set('hideTrigger')}
      />
      <ToggleControl
        __nextHasNoMarginBottom
        label={__('Close when a link inside is clicked', 'kriti-blocks')}
        checked={!!closeOnLink}
        onChange={set('closeOnLink')}
      />
      <BaseControl
        __nextHasNoMarginBottom
        id="kb-oc-overlay-color"
        label={__('Overlay color', 'kriti-blocks')}
      >
        <ColorPalette
          colors={OVERLAY_COLORS}
          value={overlayColor}
          onChange={set('overlayColor')}
          headingLevel={3}
        />
      </BaseControl>
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Overlay blur (px)', 'kriti-blocks')}
        value={overlayBlur || 0}
        min={0}
        max={30}
        onChange={set('overlayBlur')}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Slide speed (ms)', 'kriti-blocks')}
        help={__('Default is 300. 0 opens instantly.', 'kriti-blocks')}
        value={animationSpeed}
        min={0}
        max={1000}
        step={50}
        allowReset
        onChange={(value) => setAttributes({ animationSpeed: value })}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Width on tablet (px)', 'kriti-blocks')}
        help={__(
          'At 1024px and below. Empty uses the main width.',
          'kriti-blocks',
        )}
        value={widthTablet}
        min={200}
        max={900}
        step={10}
        allowReset
        onChange={set('widthTablet')}
      />
      <RangeControl
        __nextHasNoMarginBottom
        label={__('Width on mobile (px)', 'kriti-blocks')}
        help={__('At 767px and below.', 'kriti-blocks')}
        value={widthMobile}
        min={200}
        max={900}
        step={10}
        allowReset
        onChange={set('widthMobile')}
      />
    </PanelBody>
  );
}
