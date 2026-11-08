<?php
/**
 * Server render for the BW Product Rating block.
 *
 * @package Kriti Blocks
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content.
 * @var WP_Block $block      Block instance.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'WooCommerce' ) || ! function_exists( 'wc_get_product' ) || ! post_type_exists( 'product' ) ) {
	return '';
}

$is_preview = defined( 'REST_REQUEST' ) && REST_REQUEST;

/*
 * Resolve the product from block context (product templates and query loops),
 * falling back to the current entry. The editor preview passes a `post_id`
 * hint because block context is not available over the REST request.
 */
$product_id = 0;

if ( ! empty( $block->context['postId'] ) ) {
	$product_id = absint( $block->context['postId'] );
} elseif ( isset( $_GET['post_id'] ) ) { // phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$product_id = absint( wp_unslash( $_GET['post_id'] ) );
} elseif ( get_the_ID() ) {
	$product_id = absint( get_the_ID() );
}

$show_when_empty = ! empty( $attributes['showWhenEmpty'] );
$product         = $product_id ? wc_get_product( $product_id ) : false;
$rating       = 0.0;
$review_count = 0;
$reviews_url  = '';
$is_sample    = false;

if ( $product instanceof WC_Product ) {
	$rating       = (float) $product->get_average_rating();
	$review_count = (int) $product->get_review_count();
	$reviews_url  = method_exists( $product, 'get_reviews_url' ) ? $product->get_reviews_url() : '';

	if ( $rating <= 0 && ! $show_when_empty ) {
		return '';
	}
} elseif ( $is_preview ) {
	$rating       = 4.5;
	$review_count = 12;
	$reviews_url  = '#';
	$is_sample    = true;
} else {
	return '';
}

$show_stars = ! isset( $attributes['showStars'] ) || (bool) $attributes['showStars'];
$show_count = ! isset( $attributes['showCount'] ) || (bool) $attributes['showCount'];

$link_reviews = ! isset( $attributes['linkToReviews'] ) || (bool) $attributes['linkToReviews'];
$show_number  = ! empty( $attributes['showRatingNumber'] );
$star_icon    = isset( $attributes['starIcon'] ) ? sanitize_key( $attributes['starIcon'] ) : 'default';
$star_icon    = in_array( $star_icon, array( 'default', 'star', 'heart', 'circle', 'square' ), true ) ? $star_icon : 'default';
$count_format = isset( $attributes['countFormat'] ) ? sanitize_key( $attributes['countFormat'] ) : 'text';
$count_format = in_array( $count_format, array( 'text', 'parens', 'number' ), true ) ? $count_format : 'text';
$star_color   = isset( $attributes['starColor'] ) ? sanitize_hex_color( (string) $attributes['starColor'] ) : '';
$empty_color  = isset( $attributes['emptyStarColor'] ) ? sanitize_hex_color( (string) $attributes['emptyStarColor'] ) : '';

if ( ! $show_stars && ( ! $show_count || ( $review_count < 1 && ! $show_when_empty ) ) && ! $show_number ) {
	return '';
}

$text_align  = isset( $attributes['textAlign'] ) ? sanitize_key( $attributes['textAlign'] ) : '';
$text_align  = in_array( $text_align, array( 'left', 'center', 'right' ), true ) ? $text_align : '';
$font_size   = isset( $attributes['fontSize'] ) ? absint( $attributes['fontSize'] ) : 0;
$font_size   = min( $font_size, 120 );
$text_color  = isset( $attributes['textColor'] ) ? sanitize_hex_color( (string) $attributes['textColor'] ) : '';
$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$styles = array();

if ( $star_color ) {
	$styles[] = '--bw-woo-rating-star-color:' . $star_color;
}

if ( $empty_color ) {
	$styles[] = '--bw-woo-rating-empty-color:' . $empty_color;
}

if ( $font_size > 0 ) {
	$styles[] = 'font-size:' . $font_size . 'px';
}

if ( $text_color ) {
	$styles[] = 'color:' . $text_color;
}

if ( $text_align ) {
	$styles[] = 'text-align:' . $text_align;
}

$classes = 'bw-woo-product-rating';

if ( $is_sample ) {
	$classes .= ' bw-woo-product-rating--preview';
}

if ( 'default' !== $star_icon ) {
	$classes .= ' bw-woo-product-rating--icon-' . $star_icon;
}

if ( $star_color ) {
	$classes .= ' bw-woo-product-rating--star-color';
}

if ( $empty_color ) {
	$classes .= ' bw-woo-product-rating--empty-color';
}

if ( '' !== $extra_class ) {
	$classes .= ' ' . $extra_class;
}

$icon_glyphs = array(
	'star'   => "\u{2605}",
	'heart'  => "\u{2665}",
	'circle' => "\u{25CF}",
	'square' => "\u{25A0}",
);

$extra_attributes = array(
	'class' => trim( $classes ),
);

if ( ! empty( $styles ) ) {
	$extra_attributes['style'] = implode( ';', $styles ) . ';';
}

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( $show_stars && 'default' !== $star_icon ) : ?>
		<?php
		$glyphs   = str_repeat( $icon_glyphs[ $star_icon ], 5 );
		$fill_pct = min( max( round( ( $rating / 5 ) * 100, 1 ), 0 ), 100 );
		?>
		<div class="bw-woo-product-rating__stars">
			<span
				class="bw-woo-product-rating__icons"
				role="img"
				aria-label="<?php
					/* translators: %s: average rating. */
					echo esc_attr( sprintf( __( 'Rated %s out of 5', 'kriti-blocks' ), number_format_i18n( $rating, 2 ) ) );
				?>"
			>
				<span class="bw-woo-product-rating__icons-base" aria-hidden="true"><?php echo esc_html( $glyphs ); ?></span>
				<span class="bw-woo-product-rating__icons-fill" aria-hidden="true" style="<?php echo esc_attr( 'width:' . $fill_pct . '%' ); ?>"><?php echo esc_html( $glyphs ); ?></span>
			</span>
		</div>
	<?php elseif ( $show_stars && function_exists( 'wc_get_rating_html' ) ) : ?>
		<div class="bw-woo-product-rating__stars">
			<?php echo wp_kses_post( wc_get_rating_html( $rating, $review_count ) ); ?>
		</div>
	<?php endif; ?>

	<?php if ( $show_number && $rating > 0 ) : ?>
		<span class="bw-woo-product-rating__number"><?php echo esc_html( number_format_i18n( $rating, 1 ) ); ?></span>
	<?php endif; ?>

	<?php if ( $show_count && ( $review_count > 0 || $show_when_empty ) ) : ?>
		<?php
		if ( $review_count < 1 ) {
			$count_label = __( 'No reviews yet', 'kriti-blocks' );
		} elseif ( 'parens' === $count_format ) {
			$count_label = '(' . number_format_i18n( $review_count ) . ')';
		} elseif ( 'number' === $count_format ) {
			$count_label = number_format_i18n( $review_count );
		} else {
			/* translators: %s: number of reviews. */
			$count_label = sprintf( _n( '%s review', '%s reviews', $review_count, 'kriti-blocks' ), number_format_i18n( $review_count ) );
		}

		$count_tag = ( $link_reviews && $review_count > 0 ) ? 'a' : 'span';
		?>
		<<?php echo esc_attr( $count_tag ); ?> class="bw-woo-product-rating__count"<?php echo 'a' === $count_tag ? ' href="' . esc_url( '' !== $reviews_url ? $reviews_url : '#' ) . '"' : ''; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
			<?php echo esc_html( $count_label ); ?>
		</<?php echo esc_attr( $count_tag ); ?>>
	<?php endif; ?>
</div>
<?php
return ob_get_clean();
