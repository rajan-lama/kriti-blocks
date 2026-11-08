/**
 * Helpers for Jest tests of the query / interactive block option panels.
 * Not imported by any block code.
 */

/**
 * Walks a React element tree (elements are plain objects, nothing is rendered)
 * and collects every element, expanding function components and fragments.
 *
 * @param {*}        node    React node.
 * @param {Object[]} found   Accumulator.
 * @return {Object[]} All elements, including expanded components.
 */
export function collect(node, found = []) {
  if (Array.isArray(node)) {
    node.forEach((child) => collect(child, found));
    return found;
  }

  if (!node || typeof node !== 'object' || !node.type) {
    return found;
  }

  found.push(node);

  if (typeof node.type === 'function' && !node.type.__mock) {
    collect(node.type(node.props), found);
  }

  collect(node.props && node.props.children, found);

  return found;
}

/**
 * Finds the element whose label or title prop equals the given text.
 *
 * @param {*}      tree  Element tree.
 * @param {string} label Label text.
 * @return {Object|undefined} Element.
 */
export function byLabel(tree, label) {
  return collect(tree).find(
    (el) => el.props && (el.props.label === label || el.props.title === label),
  );
}

/**
 * Lists every label / title in the tree.
 *
 * @param {*} tree Element tree.
 * @return {string[]} Labels.
 */
export function labels(tree) {
  return collect(tree)
    .map((el) => el.props && (el.props.label || el.props.title))
    .filter(Boolean);
}
