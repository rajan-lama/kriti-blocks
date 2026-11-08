import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getModalStyleVars, getModalClassName } from './helpers';

import './editor.scss';

const TEMPLATE = [
  ['core/heading', { level: 2, placeholder: 'Modal title' }],
  ['core/paragraph', { placeholder: 'Add modal content…' }],
];

export default function Edit({ attributes, setAttributes }) {
  const { triggerText, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, 'bw-modal', getModalClassName(attributes)]
        .filter(Boolean)
        .join(' ') || undefined,
    style: getModalStyleVars(attributes),
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <span className="bw-modal__trigger" aria-hidden="true">
          {triggerText || __('Open modal', 'kriti-blocks')}
        </span>
        <div className="bw-modal__panel">
          <p className="bw-modal__editor-note">
            {__(
              'Modal content is always visible in the editor so you can edit it.',
              'kriti-blocks',
            )}
          </p>
          <InnerBlocks template={TEMPLATE} />
        </div>
      </div>
    </>
  );
}
