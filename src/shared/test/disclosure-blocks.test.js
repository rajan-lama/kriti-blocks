/**
 * @jest-environment node
 *
 * Accordion, FAQ and Tabs gained options. With the options left at their
 * defaults the saved HTML must be identical to what the original blocks
 * produced, otherwise existing posts would show "invalid block" errors.
 * The original save functions are kept in ./legacy (copied unchanged from the
 * first version of each block).
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/block-editor', () => {
  const React = require('react');
  return {
    useBlockProps: {
      save: (p = {}) => ({ className: 'wp-block', ...p }),
    },
    RichText: {
      Content: ({ tagName: Tag = 'span', className, value }) =>
        React.createElement(Tag, { className }, value),
    },
    InnerBlocks: {
      Content: () => React.createElement('span', { 'data-inner': '1' }),
    },
  };
});

import accordionNew from '../../blocks/accordion/save';
import itemNew from '../../blocks/accordion-item/save';
import faqNew from '../../blocks/faq/save';
import tabsNew from '../../blocks/tabs/save';
import { getDisclosureProps } from '../disclosure';
import { getTabsProps, startIndex } from '../../blocks/tabs/options';

import accordionOld from './legacy/accordion.save';
import itemOld from './legacy/accordion-item.save';
import faqOld from './legacy/faq.save';
import tabsOld from './legacy/tabs.save';

const html = (fn, attributes) => renderToStaticMarkup(fn({ attributes }));

const faqItems = [
  { question: 'Q1', answer: 'A1' },
  { question: 'Q2', answer: 'A2' },
];
const tabItems = [
  { label: 'One', content: 'First' },
  { label: 'Two', content: 'Second' },
  { label: 'Three', content: 'Third' },
];

describe('default options keep the original markup', () => {
  test('accordion', () => {
    const a = { closeOthers: true, htmlId: '', extraClass: '' };
    expect(html(accordionNew, a)).toBe(html(accordionOld, a));
    const b = { closeOthers: false, htmlId: 'x', extraClass: 'mine' };
    expect(html(accordionNew, b)).toBe(html(accordionOld, b));
  });

  test('accordion item (open and closed)', () => {
    [true, false].forEach((itemOpen) => {
      const a = {
        itemTitle: 'Title',
        itemOpen,
        titleTag: 'h3',
        htmlId: '',
        extraClass: '',
      };
      const legacy = {
        itemTitle: 'Title',
        itemOpen,
        htmlId: '',
        extraClass: '',
      };
      expect(html(itemNew, a)).toBe(html(itemOld, legacy));
      // Content saved before titleTag existed has no value at all.
      expect(html(itemNew, legacy)).toBe(html(itemOld, legacy));
    });
  });

  test('faq', () => {
    [true, false].forEach((firstOpen) => {
      const a = { faqItems, firstOpen, htmlId: '', extraClass: '' };
      expect(html(faqNew, a)).toBe(html(faqOld, a));
    });
  });

  test('tabs', () => {
    const a = { tabItems, htmlId: '', extraClass: '' };
    expect(html(tabsNew, a)).toBe(html(tabsOld, a));
    expect(
      html(tabsNew, {
        ...a,
        defaultTab: 0,
        tabsStyle: 'underline',
        orientation: 'horizontal',
        tabAlign: 'left',
      }),
    ).toBe(html(tabsOld, a));
  });
});

describe('new options reach the markup', () => {
  test('accordion icon, position, colors and spacing', () => {
    const out = html(accordionNew, {
      closeOthers: true,
      iconStyle: 'plus',
      iconPosition: 'left',
      itemGap: 8,
      titleColor: '#112233',
    });
    expect(out).toContain('kb-d--icon-plus');
    expect(out).toContain('kb-d--icon-left');
    expect(out).toContain('--kb-d-gap:8px');
    expect(out).toContain('--kb-d-title:#112233');
  });

  test('invalid icon style is ignored', () => {
    const { classes } = getDisclosureProps({ iconStyle: '"><script>' });
    expect(classes).toEqual([]);
  });

  test('accordion item title tag, with an invalid tag falling back to h3', () => {
    expect(html(itemNew, { itemTitle: 'T', titleTag: 'h2' })).toContain(
      '<h2 class="bw-accordion-title">',
    );
    expect(html(itemNew, { itemTitle: 'T', titleTag: 'script' })).toContain(
      '<h3 class="bw-accordion-title">',
    );
  });

  test('faq exclusive mode adds a shared name only when enabled', () => {
    const base = { faqItems, htmlId: '', extraClass: '' };
    expect(
      html(faqNew, { ...base, openOne: true, groupName: 'kb-faq-abc' }),
    ).toContain('name="kb-faq-abc"');
    expect(
      html(faqNew, { ...base, openOne: false, groupName: 'kb-faq-abc' }),
    ).not.toContain('name=');
  });

  test('tabs style, orientation, alignment and default tab', () => {
    const out = html(tabsNew, {
      tabItems,
      tabsStyle: 'pills',
      orientation: 'vertical',
      tabAlign: 'center',
      defaultTab: 2,
      activeColor: '#ff0000',
    });
    expect(out).toContain('kb-tabs--pills');
    expect(out).toContain('kb-tabs--vertical');
    expect(out).toContain('kb-tabs--align-center');
    expect(out).toContain('--kb-t-active:#ff0000');
    // Only the third panel is visible and the third tab is active.
    expect((out.match(/hidden=""/g) || []).length).toBe(2);
    expect(out).toMatch(/bw-tabs-tab is-active"[^>]*data-tab-index="2"/);
  });

  test('tabs default index is kept inside the list', () => {
    expect(startIndex(9, 3)).toBe(0);
    expect(startIndex(-1, 3)).toBe(0);
    expect(startIndex(1, 3)).toBe(1);
    expect(getTabsProps({ tabsStyle: 'evil', tabAlign: 'x' }).classes).toEqual(
      [],
    );
  });
});
