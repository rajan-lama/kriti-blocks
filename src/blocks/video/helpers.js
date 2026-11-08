/**
 * Build the inline styles for the video wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Style object for the figure element.
 */
export const getFigureStyles = (attributes) => {
  const { videoWidth, videoAlign } = attributes;

  const styles = {
    width: `${videoWidth || 100}%`,
  };

  if (videoAlign === 'left') {
    styles.marginRight = 'auto';
  } else if (videoAlign === 'right') {
    styles.marginLeft = 'auto';
  } else if (videoAlign === 'center') {
    styles.marginLeft = 'auto';
    styles.marginRight = 'auto';
  }

  return styles;
};

/**
 * Build the playback properties for the video element.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Props for the video element.
 */
export const getVideoProps = (attributes) => {
  const { controls, autoplay, loop, muted, preload } = attributes;

  const props = {
    controls,
    preload,
  };

  if (autoplay) {
    props.autoPlay = true;
  }

  if (loop) {
    props.loop = true;
  }

  if (muted) {
    props.muted = true;
  }

  return props;
};
