/**
 * @jest-environment node
 *
 * Editor controls shared by the WooCommerce blocks: the ID <-> token helpers
 * and a render smoke test for every Woo settings panel with default attributes
 * (so a missing import or an undefined variable shows up as a failing test).
 */
import { renderToStaticMarkup } from 'react-dom/server';

jest.mock('@wordpress/components', () => {
  const React = require('react');
  const passthrough = (name) => {
    const Component = ({ children, label, title, value }) =>
      React.createElement(
        'div',
        { 'data-component': name },
        title || label || null,
        typeof value === 'string' ? value : null,
        children,
      );
    return Component;
  };

  return new Proxy(
    { __esModule: true },
    {
      get: (target, prop) => {
        if (prop in target) {
          return target[prop];
        }
        const component = passthrough(String(prop));
        // The real BaseControl also has a VisualLabel, used to label a group of controls.
        if (prop === 'BaseControl') {
          component.VisualLabel = passthrough('BaseControl.VisualLabel');
        }
        return component;
      },
    },
  );
});

jest.mock('@wordpress/data', () => ({
  useSelect: () => [],
}));

jest.mock('@wordpress/api-fetch', () => ({
  __esModule: true,
  default: () => Promise.resolve([]),
}));

import {
  idsToTokens,
  tokensToIds,
  KbWooEntityTokenField,
} from '../../../shared/kbwoo-controls';

import metaGrid from '../block.json';
import metaCarousel from '../../woo-product-carousel/block.json';
import metaPrice from '../../woo-product-price/block.json';
import metaBadge from '../../woo-sale-badge/block.json';
import metaRating from '../../woo-product-rating/block.json';
import metaCart from '../../woo-add-to-cart/block.json';
import metaCategories from '../../woo-product-categories/block.json';
import metaReviews from '../../woo-product-reviews/block.json';
import metaFilters from '../../woo-product-filters/block.json';
import metaSearch from '../../woo-product-search/block.json';
import metaMiniCart from '../../woo-mini-cart/block.json';

import GridPanel from '../../../inspectors/general/WooProductGridSettingsPanel';
import CarouselPanel from '../../../inspectors/general/WooProductCarouselSettingsPanel';
import PricePanel from '../../../inspectors/general/WooProductPriceSettingsPanel';
import BadgePanel from '../../../inspectors/general/WooSaleBadgeSettingsPanel';
import RatingPanel from '../../../inspectors/general/WooProductRatingSettingsPanel';
import CartPanel from '../../../inspectors/general/WooAddToCartSettingsPanel';
import CategoriesPanel from '../../../inspectors/general/WooProductCategoriesSettingsPanel';
import ReviewsPanel from '../../../inspectors/general/WooProductReviewsSettingsPanel';
import FiltersPanel from '../../../inspectors/general/WooProductFiltersSettingsPanel';
import SearchPanel from '../../../inspectors/general/WooProductSearchSettingsPanel';
import MiniCartPanel from '../../../inspectors/general/WooMiniCartSettingsPanel';

const records = [
  { id: 4, label: 'Shoes' },
  { id: 9, label: 'Hats' },
];

describe('token helpers', () => {
  it('maps ids to labels and drops unknown ids', () => {
    expect(idsToTokens([9, 4, 77], records)).toEqual(['Hats', 'Shoes']);
  });

  it('tolerates a non-array value', () => {
    expect(idsToTokens(undefined, records)).toEqual([]);
    expect(idsToTokens('4', records)).toEqual([]);
  });

  it('maps tokens back to unique ids and drops unknown tokens', () => {
    expect(
      tokensToIds(['Hats', 'Hats', 'Nope', { value: 'Shoes' }], records),
    ).toEqual([9, 4]);
    expect(tokensToIds(null, records)).toEqual([]);
  });

  it('renders the token field', () => {
    const html = renderToStaticMarkup(
      <KbWooEntityTokenField
        label="Tags"
        kind="taxonomy"
        name="product_tag"
        value={[]}
        onChange={() => {}}
        help="Pick some"
      />,
    );

    expect(html).toContain('Tags');
    expect(html).toContain('Pick some');
  });
});

const defaults = (meta) =>
  Object.fromEntries(
    Object.entries(meta.attributes).map(([key, def]) => [key, def.default]),
  );

describe('Woo settings panels render with default attributes', () => {
  const panels = [
    ['grid', GridPanel, metaGrid],
    ['carousel', CarouselPanel, metaCarousel],
    ['price', PricePanel, metaPrice],
    ['badge', BadgePanel, metaBadge],
    ['rating', RatingPanel, metaRating],
    ['add to cart', CartPanel, metaCart],
    ['categories', CategoriesPanel, metaCategories],
    ['reviews', ReviewsPanel, metaReviews],
    ['filters', FiltersPanel, metaFilters],
    ['search', SearchPanel, metaSearch],
    ['mini cart', MiniCartPanel, metaMiniCart],
  ];

  it.each(panels)('%s', (name, Panel, meta) => {
    const html = renderToStaticMarkup(
      <Panel attributes={defaults(meta)} setAttributes={() => {}} />,
    );

    expect(html.length).toBeGreaterThan(0);
  });

  it.each(panels)(
    '%s with booleans flipped and options chosen',
    (name, Panel, meta) => {
      const attrs = defaults(meta);

      Object.entries(meta.attributes).forEach(([key, def]) => {
        if (def.type === 'boolean') {
          attrs[key] = !def.default;
        }
      });

      Object.assign(attrs, {
        display: 'drawer',
        parentFilter: 'children',
        parentId: 4,
        position: 'top-left',
        badgeType: 'new',
        icon: 'cart',
        starIcon: 'heart',
        productId: 5,
        attributeSlugs: ['color'],
      });

      const html = renderToStaticMarkup(
        <Panel attributes={attrs} setAttributes={() => {}} />,
      );

      expect(html.length).toBeGreaterThan(0);
    },
  );

  it('every new attribute has a type and a default', () => {
    [
      metaGrid,
      metaCarousel,
      metaPrice,
      metaBadge,
      metaRating,
      metaCart,
      metaCategories,
      metaReviews,
      metaFilters,
      metaSearch,
      metaMiniCart,
    ].forEach((meta) => {
      Object.entries(meta.attributes).forEach(([key, def]) => {
        expect(`${meta.name}.${key}:${typeof def.type}`).toBe(
          `${meta.name}.${key}:string`,
        );
        expect(Object.prototype.hasOwnProperty.call(def, 'default')).toBe(true);
      });
    });
  });
});
