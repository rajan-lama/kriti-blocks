import {
  FocalPointPicker,
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
  __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ColorField } from './kbsb-controls';

/**
 * Sidebar panels for the options shared by Cover and Hero.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @param {boolean}  props.customHeight  Show the desktop height field (Hero).
 * @return {Element} Panels.
 */
export default function CoverOptionsPanel({
  attributes,
  setAttributes,
  customHeight = false,
}) {
  const {
    backgroundUrl,
    parallax,
    focalPoint,
    overlayGradFrom,
    overlayGradTo,
    overlayGradAngle,
    verticalAlign,
    contentMaxWidth,
    heightTablet,
    heightMobile,
  } = attributes;

  const numberField = (label, key, value, min) => (
    <NumberControl
      label={label}
      value={value ?? ''}
      min={min}
      onChange={(next) =>
        setAttributes({
          [key]: next === '' ? undefined : Number(next),
        })
      }
    />
  );

  return (
    <>
      <PanelBody
        title={__('Background Options', 'kriti-blocks')}
        initialOpen={false}
      >
        <TextControl
          __nextHasNoMarginBottom
          label={__('Background video URL', 'kriti-blocks')}
          help={__(
            'MP4 or WebM file. Plays muted and looped, over the background image.',
            'kriti-blocks',
          )}
          type="url"
          value={attributes.bgVideoUrl || ''}
          onChange={(value) =>
            setAttributes({ bgVideoUrl: value || undefined })
          }
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Scroll-down arrow', 'kriti-blocks')}
          checked={!!attributes.scrollIndicator}
          onChange={(value) =>
            setAttributes({ scrollIndicator: value || undefined })
          }
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Parallax (fixed background)', 'kriti-blocks')}
          help={__('Turned off on tablets and phones.', 'kriti-blocks')}
          checked={!!parallax}
          onChange={(value) => setAttributes({ parallax: value || undefined })}
        />
        {backgroundUrl && (
          <FocalPointPicker
            __nextHasNoMarginBottom
            label={__('Focal Point', 'kriti-blocks')}
            url={backgroundUrl}
            value={focalPoint || { x: 0.5, y: 0.5 }}
            onChange={(value) => setAttributes({ focalPoint: value })}
          />
        )}
        <ColorField
          label={__('Gradient Overlay: Start', 'kriti-blocks')}
          value={overlayGradFrom}
          onChange={(value) => setAttributes({ overlayGradFrom: value })}
        />
        <ColorField
          label={__('Gradient Overlay: End', 'kriti-blocks')}
          value={overlayGradTo}
          onChange={(value) => setAttributes({ overlayGradTo: value })}
        />
        {overlayGradFrom && overlayGradTo && (
          <RangeControl
            __nextHasNoMarginBottom
            label={__('Gradient Angle', 'kriti-blocks')}
            help={__(
              'Replaces the solid overlay color. Use transparent colors such as rgba() to let the image show.',
              'kriti-blocks',
            )}
            value={overlayGradAngle ?? 180}
            onChange={(value) => setAttributes({ overlayGradAngle: value })}
            min={0}
            max={360}
          />
        )}
      </PanelBody>

      <PanelBody
        title={__('Content and Height', 'kriti-blocks')}
        initialOpen={false}
      >
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Vertical Alignment', 'kriti-blocks')}
          value={verticalAlign || ''}
          options={[
            { label: __('Center', 'kriti-blocks'), value: '' },
            { label: __('Top', 'kriti-blocks'), value: 'top' },
            { label: __('Bottom', 'kriti-blocks'), value: 'bottom' },
          ]}
          onChange={(value) =>
            setAttributes({ verticalAlign: value || undefined })
          }
        />
        {numberField(
          __('Content Max Width (px)', 'kriti-blocks'),
          'contentMaxWidth',
          contentMaxWidth,
          200,
        )}
        {customHeight &&
          numberField(
            __('Custom Height, desktop (px)', 'kriti-blocks'),
            'customHeight',
            attributes.customHeight,
            100,
          )}
        {numberField(
          __('Height on tablet (px)', 'kriti-blocks'),
          'heightTablet',
          heightTablet,
          100,
        )}
        {numberField(
          __('Height on mobile (px)', 'kriti-blocks'),
          'heightMobile',
          heightMobile,
          100,
        )}
      </PanelBody>
    </>
  );
}
