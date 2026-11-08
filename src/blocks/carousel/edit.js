import { trash, table, dragHandle } from '@wordpress/icons';
import ServerSideRender from '@wordpress/server-side-render';
import {
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
  useBlockProps,
} from '@wordpress/block-editor';
import {
  Button,
  PanelBody,
  TextControl,
  ColorPalette,
  RangeControl,
} from '@wordpress/components';
// import Repeater from '../../components/Repeater';
// import MyDraggable from '../../components/MyDraggable';
import Inspector from './inspector';
import './editor.scss';
import BlockController from './BlockController';

export default function Edit({ attributes, setAttributes }) {
  const { slides, preview, activeIndex } = attributes;

  const setSlides = (newSlides) => {
    setAttributes({ slides: newSlides });
  };

  const setActive = (index) => {
    setAttributes({ activeIndex: index });
  };

  const togglePreview = () => {
    setAttributes({ preview: !preview });
  };

  const blockProps = useBlockProps();

  // Preview Mode
  if (preview) {
    return (
      <div {...blockProps}>
        <Inspector attributes={attributes} setAttributes={setAttributes} />
        <BlockController
          attributes={attributes}
          setAttributes={setAttributes}
        />
        <ServerSideRender
          block="kriti-blocks/carousel"
          attributes={attributes}
        />
      </div>
    );
  }

  // 🧾 Table / Repeater Mode
  return (
    <div {...blockProps}>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <BlockController attributes={attributes} setAttributes={setAttributes} />
      <table className="slider-table">
        <thead>
          <tr>
            <td width="40"></td>
            <td width="80">Slide Id</td>
            <td>Slide Title</td>
            <td width="40"></td>
          </tr>
        </thead>
        <tbody>
          {slides.map((slide, index) => (
            <tr
              key={index}
              onClick={() => setActive(index)}
              style={{
                cursor: 'pointer',
                background: index === activeIndex ? '#e7f3ff' : 'white',
              }}
            >
              <td>
                <Button icon={dragHandle} onClick={togglePreview}></Button>{' '}
              </td>
              <td align="center">{index + 1}</td>
              <td>{slide.title || 'No title'}</td>
              <td>
                <Button
                  icon={trash}
                  onClick={() => {
                    const newSlides = slides.filter((_, i) => i !== index);
                    setSlides(newSlides);
                    if (activeIndex === index) {
                      setActive(0);
                    } else if (activeIndex > index) {
                      setActive(activeIndex - 1);
                    }
                  }}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Button
        variant="primary"
        onClick={() => {
          const newSlides = [
            ...slides,
            {
              title: '',
              subtitle: '',
              description: '',
              image: '',
              btn1Text: '',
              btn1Url: '',
              btn2Text: '',
              btn2Url: '',
            },
          ];
          setSlides(newSlides);
          setActive(newSlides.length - 1);
        }}
        style={{ marginTop: '10px' }}
      >
        Add Slide
      </Button>

      {/* <Repeater
				items={slides}
				setItems={setSlides}
				fields={fields}
				label="Add Slide"
			/> */}
      {/* <MyDraggable /> */}
    </div>
  );
}
