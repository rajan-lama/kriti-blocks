import {
  PanelBody,
  ColorPalette,
  RangeControl,
  SelectControl,
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

export default function ModalBehaviorPanel({ attributes, setAttributes }) {
  const {
    overlayColor,
    overlayBlur,
    maxHeight,
    animation,
    hideTrigger,
    autoOpen,
    autoOpenDelay,
    exitIntent,
    scrollOpen,
    showOnceDays,
    triggerSelector,
  } = attributes;
  const hasAuto = !!autoOpen || !!exitIntent || !!scrollOpen;

  return (
    <>
      <PanelBody
        title={__('Modal appearance', 'kriti-blocks')}
        initialOpen={false}
      >
        <BaseControl
          __nextHasNoMarginBottom
          id="kb-modal-overlay-color"
          label={__('Overlay color', 'kriti-blocks')}
          help={__(
            'Use an rgba() value in the custom picker for a see-through overlay.',
            'kriti-blocks',
          )}
        >
          <ColorPalette
            colors={OVERLAY_COLORS}
            value={overlayColor}
            onChange={(value) =>
              setAttributes({ overlayColor: value || undefined })
            }
            headingLevel={3}
          />
        </BaseControl>
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Overlay blur (px)', 'kriti-blocks')}
          value={overlayBlur || 0}
          min={0}
          max={30}
          onChange={(value) =>
            setAttributes({ overlayBlur: value || undefined })
          }
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Max height (vh)', 'kriti-blocks')}
          help={__(
            'Content scrolls inside the panel when it is taller. Default is the full screen height.',
            'kriti-blocks',
          )}
          value={maxHeight}
          min={30}
          max={100}
          allowReset
          onChange={(value) => setAttributes({ maxHeight: value || undefined })}
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Opening animation', 'kriti-blocks')}
          value={animation || ''}
          options={[
            { label: __('Default', 'kriti-blocks'), value: '' },
            { label: __('Fade', 'kriti-blocks'), value: 'fade' },
            { label: __('Zoom', 'kriti-blocks'), value: 'zoom' },
            { label: __('Slide up', 'kriti-blocks'), value: 'slide' },
            { label: __('None', 'kriti-blocks'), value: 'none' },
          ]}
          onChange={(value) => setAttributes({ animation: value || undefined })}
        />
      </PanelBody>

      <PanelBody
        title={__('Modal triggers', 'kriti-blocks')}
        initialOpen={false}
      >
        <TextControl
          __nextHasNoMarginBottom
          label={__('Also open from CSS selector', 'kriti-blocks')}
          help={__(
            'For example .open-newsletter or #promo-link. Matching elements on the page open this modal.',
            'kriti-blocks',
          )}
          value={triggerSelector || ''}
          onChange={(value) =>
            setAttributes({ triggerSelector: value || undefined })
          }
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Hide the trigger button', 'kriti-blocks')}
          help={__(
            'Use with a CSS selector or an automatic trigger below.',
            'kriti-blocks',
          )}
          checked={!!hideTrigger}
          onChange={(value) =>
            setAttributes({ hideTrigger: value || undefined })
          }
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Open on page load', 'kriti-blocks')}
          checked={!!autoOpen}
          onChange={(value) => setAttributes({ autoOpen: value || undefined })}
        />
        {autoOpen && (
          <RangeControl
            __nextHasNoMarginBottom
            label={__('Delay (seconds)', 'kriti-blocks')}
            value={autoOpenDelay || 0}
            min={0}
            max={60}
            onChange={(value) =>
              setAttributes({ autoOpenDelay: value || undefined })
            }
          />
        )}
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Open on exit intent (desktop)', 'kriti-blocks')}
          checked={!!exitIntent}
          onChange={(value) =>
            setAttributes({ exitIntent: value || undefined })
          }
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Open after scrolling (%)', 'kriti-blocks')}
          help={__('0 turns it off.', 'kriti-blocks')}
          value={scrollOpen || 0}
          min={0}
          max={100}
          step={5}
          onChange={(value) =>
            setAttributes({ scrollOpen: value || undefined })
          }
        />
        {hasAuto && (
          <RangeControl
            __nextHasNoMarginBottom
            label={__('Show only once per visitor (days)', 'kriti-blocks')}
            help={__(
              'Remembered in the browser. 0 shows it on every visit.',
              'kriti-blocks',
            )}
            value={showOnceDays || 0}
            min={0}
            max={90}
            onChange={(value) =>
              setAttributes({ showOnceDays: value || undefined })
            }
          />
        )}
      </PanelBody>
    </>
  );
}
