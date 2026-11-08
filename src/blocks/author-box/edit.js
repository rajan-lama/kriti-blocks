import { useBlockProps } from '@wordpress/block-editor';
import ServerSideRender from '@wordpress/server-side-render';
import { useSelect } from '@wordpress/data';
import Inspector from './inspector';
import metadata from './block.json';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const postId = useSelect((select) => {
    const editor = select('core/editor');

    return editor?.getCurrentPostId?.() || 0;
  }, []);

  const blockProps = useBlockProps({
    id: attributes.htmlId || undefined,
    className: attributes.extraClass || undefined,
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <ServerSideRender
          block={metadata.name}
          attributes={attributes}
          urlQueryArgs={{ post_id: postId }}
        />
      </div>
    </>
  );
}
