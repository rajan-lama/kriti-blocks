import { __ } from '@wordpress/i18n';
import {
  RichText,
  useBlockProps,
  AlignmentToolbar,
  BlockControls,
} from '@wordpress/block-editor';
import { ToolbarDropdownMenu, ToolbarGroup } from '@wordpress/components';
import Inspector from './inspector';
import { safeColor, clampPos } from '../../shared/kbi-safe';

import './editor.scss';

const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];

export default function Edit({ attributes, setAttributes }) {
  const {
    header,
    message,
    textAlign,
    subtitle,
    headerBgColor,
    headerTextColor,
    headerIcon,
    iconPosition,
    headerIconColor,
    borderStyle,
    borderWidth,
    borderColor,
    borderRadius,
    marginBottom,
  } = attributes;

  const tag = HEADINGS.includes(header) ? header : 'h2';
  const bg = safeColor(headerBgColor);
  const width = clampPos(borderWidth, 1, 20);
  const radius = clampPos(borderRadius, 1, 100);
  const iconAfter = iconPosition === 'after';

  const blockProps = useBlockProps({
    className: [
      'kb-ah-editor',
      bg || width ? 'kb-ah--boxed' : '',
      headerIcon ? `kb-ah--icon-${iconAfter ? 'after' : 'before'}` : '',
    ]
      .filter(Boolean)
      .join(' '),
    style: {
      textAlign: ['left', 'center', 'right'].includes(textAlign)
        ? textAlign
        : undefined,
      marginBottom:
        typeof marginBottom === 'number' ? `${marginBottom}px` : undefined,
    },
  });

  const boxStyle = {
    color: safeColor(headerTextColor),
    backgroundColor: bg,
    borderStyle: width ? borderStyle || 'solid' : undefined,
    borderWidth: width ? `${width}px` : undefined,
    borderColor: width ? safeColor(borderColor) : undefined,
    borderRadius: radius ? `${radius}px` : undefined,
  };

  const icon = headerIcon ? (
    <span
      className={`kb-ah__icon kb-ah__icon--${headerIcon}`}
      aria-hidden="true"
      style={{ backgroundColor: safeColor(headerIconColor) }}
    />
  ) : null;

  return (
    <>
      <BlockControls key="custom-controls">
        <AlignmentToolbar
          value={textAlign}
          onChange={(value) => setAttributes({ textAlign: value })}
        />
        <ToolbarGroup>
          <ToolbarDropdownMenu
            icon={null}
            label={__('Heading level', 'kriti-blocks')}
            text={tag.toUpperCase()}
            controls={HEADINGS.map((level) => ({
              title: level.toUpperCase(),
              isActive: tag === level,
              onClick: () => setAttributes({ header: level }),
            }))}
          />
        </ToolbarGroup>
      </BlockControls>
      <Inspector attributes={attributes} setAttributes={setAttributes} />
      <div {...blockProps}>
        <div className="kb-ah-editor__title" style={boxStyle}>
          {!iconAfter && icon}
          <RichText
            tagName={tag}
            className="kb-ah-editor__text"
            placeholder={__('Add your custom content', 'kriti-blocks')}
            value={message}
            onChange={(value) => setAttributes({ message: value })}
          />
          {iconAfter && icon}
        </div>
        {subtitle && <p className="kb-ah__sub">{subtitle}</p>}
      </div>
    </>
  );
}
