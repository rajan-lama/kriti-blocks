import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getOffcanvasStyleVars, getOffcanvasClassName } from './helpers';

import './editor.scss';

const TEMPLATE = [
  ['core/heading', { level: 2, placeholder: 'Drawer title' }],
  ['core/navigation', {}],
];

export default function Edit({ attributes, setAttributes }) {
  const { triggerText, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, 'bw-offcanvas', getOffcanvasClassName(attributes)]
        .filter(Boolean)
        .join(' ') || undefined,
    style: getOffcanvasStyleVars(attributes),
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <span className="bw-offcanvas__trigger" aria-hidden="true">
          {triggerText || __('Open menu', 'kriti-blocks')}
        </span>
        <div className="bw-offcanvas__panel">
          <p className="bw-offcanvas__editor-note">
            {__(
              'Drawer content is always visible in the editor so you can edit it.',
              'kriti-blocks',
            )}
          </p>
          <InnerBlocks template={TEMPLATE} />
        </div>
      </div>
    </>
  );
}
