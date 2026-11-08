import { useBlockProps } from '@wordpress/block-editor';
import Inspector from './inspector';
import DividerElement from './element';
import { getDividerProps } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { htmlId } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    ...getDividerProps(attributes),
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <DividerElement attributes={attributes} />
      </div>
    </>
  );
}
