import { PanelBody } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { ImageSourceFields, LinkSourceFields } from './DynamicFields';

/**
 * Dynamic picture and link for the image block. The picture and link set in
 * the block are the fallback when the live value is empty. The editor keeps
 * showing the saved picture; the live one appears on the site.
 *
 * @param {Object}   props               Component props.
 * @param {Object}   props.attributes    Block attributes.
 * @param {Function} props.setAttributes Attribute setter.
 * @return {Element} Panel.
 */
export default function DynamicImagePanel({ attributes, setAttributes }) {
  const config = attributes.kbDynamic || {};
  const update = (key) => (value) => {
    const next = { ...config, [key]: value };
    if (!value) {
      delete next[key];
    }
    setAttributes({ kbDynamic: Object.keys(next).length ? next : undefined });
  };

  return (
    <PanelBody
      title={__('Dynamic picture and link', 'kriti-blocks')}
      initialOpen={false}
    >
      <ImageSourceFields value={config.image} onChange={update('image')} />
      <LinkSourceFields value={config.link} onChange={update('link')} />
      <p className="components-base-control__help">
        {__(
          'The live values appear on the site. The editor keeps showing the picture and link set above, which are also used when a value is empty.',
          'kriti-blocks',
        )}
      </p>
    </PanelBody>
  );
}
