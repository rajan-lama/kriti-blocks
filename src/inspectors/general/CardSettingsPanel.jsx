import {
  PanelBody,
  ButtonGroup,
  Button,
  RangeControl,
  ToggleControl,
  SelectControl,
  TextControl,
  ColorPalette,
} from '@wordpress/components';
import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

const CARD_IMAGE_ALLOWED_TYPES = ['image'];

const CardSettingsPanel = ({ attributes, setAttributes }) => {
  const { cardAlign, cardPadding, borderRadius, hasShadow } = attributes;

  const alignmentOptions = [
    { label: 'Left', value: 'left' },
    { label: 'Center', value: 'center' },
    { label: 'Right', value: 'right' },
  ];

  const onSelectImage = (media) => {
    setAttributes({
      cardImageUrl: media.url,
      cardImageId: media.id,
      cardImageAlt: media.alt || '',
    });
  };

  const onRemoveImage = () => {
    setAttributes({
      cardImageUrl: '',
      cardImageId: 0,
      cardImageAlt: '',
    });
  };

  return (
    <PanelBody title={__('Card Settings', 'kriti-blocks')} initialOpen={true}>
      <MediaUploadCheck>
        <MediaUpload
          onSelect={onSelectImage}
          allowedTypes={CARD_IMAGE_ALLOWED_TYPES}
          value={attributes.cardImageId}
          render={({ open }) => (
            <Button variant="secondary" onClick={open}>
              {attributes.cardImageUrl
                ? __('Replace Image', 'kriti-blocks')
                : __('Choose Image', 'kriti-blocks')}
            </Button>
          )}
        />
      </MediaUploadCheck>

      {attributes.cardImageUrl && (
        <Button variant="link" isDestructive onClick={onRemoveImage}>
          {__('Remove Image', 'kriti-blocks')}
        </Button>
      )}

      <ButtonGroup aria-label={__('Content Alignment', 'kriti-blocks')}>
        {alignmentOptions.map((option) => (
          <Button
            key={option.value}
            variant="secondary"
            isSmall
            onClick={() => setAttributes({ cardAlign: option.value })}
            isPressed={cardAlign === option.value}
          >
            {option.label}
          </Button>
        ))}
      </ButtonGroup>

      <SelectControl
        label={__('Content Padding', 'kriti-blocks')}
        value={cardPadding}
        options={[
          { label: 'None', value: 'none' },
          { label: 'Small', value: 'small' },
          { label: 'Medium', value: 'medium' },
          { label: 'Large', value: 'large' },
        ]}
        onChange={(value) => setAttributes({ cardPadding: value })}
      />

      <SelectControl
        label={__('HTML Tag', 'kriti-blocks')}
        value={attributes.tagType}
        options={[
          { label: 'Div', value: 'div' },
          { label: 'Article', value: 'article' },
          { label: 'Aside', value: 'aside' },
        ]}
        onChange={(value) => setAttributes({ tagType: value })}
      />

      <RangeControl
        label={__('Border Radius', 'kriti-blocks')}
        value={borderRadius || 0}
        onChange={(value) => setAttributes({ borderRadius: value || '' })}
        min={0}
        max={50}
      />

      <ToggleControl
        label={__('Shadow', 'kriti-blocks')}
        checked={!!hasShadow}
        onChange={(value) => setAttributes({ hasShadow: value })}
      />

      <SelectControl
        label={__('Image position', 'kriti-blocks')}
        value={attributes.imagePosition || 'top'}
        options={[
          { label: __('Top', 'kriti-blocks'), value: 'top' },
          { label: __('Left', 'kriti-blocks'), value: 'left' },
          { label: __('Right', 'kriti-blocks'), value: 'right' },
        ]}
        onChange={(value) => setAttributes({ imagePosition: value })}
        __nextHasNoMarginBottom
      />

      <SelectControl
        label={__('Image aspect ratio', 'kriti-blocks')}
        value={attributes.imageRatio || ''}
        options={[
          { label: __('Original', 'kriti-blocks'), value: '' },
          { label: '16:9', value: '16-9' },
          { label: '4:3', value: '4-3' },
          { label: '3:2', value: '3-2' },
          { label: '1:1', value: '1-1' },
        ]}
        onChange={(value) => setAttributes({ imageRatio: value || undefined })}
        __nextHasNoMarginBottom
      />

      <SelectControl
        label={__('Hover effect', 'kriti-blocks')}
        value={attributes.hoverEffect || 'none'}
        options={[
          { label: __('None', 'kriti-blocks'), value: 'none' },
          { label: __('Lift', 'kriti-blocks'), value: 'lift' },
          { label: __('Zoom image', 'kriti-blocks'), value: 'zoom' },
        ]}
        onChange={(value) => setAttributes({ hoverEffect: value })}
        __nextHasNoMarginBottom
      />

      <TextControl
        label={__('Badge text', 'kriti-blocks')}
        value={attributes.badgeText || ''}
        onChange={(value) => setAttributes({ badgeText: value || undefined })}
        __nextHasNoMarginBottom
      />

      {attributes.badgeText && (
        <>
          <p>{__('Badge background', 'kriti-blocks')}</p>
          <ColorPalette
            value={attributes.badgeBg}
            onChange={(color) => setAttributes({ badgeBg: color })}
            headingLevel="3"
          />
          <p>{__('Badge text color', 'kriti-blocks')}</p>
          <ColorPalette
            value={attributes.badgeColor}
            onChange={(color) => setAttributes({ badgeColor: color })}
            headingLevel="3"
          />
        </>
      )}

      <TextControl
        label={__('Link the whole card to', 'kriti-blocks')}
        type="url"
        value={attributes.cardLinkUrl || ''}
        onChange={(value) => setAttributes({ cardLinkUrl: value || undefined })}
        __nextHasNoMarginBottom
      />

      {attributes.cardLinkUrl && (
        <>
          <TextControl
            label={__('Link accessible label', 'kriti-blocks')}
            help={__(
              'Read by screen readers. Defaults to "Read more".',
              'kriti-blocks',
            )}
            value={attributes.cardLinkLabel || ''}
            onChange={(value) =>
              setAttributes({ cardLinkLabel: value || undefined })
            }
            __nextHasNoMarginBottom
          />
          <ToggleControl
            label={__('Open link in new tab', 'kriti-blocks')}
            checked={!!attributes.cardLinkNewTab}
            onChange={(value) =>
              setAttributes({ cardLinkNewTab: value || undefined })
            }
            __nextHasNoMarginBottom
          />
        </>
      )}
    </PanelBody>
  );
};

export default CardSettingsPanel;
