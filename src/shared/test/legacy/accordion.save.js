import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import '../../../blocks/accordion/style.scss';

export default function save({ attributes }) {
  const { closeOthers, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    'data-bw-accordion-close-others': closeOthers ? 'true' : 'false',
  });

  return (
    <div {...blockProps}>
      <noscript>
        <style>
          {`.wp-block-kriti-blocks-accordion .bw-accordion-panel[hidden] { display: block !important; }`}
        </style>
      </noscript>
      <InnerBlocks.Content />
    </div>
  );
}
