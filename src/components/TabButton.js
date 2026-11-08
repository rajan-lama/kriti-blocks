/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { TabPanel } from '@wordpress/components';
import LayoutOptions from '../hooks/LayoutOptions';
import AdvanceOptions from '../hooks/AdvanceOptions';
import GeneralOptions from '../hooks/GeneralOptions';

const PANELS = {
  general: GeneralOptions,
  layout: LayoutOptions,
  advanced: AdvanceOptions,
};

const TabButton = ({ attributes, setAttributes, blockName }) => {
  return (
    <TabPanel
      className="kriti-blocks-tab-panel"
      activeClass="active-tab"
      tabs={[
        {
          name: 'general',
          title: (
            <span
              className="kriti-blocks-tab-title"
              title={__('Settings specific to this block', 'kriti-blocks')}
            >
              <span className="dashicons dashicons-admin-generic"></span>
              <span>General</span>
            </span>
          ),
          className: 'tab-one',
        },
        {
          name: 'layout',
          title: (
            <span
              className="kriti-blocks-tab-title"
              title={__(
                'Spacing, colors, typography, borders and shadows',
                'kriti-blocks',
              )}
            >
              <span className="dashicons dashicons-layout"></span>
              <span>Layout</span>
            </span>
          ),
          className: 'tab-one',
        },
        {
          name: 'advanced',
          title: (
            <span
              className="kriti-blocks-tab-title"
              title={__(
                'Effects, animation, visibility, accessibility and custom CSS',
                'kriti-blocks',
              )}
            >
              <span className="dashicons dashicons-admin-settings"></span>
              <span>Advanced</span>
            </span>
          ),
          className: 'tab-two',
        },
      ]}
    >
      {(tab) => {
        const Panel = PANELS[tab.name];
        return Panel ? (
          <Panel
            attributes={attributes}
            setAttributes={setAttributes}
            blockName={blockName}
          />
        ) : null;
      }}
    </TabPanel>
  );
};
export default TabButton;
