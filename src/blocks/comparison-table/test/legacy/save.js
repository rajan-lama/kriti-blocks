import { useBlockProps } from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { getComparisonTableStyles } from '../../helpers';

const IncludedMark = () => (
  <svg
    className="bw-comparison-table__mark bw-comparison-table__mark--yes"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
  </svg>
);

const ExcludedMark = () => (
  <svg
    className="bw-comparison-table__mark bw-comparison-table__mark--no"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    focusable="false"
  >
    <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path>
  </svg>
);

export default function save({ attributes }) {
  const {
    featureColLabel,
    products,
    rows,
    highlightIndex,
    htmlId,
    extraClass,
  } = attributes;

  if (!products || products.length === 0) {
    return null;
  }

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
    style: getComparisonTableStyles(attributes),
  });

  return (
    <div {...blockProps}>
      <div className="bw-comparison-table__scroll">
        <table className="bw-comparison-table__table">
          <thead>
            <tr>
              <th className="bw-comparison-table__feature-col" scope="col">
                {featureColLabel}
              </th>
              {products.map((product, index) => (
                <th
                  key={index}
                  className={
                    index === highlightIndex ? 'is-featured' : undefined
                  }
                  scope="col"
                >
                  {index === highlightIndex && (
                    <span className="bw-comparison-table__badge">
                      {__('Most Popular', 'kriti-blocks')}
                    </span>
                  )}
                  <span className="bw-comparison-table__product-name">
                    {product.name}
                  </span>
                  {product.price && (
                    <span className="bw-comparison-table__product-price">
                      {product.price}
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          {rows.length > 0 && (
            <tbody>
              {rows.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  <th scope="row">
                    <span className="bw-comparison-table__feature-label">
                      {row.label}
                    </span>
                  </th>
                  {products.map((product, productIndex) => {
                    const included = row.included?.[productIndex] ?? false;

                    return (
                      <td
                        key={productIndex}
                        className={
                          productIndex === highlightIndex
                            ? 'is-featured'
                            : undefined
                        }
                      >
                        {included ? <IncludedMark /> : <ExcludedMark />}
                        <span className="screen-reader-text">
                          {included
                            ? __('Included', 'kriti-blocks')
                            : __('Not included', 'kriti-blocks')}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
    </div>
  );
}
