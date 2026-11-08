import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getFeatureIcon } from './icons';
import { getFeatureStyles, getFeatureClassName } from './helpers';
import { getFeatureOptions } from './options';

import './style.scss';

export default function save({ attributes }) {
  const {
    icon,
    showIcon,
    title,
    description,
    linkText,
    linkUrl,
    linkNewTab,
    htmlId,
    extraClass,
  } = attributes;

  const Icon = getFeatureIcon(icon);
  const options = getFeatureOptions(attributes);
  const TitleTag = options.titleTag;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, getFeatureClassName(attributes), ...options.classes]
        .filter(Boolean)
        .join(' ') || undefined,
    style: { ...getFeatureStyles(attributes), ...options.styleVars },
  });

  return (
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
          {title && (
            <RichText.Content
              tagName={TitleTag}
              className="bw-feature__title"
              value={title}
            />
          )}
          {description && (
            <RichText.Content
              tagName="p"
              className="bw-feature__description"
              value={description}
            />
          )}
          {linkUrl && linkText && (
            <a
              className={options.linkClass}
              href={linkUrl}
              target={linkNewTab ? '_blank' : undefined}
              rel={linkNewTab ? 'noreferrer noopener' : undefined}
            >
              <RichText.Content tagName="span" value={linkText} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
