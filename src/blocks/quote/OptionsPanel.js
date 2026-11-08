import { MediaUpload, MediaUploadCheck } from '@wordpress/block-editor';
import {
  Button,
  PanelBody,
  RangeControl,
  SelectControl,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ColorField } from '../../shared/kbsb-controls';

export default function OptionsPanel({ attributes, setAttributes }) {
  const {
    borderSide,
    borderWidth,
    showQuoteIcon,
    quoteIconColor,
    quoteColor,
    citationColor,
    citationStyle,
    authorImage,
    authorImageAlt,
  } = attributes;

  return (
    <>
      <PanelBody title={__('Quote Style', 'kriti-blocks')} initialOpen={false}>
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Border Side', 'kriti-blocks')}
          value={borderSide || 'left'}
          options={[
            { label: __('Left', 'kriti-blocks'), value: 'left' },
            { label: __('Right', 'kriti-blocks'), value: 'right' },
            { label: __('Top', 'kriti-blocks'), value: 'top' },
            { label: __('Bottom', 'kriti-blocks'), value: 'bottom' },
            { label: __('None', 'kriti-blocks'), value: 'none' },
          ]}
          onChange={(value) =>
            setAttributes({ borderSide: value === 'left' ? undefined : value })
          }
        />
        <RangeControl
          __nextHasNoMarginBottom
          label={__('Border Width (px)', 'kriti-blocks')}
          value={borderWidth ?? 4}
          onChange={(value) => setAttributes({ borderWidth: value })}
          min={1}
          max={24}
        />
        <ToggleControl
          __nextHasNoMarginBottom
          label={__('Show quotation mark', 'kriti-blocks')}
          checked={!!showQuoteIcon}
          onChange={(value) =>
            setAttributes({ showQuoteIcon: value || undefined })
          }
        />
        {showQuoteIcon && (
          <ColorField
            label={__('Quotation Mark Color', 'kriti-blocks')}
            value={quoteIconColor}
            onChange={(value) => setAttributes({ quoteIconColor: value })}
          />
        )}
        <ColorField
          label={__('Quote Text Color', 'kriti-blocks')}
          value={quoteColor}
          onChange={(value) => setAttributes({ quoteColor: value })}
        />
      </PanelBody>

      <PanelBody
        title={__('Citation and Author', 'kriti-blocks')}
        initialOpen={false}
      >
        <ColorField
          label={__('Citation Color', 'kriti-blocks')}
          value={citationColor}
          onChange={(value) => setAttributes({ citationColor: value })}
        />
        <SelectControl
          __nextHasNoMarginBottom
          label={__('Citation Font Style', 'kriti-blocks')}
          value={citationStyle || 'italic'}
          options={[
            { label: __('Italic', 'kriti-blocks'), value: 'italic' },
            { label: __('Normal', 'kriti-blocks'), value: 'normal' },
          ]}
          onChange={(value) =>
            setAttributes({
              citationStyle: value === 'italic' ? undefined : value,
            })
          }
        />
        <MediaUploadCheck>
          <MediaUpload
            allowedTypes={['image']}
            onSelect={(media) =>
              setAttributes({
                authorImage: media.url,
                authorImageAlt: authorImageAlt || media.alt || undefined,
              })
            }
            render={({ open }) => (
              <Button variant="secondary" onClick={open}>
                {authorImage
                  ? __('Replace author image', 'kriti-blocks')
                  : __('Add author image', 'kriti-blocks')}
              </Button>
            )}
          />
        </MediaUploadCheck>
        {authorImage && (
          <>
            <TextControl
              __nextHasNoMarginBottom
              label={__('Author image alt text', 'kriti-blocks')}
              value={authorImageAlt || ''}
              onChange={(value) =>
                setAttributes({ authorImageAlt: value || undefined })
              }
            />
            <Button
              variant="link"
              isDestructive
              onClick={() =>
                setAttributes({
                  authorImage: undefined,
                  authorImageAlt: undefined,
                })
              }
            >
              {__('Remove author image', 'kriti-blocks')}
            </Button>
          </>
        )}
      </PanelBody>
    </>
  );
}
