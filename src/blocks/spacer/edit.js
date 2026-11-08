import { useBlockProps } from '@wordpress/block-editor';
import Inspector from './inspector';
import { getSpacerStyles } from './helpers';
import { getSpacerProps } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { htmlId } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    ...getSpacerProps(attributes, getSpacerStyles(attributes)),
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps} aria-hidden="true" />
    </>
  );
}
