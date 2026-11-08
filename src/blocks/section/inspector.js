import { InspectorControls } from '@wordpress/block-editor';
import TabButton from '../../components/TabButton';
import getBWBlockName from '../../hooks/getBWBlockName';
import metadata from './block.json';
import SectionOptionsPanel from './options-panel';

export default function Inspector(props) {
  const { attributes, setAttributes } = props;

  return (
    <InspectorControls>
      <>
        <TabButton
          attributes={attributes}
          setAttributes={setAttributes}
          blockName={getBWBlockName(metadata.name)}
        />
        <SectionOptionsPanel
          attributes={attributes}
          setAttributes={setAttributes}
        />
      </>
    </InspectorControls>
  );
}
