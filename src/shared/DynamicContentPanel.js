import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { TextSourceFields } from './DynamicFields';

/**
 * Settings for the `kbDynamic` attribute of the heading and text blocks. The
 * text typed in the block is the fallback when the value is empty. The editor
 * keeps showing that text; the live value appears on the site.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {Element} Panel.
 */
export default function DynamicContentPanel({ attributes, setAttributes }) {
  return (
    <PanelBody
      title={__('Dynamic content', 'kriti-blocks')}
      initialOpen={false}
    >
      <TextSourceFields
        value={attributes.kbDynamic}
        onChange={(kbDynamic) => setAttributes({ kbDynamic })}
        label={__('Show', 'kriti-blocks')}
      />
      <p className="components-base-control__help">
        {__(
          'The live value appears on the site. The editor keeps showing your text, which is also used when the value is empty.',
          'kriti-blocks',
        )}
      </p>
    </PanelBody>
  );
}
