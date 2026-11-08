import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import { LinkSourceFields, TextSourceFields } from '../shared/DynamicFields';

/**
 * Text that can be made dynamic in blocks other than heading, text, image and
 * buttons: block => [slot id, label]. The slot ids match SLOTS in
 * includes/class-kriti-blocks-dynamic.php.
 */
export const SLOT_LABELS = {
  'kriti-blocks/team-member': [
    ['name', __('Name', 'kriti-blocks')],
    ['role', __('Role', 'kriti-blocks')],
    ['bio', __('Bio', 'kriti-blocks')],
  ],
  'kriti-blocks/testimonial': [
    ['quote', __('Quote', 'kriti-blocks')],
    ['author', __('Author', 'kriti-blocks')],
    ['role', __('Role', 'kriti-blocks')],
  ],
  'kriti-blocks/feature': [
    ['title', __('Title', 'kriti-blocks')],
    ['description', __('Description', 'kriti-blocks')],
  ],
  'kriti-blocks/quote': [
    ['content', __('Quote', 'kriti-blocks')],
    ['citation', __('Citation', 'kriti-blocks')],
  ],
  'kriti-blocks/stat': [['label', __('Label', 'kriti-blocks')]],
  'kriti-blocks/alert': [
    ['title', __('Title', 'kriti-blocks')],
    ['content', __('Message', 'kriti-blocks')],
  ],
  'kriti-blocks/pricing-column': [['plan', __('Plan name', 'kriti-blocks')]],
};

/**
 * Links that can be made dynamic: block => [slot id, label]. The link must
 * already be set in the block, because the live value replaces it. Slot ids
 * match LINK_SLOTS in includes/class-kriti-blocks-dynamic.php.
 */
export const LINK_LABELS = {
  'kriti-blocks/card': [['link', __('Card link', 'kriti-blocks')]],
  'kriti-blocks/feature': [['link', __('Link', 'kriti-blocks')]],
  'kriti-blocks/pricing-column': [
    ['button', __('Button link', 'kriti-blocks')],
  ],
  'kriti-blocks/team-member': [['profile', __('Profile link', 'kriti-blocks')]],
};

/**
 * One "Dynamic content" panel for the blocks in SLOT_LABELS. Each slot keeps
 * the text typed in the block as its fallback.
 *
 * @param {Object}   props               Component props.
 * @param {string}   props.blockName     Block name.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {Element|null} Panel.
 */
export default function DynamicSlotsPanel({
  blockName,
  attributes,
  setAttributes,
}) {
  const slots = SLOT_LABELS[blockName] || [];
  const links = LINK_LABELS[blockName] || [];
  if (!slots.length && !links.length) {
    return null;
  }
  const current = attributes.kbDynamicSlots || {};
  const currentLinks = attributes.kbDynamicLinks || {};

  const updater = (attribute, values) => (slot) => (config) => {
    const next = { ...values, [slot]: config };
    if (!config) {
      delete next[slot];
    }
    setAttributes({
      [attribute]: Object.keys(next).length ? next : undefined,
    });
  };
  const update = updater('kbDynamicSlots', current);
  const updateLink = updater('kbDynamicLinks', currentLinks);

  return (
    <InspectorControls>
      <PanelBody
        title={__('Dynamic content', 'kriti-blocks')}
        initialOpen={false}
      >
        <p className="components-base-control__help">
          {__(
            'Type some text (and set a link) in the block first. The live value replaces it on the site, and what you typed is used when the value is empty. The editor keeps showing what you typed.',
            'kriti-blocks',
          )}
        </p>
        {slots.map(([slot, label]) => (
          <div key={slot} style={{ marginBottom: 16 }}>
            <TextSourceFields
              label={label}
              value={current[slot]}
              onChange={update(slot)}
            />
          </div>
        ))}
        {links.map(([slot, label]) => (
          <div key={slot} style={{ marginBottom: 16 }}>
            <LinkSourceFields
              label={label}
              value={currentLinks[slot]}
              onChange={updateLink(slot)}
            />
          </div>
        ))}
      </PanelBody>
    </InspectorControls>
  );
}
