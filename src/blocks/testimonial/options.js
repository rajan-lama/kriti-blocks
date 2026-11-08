import { pick, safeUrl, setColorVar } from '../../shared/marketing-options';

/**
 * Testimonial options. Each one adds nothing to the markup at its default, so
 * testimonials saved before these options existed stay valid.
 */
export const AVATAR_POSITIONS = ['left', 'top', 'right'];
export const AVATAR_SHAPES = ['round', 'square'];

/**
 * Classes, CSS variables and extra values for the testimonial.
 *
 * @param {Object} attributes Block attributes.
 * @return {Object} Options for save() and edit().
 */
export function getTestimonialOptions(attributes) {
  const {
    rating,
    ratingColor,
    company,
    logoUrl,
    logoAlt,
    avatarPosition,
    avatarShape,
    accentColor,
  } = attributes;
  const classes = [];
  const style = {};

  const position = pick(avatarPosition, AVATAR_POSITIONS, 'left');
  if (position !== 'left') {
    classes.push(`bw-testimonial--avatar-${position}`);
  }
  if (pick(avatarShape, AVATAR_SHAPES, 'round') === 'square') {
    classes.push('bw-testimonial--avatar-square');
  }
  setColorVar(style, '--kb-tm-accent', accentColor);
  setColorVar(style, '--kb-tm-star', ratingColor);

  const stars =
    Number.isInteger(rating) && rating >= 1 && rating <= 5 ? rating : 0;
  const logo = safeUrl(logoUrl);

  return {
    classes,
    style,
    rating: stars,
    company: typeof company === 'string' ? company.trim() : '',
    logo: logo ? { url: logo, alt: String(logoAlt || '') } : null,
  };
}
