import { useBlockProps, RichText } from '@wordpress/block-editor';
import { useState } from '@wordpress/element';
import { Button, ButtonGroup } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getTabsProps, startIndex } from './options';
import {
  addTabItem,
  removeTabItem,
  updateTabItem,
  clampIndex,
} from './helpers';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { tabItems, defaultTab, htmlId, extraClass } = attributes;

  const items = Array.isArray(tabItems) ? tabItems : [];

  const [activeIndex, setActiveIndex] = useState(() =>
    startIndex(defaultTab, Array.isArray(tabItems) ? tabItems.length : 0),
  );

  const safeIndex = clampIndex(activeIndex, items.length);

  const tabs = getTabsProps(attributes);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, ...tabs.classes].filter(Boolean).join(' ') || undefined,
    style: Object.keys(tabs.style).length ? tabs.style : undefined,
  });

  const onAddTab = () => {
    addTabItem(tabItems, setAttributes);
    setActiveIndex(items.length);
  };

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <div className="bw-tabs-header" role="tablist">
          {items.map((item, index) => (
            <Button
              key={index}
              className={
                'bw-tabs-tab' + (index === safeIndex ? ' is-active' : '')
              }
              variant="tertiary"
              onClick={() => setActiveIndex(index)}
            >
              <RichText
                tagName="span"
                value={item.label}
                onChange={(value) =>
                  updateTabItem(index, 'label', value, tabItems, setAttributes)
                }
                placeholder={__('Tab label', 'kriti-blocks')}
              />
            </Button>
          ))}
          <Button
            className="bw-tabs-add"
            variant="primary"
            isSmall
            onClick={onAddTab}
          >
            +
          </Button>
        </div>

        <div className="bw-tabs-panels">
          {items.length === 0 && (
            <p className="bw-tabs-empty">
              {__('No tabs yet. Use the + button to add one.', 'kriti-blocks')}
            </p>
          )}

          {items.map((item, index) => (
            <div
              className="bw-tabs-panel"
              key={index}
              role="tabpanel"
              hidden={index !== safeIndex}
            >
              <RichText
                tagName="div"
                value={item.content}
                onChange={(value) =>
                  updateTabItem(
                    index,
                    'content',
                    value,
                    tabItems,
                    setAttributes,
                  )
                }
                placeholder={__('Panel content…', 'kriti-blocks')}
              />
            </div>
          ))}
        </div>

        {items.length > 1 && (
          <ButtonGroup className="bw-tabs-actions">
            <Button
              variant="link"
              isDestructive
              isSmall
              onClick={() => {
                const current = clampIndex(activeIndex, items.length);
                const remaining = items.length - 1;
                removeTabItem(current, tabItems, setAttributes);
                setActiveIndex(clampIndex(current, remaining));
              }}
            >
              {__('Remove active tab', 'kriti-blocks')}
            </Button>
          </ButtonGroup>
        )}
      </div>
    </>
  );
}
