import {
  useBlockProps,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getLogoProps } from './options';

import './editor.scss';

const ALLOWED_TYPES = ['image'];

export default function Edit({ attributes, setAttributes }) {
  const { logos, logoColumns, grayscale, htmlId, extraClass } = attributes;

  const items = Array.isArray(logos) ? logos : [];
  const columnCount = logoColumns || 4;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    ...getLogoProps(
      attributes,
      [
        extraClass,
        `bw-logo-cols-${columnCount}`,
        grayscale ? '' : 'bw-logo-grid-color',
      ]
        .filter(Boolean)
        .join(' '),
    ),
  });

  const setLogos = (next) => setAttributes({ logos: next });

  const onAddLogo = (media) => {
    setLogos([
      ...items,
      { url: media.url, id: media.id, alt: media.alt || '' },
    ]);
  };

  const onReplaceLogo = (index, media) => {
    setLogos(
      items.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              url: media.url,
              id: media.id,
              alt: media.alt || item.alt || '',
            }
          : item,
      ),
    );
  };

  const onRemoveLogo = (index) => {
    setLogos(items.filter((item, itemIndex) => itemIndex !== index));
  };

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <MediaUploadCheck>
        <div {...blockProps}>
          {items.map((item, index) => (
            <div className="bw-logo-cell" key={item.id || index}>
              <MediaUpload
                onSelect={(media) => onReplaceLogo(index, media)}
                allowedTypes={ALLOWED_TYPES}
                value={item.id}
                render={({ open }) => (
                  <button
                    type="button"
                    className="bw-logo-tile"
                    onClick={open}
                    aria-label={__('Replace logo', 'kriti-blocks')}
                  >
                    <img src={item.url} alt={item.alt || ''} loading="lazy" />
                  </button>
                )}
              />
              <Button
                variant="link"
                isDestructive
                isSmall
                className="bw-logo-remove"
                onClick={() => onRemoveLogo(index)}
              >
                {__('Remove', 'kriti-blocks')}
              </Button>
            </div>
          ))}
          <MediaUpload
            onSelect={onAddLogo}
            allowedTypes={ALLOWED_TYPES}
            render={({ open }) => (
              <Button
                variant="secondary"
                className="bw-logo-add"
                onClick={open}
              >
                {__('Add Logo', 'kriti-blocks')}
              </Button>
            )}
          />
        </div>
      </MediaUploadCheck>
    </>
  );
}
