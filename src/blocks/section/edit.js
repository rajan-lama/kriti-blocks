import {
  useBlockProps,
  InspectorControls,
  InnerBlocks,
} from '@wordpress/block-editor';

import { PanelBody, SelectControl } from '@wordpress/components';
import Inspector from './inspector';
import { getSectionOptions, BackgroundLayer, joinClasses } from './options';

/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * Those files can contain any CSS code that gets applied to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './editor.scss';

export default function Edit({ attributes, setAttributes }) {
  const {
    layout,
    tagType,
    container,
    paddingY,
    background,
    htmlId,
    extraClass,
    borderStyle,
    borderWidth,
    borderColor,
    boxShadow,
  } = attributes;

  const SHADOW_STYLES = {
    small: '0 1px 3px rgba(0, 0, 0, 0.12)',
    medium: '0 3px 6px rgba(0, 0, 0, 0.16)',
    large: '0 10px 20px rgba(0, 0, 0, 0.19)',
  };

  const options = getSectionOptions(attributes, true);

  const blockProps = useBlockProps({
    id: htmlId || undefined,
    className: joinClasses(
      `${paddingY} ${background} ${extraClass || ''}`.trim(),
      options.classes,
    ),
    style: {
      borderStyle: borderStyle !== 'none' ? borderStyle : undefined,
      borderWidth: borderWidth ? `${borderWidth}px` : undefined,
      borderColor: borderColor || undefined,
      boxShadow: SHADOW_STYLES[boxShadow] || undefined,
      ...options.style,
    },
  });

  const Tag = tagType;

  const LAYOUTS = {
    'layout-one': ['col-12'],
    'layout-two': ['col-6', 'col-6'],
    'layout-three': ['col-4', 'col-4', 'col-4'],
    'layout-four': ['col-3', 'col-3', 'col-3', 'col-3'],
    'layout-five': ['col-2-4', 'col-2-4', 'col-2-4', 'col-2-4', 'col-2-4'],
    'layout-six': ['col-2', 'col-2', 'col-2', 'col-2', 'col-2', 'col-2'],

    // Custom layouts
    'layout-eight-four': ['col-8', 'col-4'],
    'layout-four-eight': ['col-4', 'col-8'],
    'layout-nine-three': ['col-9', 'col-3'],
    'layout-three-nine': ['col-3', 'col-9'],
    'layout-five-seven': ['col-5', 'col-7'],
    'layout-seven-five': ['col-7', 'col-5'],
    'layout-eighty-twenty': ['col-10', 'col-2'],
    'layout-twenty-eighty': ['col-2', 'col-10'],
    'layout-three-three-six': ['col-3', 'col-3', 'col-6'],
    'layout-six-three-three': ['col-6', 'col-3', 'col-3'],
    'layout-four-four-four': ['col-4', 'col-4', 'col-4'],
    'layout-two-four-four-two': ['col-2', 'col-4', 'col-4', 'col-2'],
    'layout-none': ['col-12'],
  };

  const getColumns = (layout) => LAYOUTS[layout] ?? ['col-12'];

  const TEMPLATE = getColumns(layout).map((colClass) => [
    'kriti-blocks/columns',
    { layout: 'layout-one' },
  ]);

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <Tag {...blockProps}>
        <BackgroundLayer layer={options.bgLayer} />
        {container !== 'none' && (
          <div className={container}>
            <InnerBlocks template={TEMPLATE} />
          </div>
        )}

        {container === 'none' && <InnerBlocks />}
      </Tag>
    </>
  );
}
