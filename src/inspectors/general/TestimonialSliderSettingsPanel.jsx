import {
  PanelBody,
  RangeControl,
  ToggleControl,
  SelectControl,
  ColorPalette,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

const TestimonialSliderSettingsPanel = ({ attributes, setAttributes }) => {
  const { autoplay, interval, showArrows, showDots, showQuoteMark } =
    attributes;

  return (
    <>
      <PanelBody
        title={__('Slider Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <ToggleControl
          label={__('Autoplay', 'kriti-blocks')}
          checked={!!autoplay}
          onChange={(value) => setAttributes({ autoplay: value })}
        />

        {autoplay && (
          <RangeControl
            label={__('Autoplay delay (ms)', 'kriti-blocks')}
            value={interval}
            min={2000}
            max={15000}
            step={500}
            onChange={(value) => setAttributes({ interval: value })}
          />
        )}

        <ToggleControl
          label={__('Show navigation arrows', 'kriti-blocks')}
          checked={!!showArrows}
          onChange={(value) => setAttributes({ showArrows: value })}
        />

        <ToggleControl
          label={__('Show navigation dots', 'kriti-blocks')}
          checked={!!showDots}
          onChange={(value) => setAttributes({ showDots: value })}
        />

        <ToggleControl
          label={__('Show decorative quote mark', 'kriti-blocks')}
          checked={!!showQuoteMark}
          onChange={(value) => setAttributes({ showQuoteMark: value })}
        />
      </PanelBody>

      <PanelBody
        title={__('Slider behavior and style', 'kriti-blocks')}
        initialOpen={false}
      >
        <SelectControl
          label={__('Transition', 'kriti-blocks')}
          value={attributes.transition || 'slide'}
          options={[
            { label: __('Slide', 'kriti-blocks'), value: 'slide' },
            { label: __('Fade', 'kriti-blocks'), value: 'fade' },
          ]}
          onChange={(value) => setAttributes({ transition: value })}
          __nextHasNoMarginBottom
        />
        <RangeControl
          label={__('Transition speed (ms)', 'kriti-blocks')}
          value={attributes.speed || 500}
          min={100}
          max={2000}
          step={50}
          onChange={(value) => setAttributes({ speed: value })}
        />
        {attributes.transition !== 'fade' && (
          <RangeControl
            label={__('Slides per view (desktop)', 'kriti-blocks')}
            help={__('Phones always show one slide.', 'kriti-blocks')}
            value={attributes.slidesPerView || 1}
            min={1}
            max={3}
            onChange={(value) =>
              setAttributes({ slidesPerView: value > 1 ? value : undefined })
            }
          />
        )}
        <ToggleControl
          label={__('Loop back to the first slide', 'kriti-blocks')}
          checked={attributes.loop !== false}
          onChange={(value) =>
            setAttributes({ loop: value ? undefined : false })
          }
          __nextHasNoMarginBottom
        />
        <ToggleControl
          label={__('Pause autoplay on hover', 'kriti-blocks')}
          checked={attributes.pauseOnHover !== false}
          onChange={(value) =>
            setAttributes({ pauseOnHover: value ? undefined : false })
          }
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Arrow style', 'kriti-blocks')}
          value={attributes.arrowStyle || 'circle'}
          options={[
            { label: __('Circle', 'kriti-blocks'), value: 'circle' },
            { label: __('Square', 'kriti-blocks'), value: 'square' },
            { label: __('Plain', 'kriti-blocks'), value: 'plain' },
          ]}
          onChange={(value) => setAttributes({ arrowStyle: value })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Dot style', 'kriti-blocks')}
          value={attributes.dotStyle || 'dot'}
          options={[
            { label: __('Dots', 'kriti-blocks'), value: 'dot' },
            { label: __('Lines', 'kriti-blocks'), value: 'line' },
          ]}
          onChange={(value) => setAttributes({ dotStyle: value })}
          __nextHasNoMarginBottom
        />
        <p>
          {__(
            'Accent color (active dot, side border, quote mark)',
            'kriti-blocks',
          )}
        </p>
        <ColorPalette
          value={attributes.accentColor}
          onChange={(color) => setAttributes({ accentColor: color })}
          headingLevel="3"
        />
        <p>{__('Inactive dot color', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.dotColor}
          onChange={(color) => setAttributes({ dotColor: color })}
          headingLevel="3"
        />
        <p>{__('Arrow color', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.arrowColor}
          onChange={(color) => setAttributes({ arrowColor: color })}
          headingLevel="3"
        />
        <p>{__('Arrow background', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.arrowBg}
          onChange={(color) => setAttributes({ arrowBg: color })}
          headingLevel="3"
        />
      </PanelBody>
    </>
  );
};

export default TestimonialSliderSettingsPanel;
