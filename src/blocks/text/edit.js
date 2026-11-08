import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getTextStyles, getTextClasses } from './helpers';
import { getTextProps } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { tagType, content, htmlId } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    ...getTextProps(
      attributes,
      getTextClasses(attributes),
      getTextStyles(attributes),
    ),
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <RichText
        {...blockProps}
        tagName={tagType}
        value={content}
        onChange={(value) => setAttributes({ content: value })}
        placeholder={__('Write text…', 'kriti-blocks')}
        allowedFormats={[
          'core/bold',
          'core/italic',
          'core/link',
          'core/strikethrough',
        ]}
      />
    </>
  );
}
