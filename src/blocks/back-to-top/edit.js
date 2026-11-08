import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getBackToTopIconElement, getLabel, ProgressRing } from './options';
import { getBackToTopStyleVars, getBackToTopClassName } from './helpers';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { htmlId, extraClass } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, getBackToTopClassName(attributes)]
        .filter(Boolean)
        .join(' ') || undefined,
    style: getBackToTopStyleVars(attributes),
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <div className="bw-btt__editor">
          <span className="bw-btt__button" aria-hidden="true">
            {getBackToTopIconElement(attributes.iconType)}
            {getLabel(attributes.label) && (
              <span className="bw-btt__label">
                {getLabel(attributes.label)}
              </span>
            )}
            {attributes.showProgress === true && <ProgressRing />}
          </span>
          <span className="bw-btt__editor-label">
            {__('Back to top button', 'kriti-blocks')}
          </span>
        </div>
      </div>
    </>
  );
}
