import { useBlockProps } from '@wordpress/block-editor';
import { getDividerStyles } from '../../helpers';

// (style import removed for tests)

export default function save({ attributes }) {
  const { htmlId, extraClass } = attributes;

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: extraClass || undefined,
  });

  return (
    <div {...blockProps}>
      <hr className="bw-divider" style={getDividerStyles(attributes)} />
    </div>
  );
}
