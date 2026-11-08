/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

import {
  AccordionItemSettingsPanel,
  AccordionSettingsPanel,
  AlertSettingsPanel,
  ArchiveHeaderSettingsPanel,
  AuthorBoxSettingsPanel,
  BackToTopSettingsPanel,
  CardSettingsPanel,
  ColumnsSettingsPanel,
  ComparisonTableSettingsPanel,
  CoverSettingsPanel,
  CtaSettingsPanel,
  DividerSettingsPanel,
  FaqSettingsPanel,
  FeatureSettingsPanel,
  GridSettingsPanel,
  HeadingSettingsPanel,
  HeroSettingsPanel,
  ImageSettingsPanel,
  ListSettingsPanel,
  LogoSettingsPanel,
  ModalSettingsPanel,
  OffcanvasSettingsPanel,
  PaginationSettingsPanel,
  PostCarouselSettingsPanel,
  PostGridSettingsPanel,
  PricingColumnSettingsPanel,
  QuoteSettingsPanel,
  RatingSettingsPanel,
  RelatedPostsSettingsPanel,
  RowSettingsPanel,
  SectionSettingsPanel,
  SearchSettingsPanel,
  SpacerSettingsPanel,
  StatSettingsPanel,
  StepsSettingsPanel,
  StickySectionSettingsPanel,
  TabsSettingsPanel,
  TeamMemberSettingsPanel,
  TermListSettingsPanel,
  TestimonialSettingsPanel,
  TestimonialSliderSettingsPanel,
  TextSettingsPanel,
  TimelineSettingsPanel,
  VideoSettingsPanel,
  WooAddToCartSettingsPanel,
  WooProductCarouselSettingsPanel,
  WooMiniCartSettingsPanel,
  WooProductCategoriesSettingsPanel,
  WooProductFiltersSettingsPanel,
  WooProductGridSettingsPanel,
  WooProductPriceSettingsPanel,
  WooProductRatingSettingsPanel,
  WooProductReviewsSettingsPanel,
  WooProductSearchSettingsPanel,
  WooSaleBadgeSettingsPanel,
} from '../inspectors/general';

import blockOptions from '../constants/blockOptions';

export const GeneralOptions = ({ attributes, setAttributes, blockName }) => {
  const options = blockOptions[blockName]?.general || [];

  const panels = {
    AccordionItemSettingsPanel,
    AccordionSettingsPanel,
    AlertSettingsPanel,
    ArchiveHeaderSettingsPanel,
    AuthorBoxSettingsPanel,
    BackToTopSettingsPanel,
    CardSettingsPanel,
    ColumnsSettingsPanel,
    ComparisonTableSettingsPanel,
    CoverSettingsPanel,
    CtaSettingsPanel,
    DividerSettingsPanel,
    FaqSettingsPanel,
    FeatureSettingsPanel,
    GridSettingsPanel,
    HeadingSettingsPanel,
    HeroSettingsPanel,
    ImageSettingsPanel,
    ListSettingsPanel,
    LogoSettingsPanel,
    ModalSettingsPanel,
    OffcanvasSettingsPanel,
    PaginationSettingsPanel,
    PostCarouselSettingsPanel,
    PostGridSettingsPanel,
    PricingColumnSettingsPanel,
    QuoteSettingsPanel,
    RatingSettingsPanel,
    RelatedPostsSettingsPanel,
    RowSettingsPanel,
    SectionSettingsPanel,
    SearchSettingsPanel,
    SpacerSettingsPanel,
    StatSettingsPanel,
    StepsSettingsPanel,
    StickySectionSettingsPanel,
    TabsSettingsPanel,
    TeamMemberSettingsPanel,
    TermListSettingsPanel,
    TestimonialSettingsPanel,
    TestimonialSliderSettingsPanel,
    TextSettingsPanel,
    TimelineSettingsPanel,
    VideoSettingsPanel,
    WooAddToCartSettingsPanel,
    WooProductCarouselSettingsPanel,
    WooMiniCartSettingsPanel,
    WooProductCategoriesSettingsPanel,
    WooProductFiltersSettingsPanel,
    WooProductGridSettingsPanel,
    WooProductPriceSettingsPanel,
    WooProductRatingSettingsPanel,
    WooProductReviewsSettingsPanel,
    WooProductSearchSettingsPanel,
    WooSaleBadgeSettingsPanel,
  };

  return (
    <>
      <div className="kriti-blocks-styling-section">
        {options.map((name) => {
          const Panel = panels[name];
          return Panel ? (
            <Panel
              key={name}
              attributes={attributes}
              setAttributes={setAttributes}
            />
          ) : null;
        })}
      </div>
    </>
  );
};

export default GeneralOptions;
