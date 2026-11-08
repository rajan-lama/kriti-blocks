import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
  Button,
  ColorPalette,
  BaseControl,
  FocalPointPicker,
  PanelBody,
  RangeControl,
  SelectControl,
  ToggleControl,
  __experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { IMAGE_RE, VIDEO_RE } from './options';

const MediaField = ({ label, type, value, onSelect, onClear }) => (
  <BaseControl __nextHasNoMarginBottom>
    <BaseControl.VisualLabel>{label}</BaseControl.VisualLabel>
    <MediaUploadCheck>
      <MediaUpload
        allowedTypes={[type]}
        onSelect={(media) => onSelect(media.url)}
        render={({ open }) => (
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" onClick={open}>
              {value
                ? __('Replace', 'kriti-blocks')
                : __('Choose', 'kriti-blocks')}
            </Button>
            {value && (
              <Button variant="tertiary" isDestructive onClick={onClear}>
                {__('Remove', 'kriti-blocks')}
              </Button>
            )}
          </div>
        )}
      />
    </MediaUploadCheck>
  </BaseControl>
);

export default function SectionOptionsPanel({ attributes, setAttributes }) {
  const {
    bgImage,
    bgFocal,
    bgFixed,
    bgVideo,
    bgVideoHideMobile,
    bgOverlayColor,
    bgOverlayOpacity,
    contentWidth,
    contentWidthUnit,
    verticalAlign,
    overflow,
    container,
  } = attributes;
  const set = (key) => (value) =>
    setAttributes({
      [key]: value === '' || value === false ? undefined : value,
    });

  return (
    <>
      <PanelBody
        title={__('Section background', 'kriti-blocks')}
        initialOpen={false}
      >
        <MediaField
          label={__('Background image', 'kriti-blocks')}
          type="image"
          value={bgImage}
          onSelect={(url) =>
            IMAGE_RE.test(url.split(/[?#]/)[0]) &&
            setAttributes({ bgImage: url })
          }
          onClear={() =>
            setAttributes({ bgImage: undefined, bgFocal: undefined })
          }
        />
        {bgImage && (
          <>
            <FocalPointPicker
              __nextHasNoMarginBottom
              label={__('Focal point', 'kriti-blocks')}
              url={bgImage}
              value={bgFocal || { x: 0.5, y: 0.5 }}
              onChange={(value) => setAttributes({ bgFocal: value })}
            />
            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Fixed background (parallax)', 'kriti-blocks')}
              help={__(
                'Stays still while the page scrolls. Turned off on tablets and phones.',
                'kriti-blocks',
              )}
              checked={!!bgFixed}
              onChange={set('bgFixed')}
            />
          </>
        )}
        <MediaField
          label={__('Background video (MP4 or WebM)', 'kriti-blocks')}
          type="video"
          value={bgVideo}
          onSelect={(url) =>
            VIDEO_RE.test(url.split(/[?#]/)[0]) &&
            setAttributes({ bgVideo: url })
          }
          onClear={() => setAttributes({ bgVideo: undefined })}
        />
        {bgVideo && (
          <ToggleControl
            __nextHasNoMarginBottom
            label={__('Hide the video on mobile', 'kriti-blocks')}
            help={__(
              'Saves data. The image or color shows instead. The video is also off for visitors who prefer reduced motion.',
              'kriti-blocks',
            )}
            checked={!!bgVideoHideMobile}
            onChange={set('bgVideoHideMobile')}
          />
        )}
        <BaseControl __nextHasNoMarginBottom id="kb-section-overlay">
          <BaseControl.VisualLabel>
            {__('Overlay color', 'kriti-blocks')}
          </BaseControl.VisualLabel>
          <ColorPalette
            value={bgOverlayColor}
            onChange={set('bgOverlayColor')}
            headingLevel={3}
          />
        </BaseControl>
        {bgOverlayColor && (
          <RangeControl
            __nextHasNoMarginBottom
            label={__('Overlay opacity (%)', 'kriti-blocks')}
            value={bgOverlayOpacity ?? 50}
            min={0}
            max={100}
            onChange={(value) => setAttributes({ bgOverlayOpacity: value })}
          />
        )}
      </PanelBody>

      <PanelBody
        title={__('Section content', 'kriti-blocks')}
        initialOpen={false}
      >
        <BaseControl
          __nextHasNoMarginBottom
          id="kb-section-content-width"
          help={
            container === 'none'
              ? __(
                  'Applies to each block inside, because there is no container.',
                  'kriti-blocks',
                )
              : __(
                  'Limits the inner container. Empty keeps the container width.',
                  'kriti-blocks',
                )
          }
        >
          <BaseControl.VisualLabel>
            {__('Content max width', 'kriti-blocks')}
          </BaseControl.VisualLabel>
          <div style={{ display: 'flex', gap: 8 }}>
            <NumberControl
              value={contentWidth ?? ''}
              min={1}
              max={5000}
              onChange={(value) =>
                setAttributes({
                  contentWidth: value === '' ? undefined : Number(value),
                })
              }
            />
            <SelectControl
              __nextHasNoMarginBottom
              value={contentWidthUnit || 'px'}
              options={['px', '%', 'rem', 'vw'].map((u) => ({
                label: u,
                value: u,
              }))}
              onChange={(value) =>
                setAttributes({
                  contentWidthUnit: value === 'px' ? undefined : value,
                })
              }
            />
          </div>
        </BaseControl>
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Vertical alignment of content', 'kriti-blocks')}
          help={__(
            'Visible when the section is taller than its content (set a min height in Design).',
            'kriti-blocks',
          )}
          value={verticalAlign || ''}
          options={[
            { label: __('Top', 'kriti-blocks'), value: '' },
            { label: __('Middle', 'kriti-blocks'), value: 'center' },
            { label: __('Bottom', 'kriti-blocks'), value: 'end' },
          ]}
          onChange={set('verticalAlign')}
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Overflow', 'kriti-blocks')}
          value={overflow || ''}
          options={[
            { label: __('Visible', 'kriti-blocks'), value: '' },
            { label: __('Hidden', 'kriti-blocks'), value: 'hidden' },
            { label: __('Clip', 'kriti-blocks'), value: 'clip' },
          ]}
          onChange={set('overflow')}
        />
      </PanelBody>
    </>
  );
}
