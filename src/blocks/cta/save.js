import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { getCtaStyles } from './helpers';
import { getCtaOptions } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { tagType, htmlId, extraClass } = attributes;

  const options = getCtaOptions(attributes);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, ...options.classes].filter(Boolean).join(' ') || undefined,
    style: { ...getCtaStyles(attributes), ...options.style },
  });

  const Tag = tagType;

  return (
    <Tag {...blockProps}>
      <div className="bw-cta-content">
        <InnerBlocks.Content />
      </div>
    </Tag>
  );
}
