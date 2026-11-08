import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getFeatureIcon } from '../../icons';
import { getFeatureStyles, getFeatureClassName } from '../../helpers';

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

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, getFeatureClassName(attributes)].filter(Boolean).join(' ') ||
      undefined,
    style: getFeatureStyles(attributes),
  });

  return (
    <div {...blockProps}>
      <div className="bw-feature__inner">
        {showIcon && (
          <span className="bw-feature__icon" aria-hidden="true">
            <Icon />
          </span>
        )}
        <div className="bw-feature__content">
          {title && (
            <RichText.Content
              tagName="h3"
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
              className="bw-feature__link"
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
