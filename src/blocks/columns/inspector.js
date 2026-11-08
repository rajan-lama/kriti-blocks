/**
 * Internal block libraries
 */
import { useState } from 'react';
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import {
  PanelBody,
  SelectControl,
  BorderBoxControl,
} from '@wordpress/components';
import ColumnsSettingsPanel from '../../inspectors/general/ColumnsSettingsPanel';
import ColumnsOptionsPanel from './options-panel';

/**
 * Create an Inspector Controls wrapper Component
 */

const Inspector = ({ attributes, setAttributes }) => {
  return (
    <InspectorControls>
      <ColumnsSettingsPanel
        attributes={attributes}
        setAttributes={setAttributes}
      />
      <ColumnsOptionsPanel
        attributes={attributes}
        setAttributes={setAttributes}
      />
    </InspectorControls>
  );
};
export default Inspector;
