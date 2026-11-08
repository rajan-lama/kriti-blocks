import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import Inspector from './inspector';
import metadata from './block.json';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const blockProps = useBlockProps({
    id: attributes.htmlId || undefined,
    className: attributes.extraClass || undefined,
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <ServerSideRender block={metadata.name} attributes={attributes} />
      </div>
    </>
  );
}
