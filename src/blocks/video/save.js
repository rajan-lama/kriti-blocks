import { useBlockProps, RichText } from '@wordpress/block-editor';
import { getFigureStyles } from './helpers';
import { getEmbed } from './options';
import { joinClasses } from '../../shared/kbsb-options';
import VideoElement from './video-element';

import './style.scss';

export default function save({ attributes }) {
  const { url, caption, htmlId, extraClass } = attributes;

  if (!url && !getEmbed(attributes)) {
    return null;
  }

  const blockProps = useBlockProps.save({
    id: htmlId || undefined,
    className: joinClasses(
      extraClass,
      attributes.backgroundMode === true && 'bw-video--bg',
    ),
    style: getFigureStyles(attributes),
  });

  return (
    <figure {...blockProps}>
      <VideoElement attributes={attributes} />
      {caption && <RichText.Content tagName="figcaption" value={caption} />}
    </figure>
  );
}
