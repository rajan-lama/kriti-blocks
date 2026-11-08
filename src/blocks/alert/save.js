import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getAlertIcon } from './helpers';
import { getCustomIcon } from './icons';
import { getAlertProps } from './options';

import './style.scss';

export default function save({ attributes }) {
  const {
    content,
    alertType,
    showIcon,
    htmlId,
    extraClass,
    alertTitle,
    customIcon,
    dismissible,
  } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    ...getAlertProps(
      attributes,
      [extraClass, `bw-alert bw-alert--${alertType}`].filter(Boolean).join(' '),
    ),
  });

  const contentEl = content && (
    <RichText.Content
      className="bw-alert-content"
      tagName="div"
      value={content}
    />
  );

  return (
    <div {...blockProps}>
      {showIcon && (
        <span className="bw-alert-icon">
          {getCustomIcon(customIcon) || getAlertIcon(alertType)}
        </span>
      )}
      {alertTitle ? (
        <div className="bw-alert-body">
          <RichText.Content
            className="bw-alert-title"
            tagName="div"
            value={alertTitle}
          />
          {contentEl}
        </div>
      ) : (
        contentEl
      )}
      {dismissible === true && (
        <button type="button" className="bw-alert-dismiss" aria-label="Dismiss">
          &times;
        </button>
      )}
    </div>
  );
}
