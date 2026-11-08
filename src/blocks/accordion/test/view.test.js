/**
 * The accordion front-end script must open and close real saved markup.
 * (It used to look for a class that the block never outputs.)
 */
const markup = (openFirst = false) => `
<div class="wp-block-kriti-blocks-accordion" data-bw-accordion-close-others="true">
  <div class="wp-block-kriti-blocks-accordion-item${openFirst ? ' is-open' : ''}" id="first">
    <h3 class="bw-accordion-title"><button type="button" class="bw-accordion-trigger" aria-expanded="${openFirst}"><span>One</span></button></h3>
    <div class="bw-accordion-panel" role="region" ${openFirst ? '' : 'hidden'}>A</div>
  </div>
  <div class="wp-block-kriti-blocks-accordion-item" id="second">
    <h3 class="bw-accordion-title"><button type="button" class="bw-accordion-trigger" aria-expanded="false"><span>Two</span></button></h3>
    <div class="bw-accordion-panel" role="region" hidden>B</div>
  </div>
</div>`;

const load = (html, hash = '') => {
  jest.resetModules();
  document.body.innerHTML = html;
  window.location.hash = hash;
  require('../view.js');
};
const state = () =>
  [...document.querySelectorAll('.bw-accordion-panel')].map((p) => !p.hidden);

test('clicking a title opens its panel and sets aria-expanded', () => {
  load(markup());
  const triggers = document.querySelectorAll('.bw-accordion-trigger');
  triggers[1].click();
  expect(state()).toEqual([false, true]);
  expect(triggers[1].getAttribute('aria-expanded')).toBe('true');
  triggers[1].click();
  expect(state()).toEqual([false, false]);
});

test('opening one item closes the others when "close others" is on', () => {
  load(markup(true));
  expect(state()).toEqual([true, false]);
  document.querySelectorAll('.bw-accordion-trigger')[1].click();
  expect(state()).toEqual([false, true]);
});

test('an item whose id is in the URL hash starts open', () => {
  load(markup(), '#second');
  expect(state()).toEqual([false, true]);
});
