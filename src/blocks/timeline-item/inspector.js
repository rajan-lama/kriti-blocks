import { __ } from '@wordpress/i18n';
import {
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import {
  PanelBody,
  Button,
  ColorPalette,
  TextControl,
  ToggleControl,
} from '@wordpress/components';
import TabButton from '../../components/TabButton';
import getBWBlockName from '../../hooks/getBWBlockName';
import metadata from './block.json';

export default function Inspector({ attributes, setAttributes }) {
  return (
    <InspectorControls>
      <TabButton
        attributes={attributes}
        setAttributes={setAttributes}
        blockName={getBWBlockName(metadata.name)}
      />
      <PanelBody
        title={__('Timeline item', 'kriti-blocks')}
        initialOpen={false}
      >
        <p>{__('Accent color for this item', 'kriti-blocks')}</p>
        <ColorPalette
          value={attributes.itemColor}
          onChange={(color) => setAttributes({ itemColor: color })}
          headingLevel="3"
        />
        <ToggleControl
          label={__('Highlight this item', 'kriti-blocks')}
          checked={!!attributes.itemHighlight}
          onChange={(value) =>
            setAttributes({ itemHighlight: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        <MediaUploadCheck>
          <MediaUpload
            onSelect={(media) =>
              setAttributes({
                itemImageUrl: media.url,
                itemImageId: media.id,
                itemImageAlt: media.alt || '',
              })
            }
            allowedTypes={['image']}
            value={attributes.itemImageId}
            render={({ open }) => (
              <Button variant="secondary" onClick={open}>
                {attributes.itemImageUrl
                  ? __('Replace image', 'kriti-blocks')
                  : __('Add image', 'kriti-blocks')}
              </Button>
            )}
          />
        </MediaUploadCheck>
        {attributes.itemImageUrl && (
          <Button
            variant="link"
            isDestructive
            onClick={() =>
              setAttributes({
                itemImageUrl: undefined,
                itemImageId: undefined,
                itemImageAlt: undefined,
              })
            }
          >
            {__('Remove image', 'kriti-blocks')}
          </Button>
        )}
        <TextControl
          label={__('Link URL', 'kriti-blocks')}
          type="url"
          value={attributes.itemLinkUrl || ''}
          onChange={(value) =>
            setAttributes({ itemLinkUrl: value || undefined })
          }
          __nextHasNoMarginBottom
        />
        {attributes.itemLinkUrl && (
          <>
            <TextControl
              label={__('Link text', 'kriti-blocks')}
              help={__('Defaults to "Read more".', 'kriti-blocks')}
              value={attributes.itemLinkText || ''}
              onChange={(value) =>
                setAttributes({ itemLinkText: value || undefined })
              }
              __nextHasNoMarginBottom
            />
            <ToggleControl
              label={__('Open link in new tab', 'kriti-blocks')}
              checked={!!attributes.itemLinkNewTab}
              onChange={(value) =>
                setAttributes({ itemLinkNewTab: value || undefined })
              }
              __nextHasNoMarginBottom
            />
          </>
        )}
      </PanelBody>
    </InspectorControls>
  );
}
