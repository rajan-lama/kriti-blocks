import { InspectorControls } from '@wordpress/block-editor';
import TabButton from '../../components/TabButton';
import getBWBlockName from '../../hooks/getBWBlockName';
import { QueryCardPanel } from '../../shared/kbquery-controls';
import RelatedOptionsPanel from './RelatedOptionsPanel';
import metadata from './block.json';

export default function Inspector({ attributes, setAttributes }) {
  return (
    <InspectorControls>
      <TabButton
        attributes={attributes}
        setAttributes={setAttributes}
        blockName={getBWBlockName(metadata.name)}
      />
      <RelatedOptionsPanel
        attributes={attributes}
        setAttributes={setAttributes}
      />
      <QueryCardPanel
        attributes={attributes}
        setAttributes={setAttributes}
        showAuthor
      />
    </InspectorControls>
  );
}
