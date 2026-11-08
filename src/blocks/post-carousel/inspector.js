import { InspectorControls } from '@wordpress/block-editor';
import TabButton from '../../components/TabButton';
import getBWBlockName from '../../hooks/getBWBlockName';
import {
  QueryFilterPanel,
  QueryCardPanel,
} from '../../shared/kbquery-controls';
import metadata from './block.json';

export default function Inspector({ attributes, setAttributes }) {
  return (
    <InspectorControls>
      <TabButton
        attributes={attributes}
        setAttributes={setAttributes}
        blockName={getBWBlockName(metadata.name)}
      />
      <QueryFilterPanel attributes={attributes} setAttributes={setAttributes} />
      <QueryCardPanel
        attributes={attributes}
        setAttributes={setAttributes}
        carousel
      />
    </InspectorControls>
  );
}
