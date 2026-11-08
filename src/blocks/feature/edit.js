import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getFeatureIcon } from './icons';
import { getFeatureStyles, getFeatureClassName } from './helpers';
import { getFeatureOptions } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const {
    icon,
    showIcon,
    title,
    description,
    linkText,
    linkUrl,
    htmlId,
    extraClass,
  } = attributes;

  const Icon = getFeatureIcon(icon);
  const options = getFeatureOptions(attributes);
  const TitleTag = options.titleTag;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, getFeatureClassName(attributes), ...options.classes]
        .filter(Boolean)
        .join(' ') || undefined,
    style: { ...getFeatureStyles(attributes), ...options.styleVars },
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <div className="bw-feature__inner">
          {showIcon && (
            <span
              className={
                options.image
                  ? 'bw-feature__icon bw-feature__icon--image'
                  : 'bw-feature__icon'
              }
              aria-hidden={
                options.image && options.image.alt ? undefined : 'true'
              }
            >
              {options.image ? (
                <img
                  src={options.image.url}
                  alt={options.image.alt}
                  loading="lazy"
                />
              ) : (
                Icon
              )}
            </span>
          )}
          <div className="bw-feature__content">
            {options.number && (
              <span className="bw-feature__number">{options.number}</span>
            )}
            <RichText
              tagName={TitleTag}
              className="bw-feature__title"
              value={title}
              onChange={(value) => setAttributes({ title: value })}
              placeholder={__('Feature title', 'kriti-blocks')}
            />
            <RichText
              tagName="p"
              className="bw-feature__description"
              value={description}
              onChange={(value) => setAttributes({ description: value })}
              placeholder={__('Describe this feature…', 'kriti-blocks')}
            />
            {(linkText || linkUrl) && (
              <RichText
                tagName="span"
                className="bw-feature__link"
                value={linkText}
                onChange={(value) => setAttributes({ linkText: value })}
                placeholder={__('Learn more', 'kriti-blocks')}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
