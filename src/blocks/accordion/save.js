import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';

import { getDisclosureProps, joinClasses } from '../../shared/disclosure';

import './style.scss';

export default function save({ attributes }) {
  const { closeOthers, htmlId, extraClass } = attributes;
  const group = getDisclosureProps(attributes);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: joinClasses(extraClass, group.classes),
    style: Object.keys(group.style).length ? group.style : undefined,
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
