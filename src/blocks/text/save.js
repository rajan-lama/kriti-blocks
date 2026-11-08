import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getTextStyles, getTextClasses } from './helpers';
import { getTextProps } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { tagType, content, htmlId } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    ...getTextProps(
      attributes,
      getTextClasses(attributes),
      getTextStyles(attributes),
    ),
  });

  return <RichText.Content {...blockProps} tagName={tagType} value={content} />;
}
