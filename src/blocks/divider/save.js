import { useBlockProps } from '@wordpress/block-editor';
import DividerElement from './element';
import { getDividerProps } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { htmlId } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    ...getDividerProps(attributes),
  });

  return (
    <div {...blockProps}>
      <DividerElement attributes={attributes} />
    </div>
  );
}
