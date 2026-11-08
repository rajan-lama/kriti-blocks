import { InspectorControls } from '@wordpress/block-editor';
import TabButton from '../../components/TabButton';
import getBWBlockName from '../../hooks/getBWBlockName';
import metadata from './block.json';

export default function Inspector({ attributes, setAttributes }) {
  return (
    <InspectorControls>
      <TabButton
        attributes={attributes}
        setAttributes={setAttributes}
        blockName={getBWBlockName(metadata.name)}
      />
    </InspectorControls>
  );
}
