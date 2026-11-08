import {
  FocalPointPicker,
  PanelBody,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';

export default function OptionsPanel({ attributes, setAttributes }) {
  const {
    url,
    linkType,
    linkUrl,
    linkNewTab,
    linkNofollow,
    hoverEffect,
    aspectRatio,
    focalPoint,
    captionPosition,
    imageShape,
  } = attributes;

  return (
    <>
      <PanelBody title={__('Image Link', 'kriti-blocks')} initialOpen={false}>
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Link to', 'kriti-blocks')}
          value={linkType || ''}
          options={[
            { label: __('Nothing', 'kriti-blocks'), value: '' },
            {
              label: __('Full-size image file', 'kriti-blocks'),
              value: 'media',
            },
            {
              label: __('Lightbox (opens larger)', 'kriti-blocks'),
              value: 'lightbox',
            },
            { label: __('Custom URL', 'kriti-blocks'), value: 'custom' },
          ]}
          onChange={(value) => setAttributes({ linkType: value || undefined })}
        />
        {linkType === 'custom' && (
          <TextControl
            __nextHasNoMarginBottom
            label={__('URL', 'kriti-blocks')}
            help={__(
              'http, https, mailto, tel or a relative URL.',
              'kriti-blocks',
            )}
            type="url"
            value={linkUrl || ''}
            onChange={(value) => setAttributes({ linkUrl: value || undefined })}
          />
        )}
        {linkType && linkType !== 'lightbox' && (
          <>
            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Open in new tab', 'kriti-blocks')}
              checked={!!linkNewTab}
              onChange={(value) =>
                setAttributes({ linkNewTab: value || undefined })
              }
            />
            <ToggleControl
              __nextHasNoMarginBottom
              label={__('Add nofollow', 'kriti-blocks')}
              checked={!!linkNofollow}
              onChange={(value) =>
                setAttributes({ linkNofollow: value || undefined })
              }
            />
          </>
        )}
      </PanelBody>

      <PanelBody
        title={__('Image Effects', 'kriti-blocks')}
        initialOpen={false}
      >
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Hover Effect', 'kriti-blocks')}
          value={hoverEffect || ''}
          options={[
            { label: __('None', 'kriti-blocks'), value: '' },
            { label: __('Zoom', 'kriti-blocks'), value: 'zoom' },
            { label: __('Lift', 'kriti-blocks'), value: 'lift' },
            {
              label: __('Grayscale to color', 'kriti-blocks'),
              value: 'grayscale',
            },
            { label: __('Brighten', 'kriti-blocks'), value: 'brighten' },
          ]}
          onChange={(value) =>
            setAttributes({ hoverEffect: value || undefined })
          }
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Shape Mask', 'kriti-blocks')}
          value={imageShape || ''}
          options={[
            { label: __('None', 'kriti-blocks'), value: '' },
            { label: __('Circle', 'kriti-blocks'), value: 'circle' },
            { label: __('Rounded', 'kriti-blocks'), value: 'rounded' },
            { label: __('Hexagon', 'kriti-blocks'), value: 'hexagon' },
            { label: __('Diamond', 'kriti-blocks'), value: 'diamond' },
            { label: __('Blob', 'kriti-blocks'), value: 'blob' },
          ]}
          onChange={(value) =>
            setAttributes({ imageShape: value || undefined })
          }
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Aspect Ratio', 'kriti-blocks')}
          value={aspectRatio || ''}
          options={[
            { label: __('Original', 'kriti-blocks'), value: '' },
            { label: '1:1', value: '1/1' },
            { label: '4:3', value: '4/3' },
            { label: '3:2', value: '3/2' },
            { label: '16:9', value: '16/9' },
            { label: '21:9', value: '21/9' },
            { label: '3:4', value: '3/4' },
            { label: '2:3', value: '2/3' },
          ]}
          onChange={(value) =>
            setAttributes({ aspectRatio: value || undefined })
          }
        />
        {url && (
          <FocalPointPicker
            __nextHasNoMarginBottom
            label={__('Focal Point', 'kriti-blocks')}
            help={__(
              'Which part stays visible when the image is cropped (use an aspect ratio or fixed height).',
              'kriti-blocks',
            )}
            url={url}
            value={focalPoint || { x: 0.5, y: 0.5 }}
            onChange={(value) => setAttributes({ focalPoint: value })}
          />
        )}
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Caption Position', 'kriti-blocks')}
          value={captionPosition || ''}
          options={[
            { label: __('Below the image', 'kriti-blocks'), value: '' },
            { label: __('Over the image', 'kriti-blocks'), value: 'overlay' },
          ]}
          onChange={(value) =>
            setAttributes({ captionPosition: value || undefined })
          }
        />
      </PanelBody>
    </>
  );
}
