import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getAlertIcon } from '../../helpers';

// (style import removed for tests)

export default function save({ attributes }) {
  const { content, alertType, showIcon, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, `bw-alert bw-alert--${alertType}`]
        .filter(Boolean)
        .join(' ') || undefined,
  });

  return (
    <div {...blockProps}>
      {showIcon && (
        <span className="bw-alert-icon">{getAlertIcon(alertType)}</span>
      )}
      {content && (
        <RichText.Content
          className="bw-alert-content"
          tagName="div"
          value={content}
        />
      )}
    </div>
  );
}
