import { useBlockProps } from '@wordpress/block-editor';

export default function save({ attributes }) {
  const { slides } = attributes;

  const blockProps = useBlockProps.save({
    className: 'carousel slide',
  });

  return (
    <div {...blockProps}>
      <div className="carousel-inner">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? 'active' : ''}`}
          >
            <h2>{slide.title}</h2>
            <h4>{slide.subtitle}</h4>
            <p>{slide.description}</p>

            {slide.btn1Text && <a href={slide.btn1Url}>{slide.btn1Text}</a>}

            {slide.btn2Text && <a href={slide.btn2Url}>{slide.btn2Text}</a>}
          </div>
        ))}
      </div>
    </div>
  );
}
