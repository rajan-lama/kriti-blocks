import { useEffect } from '@wordpress/element';
import { useSelect, useDispatch } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { Button } from '@wordpress/components';
import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import Inspector from './inspector';
import { getColumnsOptions, joinClasses } from './options';

import './editor.scss';

// Column widths for each layout. Constants, so they live outside the component.
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
  'layout-none': [],
};

const getColumns = (layout) => LAYOUTS[layout] ?? ['col-12'];

// The layouts offered before one is chosen. Buttons, so they work with the keyboard.
const LAYOUT_CHOICES = [
  ['layout-one', 'Column 1'],
  ['layout-two', 'Column 2'],
  ['layout-three', 'Column 3'],
  ['layout-four', 'Column 4'],
  ['layout-five', 'Column 5'],
  ['layout-six', 'Column 6'],
  ['layout-eight-four', 'Column 7'],
];

export default function Edit({ attributes, setAttributes, clientId }) {
  const { layout, paddingY, background } = attributes;

  const options = getColumnsOptions(attributes);

  const blockProps = useBlockProps({
    className: joinClasses(`row ${paddingY} ${background}`, options.classes),
  });

  // Get current inner blocks
  const innerBlocks = useSelect(
    (select) => select('core/block-editor').getBlocks(clientId),
    [clientId],
  );

  const { replaceInnerBlocks, updateBlockAttributes } =
    useDispatch('core/block-editor');

  useEffect(() => {
    if (!innerBlocks) {
      return;
    }

    const newLayoutClasses = getColumns(layout);
    let updatedBlocks = [...innerBlocks];
    let needsUpdate = false;

    // Handle empty case
    if (updatedBlocks.length === 0) {
      const newBlocks = newLayoutClasses.map((colClass) =>
        createBlock('kriti-blocks/column', { colMd: colClass }),
      );
      replaceInnerBlocks(clientId, newBlocks);
      return;
    }

    if (newLayoutClasses.length > updatedBlocks.length) {
      const blocksToAdd = newLayoutClasses
        .slice(updatedBlocks.length)
        .map((colClass) =>
          createBlock('kriti-blocks/column', { colMd: colClass }),
        );

      updatedBlocks = [...updatedBlocks, ...blocksToAdd];
      needsUpdate = true;
    } else if (newLayoutClasses.length < updatedBlocks.length) {
      updatedBlocks = updatedBlocks.slice(0, newLayoutClasses.length);
      needsUpdate = true;
    }

    if (needsUpdate) {
      replaceInnerBlocks(clientId, updatedBlocks);
    }

    updatedBlocks.forEach((block, index) => {
      if (block.attributes.colMd !== newLayoutClasses[index]) {
        updateBlockAttributes(block.clientId, {
          colMd: newLayoutClasses[index],
        });
      }
    });
  }, [
    layout,
    clientId,
    innerBlocks,
    replaceInnerBlocks,
    updateBlockAttributes,
  ]);

  const TEMPLATE = getColumns(layout).map(() => ['kriti-blocks/column', {}]);

  return (
    <>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <div className="row" style={options.rowStyle}>
          {layout === 'layout-none' && (
            <div className="col-12">
              <ul>
                {LAYOUT_CHOICES.map(([value, label]) => (
                  <li key={value}>
                    <Button
                      variant="link"
                      onClick={() => setAttributes({ layout: value })}
                    >
                      {label}
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {layout !== 'layout-none' && <InnerBlocks template={TEMPLATE} />}
        </div>
      </div>
    </>
  );
}
