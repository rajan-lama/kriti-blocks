import { useBlockProps } from '@wordpress/block-editor';
import { getSpacerStyles } from './helpers';
import { getSpacerProps } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { htmlId } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    ...getSpacerProps(attributes, getSpacerStyles(attributes)),
  });

  return <div {...blockProps} aria-hidden="true" />;
}
