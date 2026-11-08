import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import { __, sprintf } from '@wordpress/i18n';
import Inspector from './inspector';
import { getStickyStyleVars } from './helpers';
import { getStickyOptionClasses } from './options';

import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const { stickyOffset, htmlId, extraClass } = attributes;

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className:
      [extraClass, 'bw-sticky', ...getStickyOptionClasses(attributes)]
        .filter(Boolean)
        .join(' ') || undefined,
    style: getStickyStyleVars(attributes),
  });

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <span className="bw-sticky__badge">
          {sprintf(
            /* translators: %d: sticky offset in pixels. */
            __('Sticky — top %dpx', 'kriti-blocks'),
            stickyOffset,
          )}
        </span>
        <InnerBlocks
          template={[
            [
              'core/group',
              {},
              [
                [
                  'core/heading',
                  {
                    level: 2,
                    placeholder: 'Sticky content',
                  },
                ],
              ],
            ],
          ]}
        />
      </div>
    </>
  );
}
