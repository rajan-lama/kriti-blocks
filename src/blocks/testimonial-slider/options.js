import { pick, safeNumber, setColorVar } from '../../shared/marketing-options';

/**
 * Testimonial slider options. Each one adds nothing to the markup at its
 * default, so sliders saved before these options existed stay valid. The
 * front end script (view.js) falls back to the old behavior when an option is
 * missing.
 */
export const TRANSITIONS = ['slide', 'fade'];
export const ARROW_STYLES = ['circle', 'square', 'plain'];
export const DOT_STYLES = ['dot', 'line'];

/**
 * Classes, CSS variables and data attributes for the slider wrapper.
 *
 * @param {Object} attributes Block attributes.
 * @return {{classes: string[], style: Object, data: Object}} Wrapper
 *         additions.
 */
export function getSliderOptions(attributes) {
  const {
    slidesPerView,
    loop,
    pauseOnHover,
    transition,
    speed,
    arrowStyle,
    dotStyle,
    accentColor,
    dotColor,
    arrowColor,
    arrowBg,
  } = attributes;
  const classes = [];
  const style = {};
  const data = {};

  const fade = pick(transition, TRANSITIONS, 'slide') === 'fade';
  if (fade) {
    classes.push('bw-ts--fade');
  }
  const perView = safeNumber(slidesPerView, 2, 3);
  if (perView !== undefined && Number.isInteger(perView) && !fade) {
    data['data-per-view'] = perView;
  }
  if (loop === false) {
    data['data-loop'] = 'false';
  }
  if (pauseOnHover === false) {
    data['data-pause'] = 'false';
  }
  const ms = safeNumber(speed, 100, 3000);
  if (ms !== undefined) {
    style['--kb-ts-speed'] = `${ms}ms`;
  }
  const arrows = pick(arrowStyle, ARROW_STYLES, 'circle');
  if (arrows !== 'circle') {
    classes.push(`bw-ts--arrows-${arrows}`);
  }
  if (pick(dotStyle, DOT_STYLES, 'dot') === 'line') {
    classes.push('bw-ts--dots-line');
  }
  setColorVar(style, '--kb-ts-accent', accentColor);
  setColorVar(style, '--kb-ts-dot', dotColor);
  setColorVar(style, '--kb-ts-arrow', arrowColor);
  setColorVar(style, '--kb-ts-arrow-bg', arrowBg);

  return { classes, style, data };
}
