import { useBlockProps, RichText } from '@wordpress/block-editor';

import { getTabsProps, startIndex } from './options';

import './style.scss';

export default function save({ attributes }) {
  const { tabItems, defaultTab, htmlId, extraClass } = attributes;

  const items = Array.isArray(tabItems) ? tabItems : [];
  const start = startIndex(defaultTab, items.length);
  const tabs = getTabsProps(attributes);

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className:
      [extraClass, ...tabs.classes].filter(Boolean).join(' ') || undefined,
    style: Object.keys(tabs.style).length ? tabs.style : undefined,
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
            className={'bw-tabs-tab' + (index === start ? ' is-active' : '')}
            role="tab"
            aria-selected={index === start ? 'true' : 'false'}
            tabIndex={index === start ? 0 : -1}
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
            hidden={index !== start}
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
