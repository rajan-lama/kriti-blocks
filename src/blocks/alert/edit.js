import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getAlertIcon } from './helpers';
import { getCustomIcon } from './icons';
import { getAlertProps } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const {
    content,
    alertType,
    showIcon,
    htmlId,
    extraClass,
    alertTitle,
    showTitle,
    customIcon,
    dismissible,
  } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    ...getAlertProps(
      attributes,
      [extraClass, `bw-alert bw-alert--${alertType}`].filter(Boolean).join(' '),
    ),
  });

  const contentEl = (
    <RichText
      className="bw-alert-content"
      tagName="div"
      value={content}
      onChange={(value) => setAttributes({ content: value })}
      placeholder={__('Write message…', 'kriti-blocks')}
      allowedFormats={['core/bold', 'core/italic', 'core/link']}
    />
  );

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        {showIcon && (
          <span className="bw-alert-icon">
            {getCustomIcon(customIcon) || getAlertIcon(alertType)}
          </span>
        )}
        {showTitle || alertTitle ? (
          <div className="bw-alert-body">
            <RichText
              className="bw-alert-title"
              tagName="div"
              value={alertTitle}
              onChange={(value) => setAttributes({ alertTitle: value })}
              placeholder={__('Title', 'kriti-blocks')}
              allowedFormats={['core/bold', 'core/italic']}
            />
            {contentEl}
          </div>
        ) : (
          contentEl
        )}
        {dismissible === true && (
          <button
            type="button"
            className="bw-alert-dismiss"
            aria-label={__('Dismiss', 'kriti-blocks')}
          >
            &times;
          </button>
        )}
      </div>
    </>
  );
}
