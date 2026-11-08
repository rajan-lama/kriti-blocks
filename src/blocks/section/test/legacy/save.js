import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

export default function save({ attributes }) {
  const {
    tagType,
    container,
    paddingY,
    background,
    htmlId,
    extraClass,
    borderStyle,
    borderWidth,
    borderColor,
    boxShadow,
  } = attributes;

  const SHADOW_STYLES = {
    small: '0 1px 3px rgba(0, 0, 0, 0.12)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.16)',
    large: '0 10px 20px rgba(0, 0, 0, 0.19)',
  };

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: `${paddingY} ${background} ${extraClass || ''}`.trim(),
    style: {
      borderStyle: borderStyle !== 'none' ? borderStyle : undefined,
      borderWidth: borderWidth ? `${borderWidth}px` : undefined,
      borderColor: borderColor || undefined,
      boxShadow: SHADOW_STYLES[boxShadow] || undefined,
    },
  });

  const Tag = tagType;

  return (
    <Tag {...blockProps}>
      {container !== 'none' && (
        <div className={container}>
          <InnerBlocks.Content />
        </div>
      )}
      {container === 'none' && <InnerBlocks.Content />}
    </Tag>
  );
}
