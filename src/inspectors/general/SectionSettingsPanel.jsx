import {
  Panel,
  PanelBody,
  PanelRow,
  SelectControl,
} from '@wordpress/components';
import { more } from '@wordpress/icons';
import { useState } from '@wordpress/element';
import { __ } from '@wordpress/i18n';

const SectionSettingsPanel = ({ attributes, setAttributes }) => {
  const {
    layout,
    container,
    background,
    backgroundColor,
    backgroundImage,
    tagType,
    paddingY,
    borderStyle,
    margin,
  } = attributes;

  const defaultBorder = {
    color: '#72aee6',
    style: 'dashed',
    width: '1px',
  };
  const [borders, setBorders] = useState({
    top: defaultBorder,
    right: defaultBorder,
    bottom: defaultBorder,
    left: defaultBorder,
  });
  const onChange = (newBorders) => setBorders(newBorders);

  const [paddingSize, setPaddingSize] = useState('');

  const [border, setBorder] = useState();
  return (
    <PanelBody title="Section Settings">
      <SelectControl
        label="Selector"
        value={tagType}
        options={[
          { label: 'Section', value: 'section' },
          { label: 'Div', value: 'div' },
          { label: 'Aside', value: 'aside' },
          { label: 'Main', value: 'main' },
          { label: 'Article', value: 'article' },
          { label: 'Header', value: 'header' },
          { label: 'Footer', value: 'footer' },
        ]}
        onChange={(value) => setAttributes({ tagType: value })}
      />

      <SelectControl
        label="Layout"
        value={layout}
        options={[
          { label: 'One Column', value: 'layout-one' },
          { label: 'Two Column', value: 'layout-two' },
          { label: 'Three Column', value: 'layout-three' },
          { label: 'Four Column', value: 'layout-four' },
          { label: 'Five Column', value: 'layout-five' },
          { label: 'Six Column', value: 'layout-six' },
          { label: '8/12 + 4/12', value: 'layout-eight-four' },
          { label: '4/12 + 8/12', value: 'layout-four-eight' },
          { label: '9/12 + 3/12', value: 'layout-nine-three' },
          { label: '3/12 + 9/12', value: 'layout-three-nine' },
          { label: '7/12 + 5/12', value: 'layout-seven-five' },
          { label: '5/12 + 7/12', value: 'layout-five-seven' },
          { label: '80/20', value: 'layout-eighty-twenty' },
          { label: '20/80', value: 'layout-twenty-eighty' },
          { label: '3/12 + 3/12 + 6/12', value: 'layout-three-three-six' },
          { label: '6/12 + 3/12 + 3/12', value: 'layout-six-three-three' },
          { label: '4/12 + 4/12 + 4/12', value: 'layout-four-four-four' },
          {
            label: '2/12 + 4/12 + 4/12 + 2/12',
            value: 'layout-two-four-four-two',
          },
          { label: 'None', value: 'layout-none' },
        ]}
        onChange={(value) => setAttributes({ layout: value })}
      />

      <SelectControl
        label="Container"
        value={container}
        options={[
          { label: 'Container', value: 'container' },
          { label: 'Fluid', value: 'container-fluid' },
          { label: 'None', value: 'none' },
        ]}
        onChange={(value) => setAttributes({ container: value })}
      />

      <SelectControl
        label="Vertical Spacing"
        value={paddingY}
        options={[
          { label: 'None', value: 'py-0' },
          { label: 'Small', value: 'py-2' },
          { label: 'Medium', value: 'py-4' },
          { label: 'Large', value: 'py-5' },
        ]}
        onChange={(value) => setAttributes({ paddingY: value })}
      />
    </PanelBody>
  );
};

export default SectionSettingsPanel;
