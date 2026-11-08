import { InspectorControls } from '@wordpress/block-editor';
import TabButton from '../../components/TabButton';
import getBWBlockName from '../../hooks/getBWBlockName';
import DisclosurePanel from '../../shared/DisclosurePanel';
import metadata from './block.json';
import { __ } from '@wordpress/i18n';
import { PanelBody, ToggleControl } from '@wordpress/components';

export default function Inspector({ attributes, setAttributes }) {
  return (
    <InspectorControls>
      <TabButton
        attributes={attributes}
        setAttributes={setAttributes}
        blockName={getBWBlockName(metadata.name)}
      />
      <PanelBody title={__('Behavior', 'kriti-blocks')} initialOpen={false}>
        <ToggleControl
          label={__('Only one open at a time', 'kriti-blocks')}
          help={__(
            'Opening an item closes the others. Needs a current browser; older ones keep all items independent.',
            'kriti-blocks',
          )}
          checked={!!attributes.openOne}
          onChange={(openOne) =>
            setAttributes({
              openOne,
              groupName:
                openOne && !attributes.groupName
                  ? 'kb-faq-' + Math.random().toString(36).slice(2, 8)
                  : attributes.groupName,
            })
          }
          __nextHasNoMarginBottom
        />
      </PanelBody>
      <DisclosurePanel attributes={attributes} setAttributes={setAttributes} />
    </InspectorControls>
  );
}
