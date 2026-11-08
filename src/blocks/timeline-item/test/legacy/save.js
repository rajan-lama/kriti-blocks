import { useBlockProps, RichText, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
  const { itemDate, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
  });

  return (
    <div {...blockProps}>
      {itemDate && (
        <RichText.Content
          tagName="div"
          className="bw-timeline-item__date"
          value={itemDate}
        />
      )}
      <div className="bw-timeline-item__content">
        <InnerBlocks.Content />
      </div>
    </div>
  );
}
