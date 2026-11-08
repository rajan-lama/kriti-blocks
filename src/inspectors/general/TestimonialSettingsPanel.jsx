import {
  PanelBody,
  ButtonGroup,
  Button,
  ToggleControl,
  TextControl,
  RangeControl,
  SelectControl,
  ColorPalette,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const TestimonialSettingsPanel = ({ attributes, setAttributes }) => {
  const { testimonialAlign, showQuoteMark } = attributes;

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  const onSelectAvatar = (media) => {
    setAttributes({
      avatarUrl: media.url,
      avatarId: media.id,
      avatarAlt: media.alt || '',
    });
  };

  const onRemoveAvatar = () => {
    setAttributes({
      avatarUrl: '',
      avatarId: 0,
      avatarAlt: '',
    });
  };

  return (
    <>
      <PanelBody
        title={__('Testimonial Settings', 'kriti-blocks')}
        initialOpen={true}
      >
        <ButtonGroup aria-label={__('Alignment', 'kriti-blocks')}>
          {alignmentOptions.map((option) => (
            <Button
              key={option.value}
              variant="secondary"
              isSmall
              onClick={() => setAttributes({ testimonialAlign: option.value })}
              isPressed={testimonialAlign === option.value}
            >
              {option.label}
            </Button>
          ))}
        </ButtonGroup>

        <ToggleControl
          label={__('Show decorative quote mark', 'kriti-blocks')}
          checked={!!showQuoteMark}
          onChange={(value) => setAttributes({ showQuoteMark: value })}
        />

        {attributes.avatarUrl ? (
          <Button variant="link" isDestructive onClick={onRemoveAvatar}>
            {__('Remove Avatar', 'kriti-blocks')}
          </Button>
        ) : (
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectAvatar}
              allowedTypes={['image']}
              value={attributes.avatarId}
              render={({ open }) => (
                <Button variant="secondary" onClick={open}>
                  {__('Add Avatar', 'kriti-blocks')}
                </Button>
              )}
            />
          </MediaUploadCheck>
        )}
      </PanelBody>

      <PanelBody
        title={__('Testimonial extras', 'kriti-blocks')}
        initialOpen={false}
      >
        <RangeControl
          label={__('Star rating (0 = hidden)', 'kriti-blocks')}
          value={attributes.rating || 0}
          min={0}
          max={5}
          onChange={(value) => setAttributes({ rating: value || undefined })}
        />
        <TextControl
          label={__('Company', 'kriti-blocks')}
          value={attributes.company || ''}
          onChange={(value) => setAttributes({ company: value || undefined })}
          __nextHasNoMarginBottom
        />
        <MediaUploadCheck>
          <MediaUpload
            onSelect={(media) =>
              setAttributes({
                logoUrl: media.url,
                logoId: media.id,
                logoAlt: media.alt || '',
              })
            }
            allowedTypes={['image']}
            value={attributes.logoId}
            render={({ open }) => (
              <Button variant="secondary" onClick={open}>
                {attributes.logoUrl
                  ? __('Replace company logo', 'kriti-blocks')
                  : __('Add company logo', 'kriti-blocks')}
              </Button>
            )}
          />
        </MediaUploadCheck>
        {attributes.logoUrl && (
          <Button
            variant="link"
            isDestructive
            onClick={() =>
              setAttributes({
                logoUrl: undefined,
                logoId: undefined,
                logoAlt: undefined,
              })
            }
          >
            {__('Remove company logo', 'kriti-blocks')}
          </Button>
        )}
        <SelectControl
          label={__('Avatar position', 'kriti-blocks')}
          value={attributes.avatarPosition || 'left'}
          options={[
            { label: __('Left of the name', 'kriti-blocks'), value: 'left' },
            { label: __('Above the name', 'kriti-blocks'), value: 'top' },
            { label: __('Right of the name', 'kriti-blocks'), value: 'right' },
          ]}
          onChange={(value) => setAttributes({ avatarPosition: value })}
          __nextHasNoMarginBottom
        />
        <SelectControl
          label={__('Avatar shape', 'kriti-blocks')}
          value={attributes.avatarShape || 'round'}
          options={[
            { label: __('Round', 'kriti-blocks'), value: 'round' },
            { label: __('Square', 'kriti-blocks'), value: 'square' },
          ]}
          onChange={(value) => setAttributes({ avatarShape: value })}
          __nextHasNoMarginBottom
        />
        <p>{__('Accent color (side border and quote mark)', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.accentColor}
          onChange={(color) => setAttributes({ accentColor: color })}
          headingLevel="3"
        />
        <p>{__('Star color', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.ratingColor}
          onChange={(color) => setAttributes({ ratingColor: color })}
          headingLevel="3"
        />
      </PanelBody>
    </>
  );
};

export default TestimonialSettingsPanel;
