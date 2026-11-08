/**
 * Internal block libraries
 */
import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import {
  PanelBody,
  SelectControl,
  BorderBoxControl,
  CheckboxControl,
  TextareaControl,
  ToggleControl,
  RangeControl,
  TextControl,
  Button,
  ColorPalette,
  BaseControl,
} from '@wordpress/components';
import {
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
  useBlockProps,
} from '@wordpress/block-editor';

/**
 * Create an Inspector Controls wrapper Component
 */

const Inspector = ({ attributes, setAttributes }) => {
  const colors = [{ name: 'Blue 20', color: '#72aee6' }];

  const defaultBorder = {
    color: '#72aee6',
    style: 'dashed',
    width: '1px',
  };
  const [borders, setBorders] = useState({
    top: defaultBorder,
    right: defaultBorder,
    bottom: defaultBorder,
    left: defaultBorder,
  });
  const onChange = (newBorders) => setBorders(newBorders);

  const [paddingSize, setPaddingSize] = useState('');
  const [paddingY, setPaddingY] = useState('');

  const [border, setBorder] = useState();

  const {
    slides,
    activeIndex,
    showTitle,
    showSubtitle,
    showDescription,
    showPrimaryButtons,
    showSecondaryButtons,
  } = attributes;

  const setSlides = (newSlides) => {
    setAttributes({ slides: newSlides });
  };

  const updateField = (field, value) => {
    // Copy the slide instead of changing it in place.
    const newSlides = slides.map((slide, index) => {
      if (index !== activeIndex) {
        return slide;
      }
      const next = { ...slide, [field]: value };
      if (value === undefined || value === '') {
        delete next[field];
      }
      return next;
    });
    setSlides(newSlides);
  };

  return (
    <InspectorControls>
      <PanelBody title={`Slide ${activeIndex + 1} Content`} initialOpen>
        {showTitle && (
          <TextControl
            label="Title"
            value={slides[activeIndex]?.title || ''}
            onChange={(val) => updateField('title', val)}
          />
        )}

        {showSubtitle && (
          <TextControl
            label="Subtitle"
            value={slides[activeIndex]?.subtitle || ''}
            onChange={(val) => updateField('subtitle', val)}
          />
        )}
        {showDescription && (
          <TextareaControl
            label="Description"
            value={slides[activeIndex]?.description || ''}
            onChange={(val) => updateField('description', val)}
          />
        )}

        {showPrimaryButtons && (
          <>
            <TextControl
              label="Primary Button Text"
              value={slides[activeIndex]?.btn1Text || ''}
              onChange={(val) => updateField('btn1Text', val)}
            />

            <TextControl
              label="Primary Button URL"
              value={slides[activeIndex]?.btn1Url || ''}
              onChange={(val) => updateField('btn1Url', val)}
            />
          </>
        )}

        {showSecondaryButtons && (
          <>
            <TextControl
              label="Second Button Text"
              value={slides[activeIndex]?.btn2Text || ''}
              onChange={(val) => updateField('btn2Text', val)}
            />

            <TextControl
              label="Second Button URL"
              value={slides[activeIndex]?.btn2Url || ''}
              onChange={(val) => updateField('btn2Url', val)}
            />
          </>
        )}

        <MediaUploadCheck>
          <MediaUpload
            onSelect={(media) => updateField('image', media.url)}
            allowedTypes={['image']}
            render={({ open }) => (
              <Button onClick={open} isSecondary>
                {slides[activeIndex]?.image ? 'Change Image' : 'Upload Image'}
              </Button>
            )}
          />
        </MediaUploadCheck>

        {slides[activeIndex]?.image && (
          <TextControl
            label="Image alt text"
            help="Describe the image for screen readers."
            value={slides[activeIndex]?.alt || ''}
            onChange={(val) => updateField('alt', val)}
          />
        )}

        {slides[activeIndex]?.image && (
          <img
            src={slides[activeIndex].image}
            alt=""
            style={{ width: '100%', marginTop: '10px' }}
          />
        )}
      </PanelBody>
      <PanelBody
        title={`Slide ${activeIndex + 1} Background`}
        initialOpen={false}
      >
        <BaseControl
          help="Shows behind the image, for example around a contained image."
          __nextHasNoMarginBottom
        >
          <BaseControl.VisualLabel>Background color</BaseControl.VisualLabel>
          <ColorPalette
            colors={[]}
            value={slides[activeIndex]?.bgColor}
            onChange={(val) => updateField('bgColor', val)}
            clearable
          />
        </BaseControl>
        <BaseControl __nextHasNoMarginBottom>
          <BaseControl.VisualLabel>Overlay color</BaseControl.VisualLabel>
          <ColorPalette
            colors={[]}
            value={slides[activeIndex]?.overlayColor}
            onChange={(val) => updateField('overlayColor', val)}
            clearable
          />
        </BaseControl>
        {slides[activeIndex]?.overlayColor && (
          <RangeControl
            label="Overlay strength (%)"
            value={slides[activeIndex]?.overlayOpacity ?? 40}
            onChange={(val) => updateField('overlayOpacity', val)}
            min={0}
            max={90}
            allowReset
            resetFallbackValue={40}
          />
        )}
      </PanelBody>
      <PanelBody title={`Slide Display Options`}>
        <ToggleControl
          label="Display Title"
          checked={showTitle}
          onChange={(val) => setAttributes({ showTitle: val })}
        />
        <ToggleControl
          label="Display Subtitle"
          checked={showSubtitle}
          onChange={(val) => setAttributes({ showSubtitle: val })}
        />
        <ToggleControl
          label="Display Description"
          checked={showDescription}
          onChange={(val) => setAttributes({ showDescription: val })}
        />
        <ToggleControl
          label="Display Primary Button"
          checked={showPrimaryButtons}
          onChange={(val) => setAttributes({ showPrimaryButtons: val })}
        />
        <ToggleControl
          label="Display Secondary Button"
          checked={showSecondaryButtons}
          onChange={(val) => setAttributes({ showSecondaryButtons: val })}
        />
      </PanelBody>
      <PanelBody title="Slider Settings">
        <ToggleControl
          label="Show Indicators"
          checked={attributes.showIndicators}
          onChange={(val) => setAttributes({ showIndicators: val })}
        />

        <ToggleControl
          label="Show Controls"
          checked={attributes.showControls}
          onChange={(val) => setAttributes({ showControls: val })}
        />

        <SelectControl
          label="Transition Effect"
          value={attributes.slideEffect}
          options={[
            { label: 'Slide', value: 'slide' },
            { label: 'Fade', value: 'fade' },
            { label: 'Cube', value: 'cube' },
            { label: 'Coverflow', value: 'coverflow' },
            { label: 'Flip', value: 'flip' },
          ]}
          onChange={(val) => setAttributes({ slideEffect: val })}
        />

        <RangeControl
          label="Interval (ms)"
          value={attributes.interval}
          onChange={(val) => setAttributes({ interval: val })}
          min={1000}
          max={10000}
        />
      </PanelBody>
      <PanelBody title="Slides per view" initialOpen={false}>
        <RangeControl
          label="Slides per view (desktop)"
          help="1 keeps the standard carousel. More than 1 shows several slides side by side in a scrolling row. The editor preview still shows one slide."
          value={attributes.slidesPerView ?? 1}
          onChange={(val) =>
            setAttributes({ slidesPerView: val > 1 ? val : undefined })
          }
          min={1}
          max={6}
        />
        {(attributes.slidesPerView ?? 1) > 1 && (
          <>
            <RangeControl
              label="Slides per view (tablet)"
              value={attributes.slidesPerViewTablet ?? 2}
              onChange={(val) => setAttributes({ slidesPerViewTablet: val })}
              min={1}
              max={6}
            />
            <RangeControl
              label="Slides per view (mobile)"
              value={attributes.slidesPerViewMobile ?? 1}
              onChange={(val) => setAttributes({ slidesPerViewMobile: val })}
              min={1}
              max={4}
            />
            <RangeControl
              label="Gap between slides (px)"
              value={attributes.slideGap ?? 16}
              onChange={(val) => setAttributes({ slideGap: val })}
              min={0}
              max={80}
            />
          </>
        )}
      </PanelBody>
      <PanelBody title="Carousel Behaviour" initialOpen={false}>
        <ToggleControl
          label="Autoplay"
          checked={attributes.autoplay !== false}
          onChange={(val) =>
            setAttributes({ autoplay: val ? undefined : false })
          }
        />
        <ToggleControl
          label="Pause on hover"
          checked={attributes.pauseOnHover !== false}
          onChange={(val) =>
            setAttributes({ pauseOnHover: val ? undefined : false })
          }
        />
        <ToggleControl
          label="Loop back to the first slide"
          checked={attributes.loop !== false}
          onChange={(val) => setAttributes({ loop: val ? undefined : false })}
        />
        <ToggleControl
          label="Swipe on touch screens"
          checked={attributes.touch !== false}
          onChange={(val) => setAttributes({ touch: val ? undefined : false })}
        />
        <RangeControl
          label="Transition speed (ms)"
          value={attributes.transitionSpeed ?? 600}
          onChange={(val) => setAttributes({ transitionSpeed: val })}
          min={100}
          max={3000}
          step={50}
          allowReset
          resetFallbackValue={undefined}
        />
      </PanelBody>
      <PanelBody title="Carousel Look" initialOpen={false}>
        <SelectControl
          label="Arrows and dots"
          value={attributes.controlTheme || 'light'}
          options={[
            { label: 'Light (white)', value: 'light' },
            { label: 'Dark (black)', value: 'dark' },
          ]}
          onChange={(val) =>
            setAttributes({ controlTheme: val === 'light' ? undefined : val })
          }
        />
        <RangeControl
          label="Image height (px)"
          help="Leave unset to keep the natural image height."
          value={attributes.imageHeight ?? 400}
          onChange={(val) => setAttributes({ imageHeight: val })}
          min={100}
          max={1200}
          allowReset
          resetFallbackValue={undefined}
        />
        <SelectControl
          label="Image fit"
          value={attributes.imageFit || ''}
          options={[
            { label: 'Cover (crop to fill)', value: '' },
            { label: 'Contain (show whole image)', value: 'contain' },
          ]}
          onChange={(val) => setAttributes({ imageFit: val || undefined })}
        />
        <ToggleControl
          label="Show thumbnails"
          checked={!!attributes.showThumbnails}
          onChange={(val) =>
            setAttributes({ showThumbnails: val || undefined })
          }
        />
        <SelectControl
          label="Slide direction"
          value={attributes.direction || ''}
          options={[
            { label: 'Horizontal', value: '' },
            { label: 'Vertical', value: 'vertical' },
          ]}
          onChange={(val) => setAttributes({ direction: val || undefined })}
        />
        <SelectControl
          label="Caption alignment"
          value={attributes.captionAlign || ''}
          options={[
            { label: 'Center', value: '' },
            { label: 'Left', value: 'left' },
            { label: 'Right', value: 'right' },
          ]}
          onChange={(val) => setAttributes({ captionAlign: val || undefined })}
        />
      </PanelBody>
    </InspectorControls>
  );
};
export default Inspector;
