/**
 * Design options shared by every Kriti Blocks block.
 *
 * - Adds the `kbStyle` attribute to each `kriti-blocks/*` block.
 * - Adds the "Design" panels to the block sidebar.
 * - Previews the result in the editor with a scoped <style> element.
 *
 * The front end output is produced in PHP (includes/class-kriti-blocks-design.php).
 */
import { addFilter } from '@wordpress/hooks';
import { createHigherOrderComponent } from '@wordpress/compose';
import { Fragment } from '@wordpress/element';

import DesignPanels, { DesignSections } from './DesignPanels';
import DynamicSlotsPanel, { SLOT_LABELS, LINK_LABELS } from './DynamicSlots';
import { BLOCK_PREFIX, buildCss } from './style-utils';

// Blocks whose sidebar does not use the General / Layout / Advanced tabs. They
// get the Design panels as their own sidebar panels. Every other block shows
// the same panels inside its Layout and Advanced tabs (see src/hooks).
const NON_TAB_BLOCKS = [
  'kriti-blocks/advance-header',
  'kriti-blocks/buttons',
  'kriti-blocks/carousel',
  'kriti-blocks/column',
  'kriti-blocks/columns',
  'kriti-blocks/icon',
  'kriti-blocks/woo-wishlist',
];

// The tabs live in each block's own bundle. They read the shared panels from
// here when they render, instead of bundling a copy into every block.
window.kritiBlocksDesign = { DesignSections };

const isKritiBlock = (name) =>
  typeof name === 'string' && name.startsWith(BLOCK_PREFIX);

addFilter(
  'blocks.registerBlockType',
  'kriti-blocks/design-attribute',
  (settings, name) => {
    if (!isKritiBlock(name)) {
      return settings;
    }
    return {
      ...settings,
      attributes: {
        ...settings.attributes,
        kbStyle: { type: 'object', default: {} },
        // Dynamic text for blocks listed in SLOT_LABELS.
        ...(SLOT_LABELS[name] ? { kbDynamicSlots: { type: 'object' } } : {}),
        ...(LINK_LABELS[name] ? { kbDynamicLinks: { type: 'object' } } : {}),
      },
    };
  },
);

const withDesignPanels = createHigherOrderComponent(
  (BlockEdit) => (props) => {
    if (!isKritiBlock(props.name)) {
      return <BlockEdit {...props} />;
    }
    return (
      <Fragment>
        <BlockEdit {...props} />
        <DynamicSlotsPanel
          blockName={props.name}
          attributes={props.attributes}
          setAttributes={props.setAttributes}
        />
        {NON_TAB_BLOCKS.includes(props.name) && (
          <DesignPanels
            blockName={props.name}
            value={props.attributes.kbStyle || {}}
            onChange={(kbStyle) => props.setAttributes({ kbStyle })}
          />
        )}
      </Fragment>
    );
  },
  'withKritiDesignPanels',
);

addFilter('editor.BlockEdit', 'kriti-blocks/design-panels', withDesignPanels);

const withDesignPreview = createHigherOrderComponent(
  (BlockListBlock) => (props) => {
    if (!isKritiBlock(props.name)) {
      return <BlockListBlock {...props} />;
    }
    const style = props.attributes?.kbStyle;
    const hasStyle = !!style && Object.keys(style).length > 0;
    const cls = `kb-e-${props.clientId.replace(/[^a-z0-9]/gi, '').slice(0, 12)}`;
    const css = hasStyle ? buildCss(style, `.${cls}`) : '';
    // The element structure must be the same with and without a style. A block that
    // changes shape here is rebuilt by React, which closes its sidebar tab and can
    // drop the text cursor the first time a style is set.
    return (
      <Fragment>
        {css ? <style>{css}</style> : null}
        <BlockListBlock
          {...props}
          className={
            hasStyle
              ? [props.className, cls].filter(Boolean).join(' ')
              : props.className
          }
        />
      </Fragment>
    );
  },
  'withKritiDesignPreview',
);

addFilter(
  'editor.BlockListBlock',
  'kriti-blocks/design-preview',
  withDesignPreview,
);
