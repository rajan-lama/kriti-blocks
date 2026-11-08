import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getHeadingStyles } from './helpers';
import { getHeadingProps } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { tagType, content, htmlId, subheading, subheadingPosition } =
    attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    ...getHeadingProps(attributes, getHeadingStyles(attributes)),
  });

  if (!subheading) {
    return (
      <RichText.Content {...blockProps} tagName={tagType} value={content} />
    );
  }

  // With a subheading the block props move to a wrapper element.
  const sub = (
    <RichText.Content
      tagName="p"
      className="kb-heading-sub"
      value={subheading}
    />
  );
  const main = <RichText.Content tagName={tagType} value={content} />;

  return (
    <div {...blockProps}>
      {subheadingPosition === 'above' ? (
        <>
          {sub}
          {main}
        </>
      ) : (
        <>
          {main}
          {sub}
        </>
      )}
    </div>
  );
}
