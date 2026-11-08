import { useBlockProps, RichText } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import Inspector from './inspector';
import { getHeadingStyles } from './helpers';
import { getHeadingProps } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { tagType, content, htmlId } = attributes;

  const hasSub = !!(attributes.showSubheading || attributes.subheading);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    ...getHeadingProps(attributes, getHeadingStyles(attributes)),
  });

  const { subheading, subheadingPosition } = attributes;

  const main = (
    <RichText
      {...(hasSub ? {} : blockProps)}
      tagName={tagType}
      value={content}
      onChange={(value) => setAttributes({ content: value })}
      placeholder={__('Write heading…', 'kriti-blocks')}
      allowedFormats={['core/bold', 'core/italic', 'core/link']}
    />
  );

  const sub = (
    <RichText
      tagName="p"
      className="kb-heading-sub"
      value={subheading}
      onChange={(value) => setAttributes({ subheading: value })}
      placeholder={__('Write subheading…', 'kriti-blocks')}
      allowedFormats={['core/bold', 'core/italic', 'core/link']}
    />
  );

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      {hasSub ? (
        <div {...blockProps}>
          {subheadingPosition === 'above' ? (
            <>
              {sub}
              {main}
            </>
          ) : (
            <>
              {main}
              {sub}
            </>
          )}
        </div>
      ) : (
        main
      )}
    </>
  );
}
