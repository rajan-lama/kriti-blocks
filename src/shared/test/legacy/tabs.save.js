import { useBlockProps, RichText } from '@wordpress/block-editor';

import '../../../blocks/tabs/style.scss';

export default function save({ attributes }) {
  const { tabItems, htmlId, extraClass } = attributes;

  const items = Array.isArray(tabItems) ? tabItems : [];

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
  });

  return (
    <div {...blockProps}>
      <noscript>
        <style>{'.bw-tabs-panel[hidden]{display:block}'}</style>
      </noscript>
      <div className="bw-tabs-header" role="tablist">
        {items.map((item, index) => (
          <button
            type="button"
            className={'bw-tabs-tab' + (index === 0 ? ' is-active' : '')}
            role="tab"
            aria-selected={index === 0 ? 'true' : 'false'}
            tabIndex={index === 0 ? 0 : -1}
            data-tab-index={index}
            key={index}
          >
            <RichText.Content value={item.label} />
          </button>
        ))}
      </div>
      <div className="bw-tabs-panels">
        {items.map((item, index) => (
          <div
            className="bw-tabs-panel"
            role="tabpanel"
            hidden={index !== 0}
            data-tab-index={index}
            key={index}
          >
            <RichText.Content value={item.content} />
          </div>
        ))}
      </div>
    </div>
  );
}
