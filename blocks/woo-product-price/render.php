<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
/**
 * Server render for the BW Product Price block.
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
	$product_id = absint( wp_unslash( $_GET['post_id'] ) ); // phpcs:ignore WordPress.Security.NonceVerification.Recommended
} elseif ( get_the_ID() ) {
	$product_id = absint( get_the_ID() );
}

$product    = $product_id ? wc_get_product( $product_id ) : false;
$price_html = '';
$is_sample  = false;

if ( $product instanceof WC_Product ) {
	$price_html = $product->get_price_html();
} elseif ( $is_preview ) {
	$price_html = '<span class="woocommerce-Price-amount amount"><bdi><span class="woocommerce-Price-currencySymbol">&#36;</span>49.00</bdi></span>';
	$is_sample  = true;
}

if ( '' === $price_html ) {
	return '';
}

$text_align  = isset( $attributes['textAlign'] ) ? sanitize_key( $attributes['textAlign'] ) : '';
$text_align  = in_array( $text_align, array( 'left', 'center', 'right' ), true ) ? $text_align : '';
$font_size   = isset( $attributes['fontSize'] ) ? absint( $attributes['fontSize'] ) : 0;
$font_size   = min( $font_size, 120 );
$price_color = isset( $attributes['priceColor'] ) ? sanitize_hex_color( (string) $attributes['priceColor'] ) : '';
$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$sale_color    = isset( $attributes['salePriceColor'] ) ? sanitize_hex_color( (string) $attributes['salePriceColor'] ) : '';
$regular_color = isset( $attributes['regularPriceColor'] ) ? sanitize_hex_color( (string) $attributes['regularPriceColor'] ) : '';
$strike_color  = isset( $attributes['strikeColor'] ) ? sanitize_hex_color( (string) $attributes['strikeColor'] ) : '';
$show_strike   = ! isset( $attributes['showStrikethrough'] ) || (bool) $attributes['showStrikethrough'];
$currency_pct  = isset( $attributes['currencyScale'] ) ? absint( $attributes['currencyScale'] ) : 0;
$currency_pct  = $currency_pct > 0 ? min( max( $currency_pct, 50 ), 150 ) : 0;
$stack_prices  = ! empty( $attributes['stackPrices'] );
$price_prefix  = isset( $attributes['pricePrefix'] ) ? sanitize_text_field( (string) $attributes['pricePrefix'] ) : '';
$price_prefix  = function_exists( 'mb_substr' ) ? mb_substr( $price_prefix, 0, 40 ) : substr( $price_prefix, 0, 40 );
$tax_suffix    = isset( $attributes['taxSuffix'] ) ? sanitize_text_field( (string) $attributes['taxSuffix'] ) : '';
$tax_suffix    = function_exists( 'mb_substr' ) ? mb_substr( $tax_suffix, 0, 60 ) : substr( $tax_suffix, 0, 60 );

$styles = array();

if ( $sale_color ) {
	$styles[] = '--bw-woo-price-sale-color:' . $sale_color;
}

if ( $regular_color ) {
	$styles[] = '--bw-woo-price-regular-color:' . $regular_color;
}

if ( $strike_color ) {
	$styles[] = '--bw-woo-price-strike-color:' . $strike_color;
}

if ( $currency_pct > 0 ) {
	$styles[] = '--bw-woo-price-currency-scale:' . ( $currency_pct / 100 );
}

if ( $font_size > 0 ) {
	$styles[] = 'font-size:' . $font_size . 'px';
}

if ( $price_color ) {
	$styles[] = 'color:' . $price_color;
}

if ( $text_align ) {
	$styles[] = 'text-align:' . $text_align;
}

$classes = 'bw-woo-product-price';

if ( $is_sample ) {
	$classes .= ' bw-woo-product-price--preview';
}

if ( $stack_prices ) {
	$classes .= ' bw-woo-product-price--stacked';
}

if ( ! $show_strike ) {
	$classes .= ' bw-woo-product-price--no-strike';
}

if ( $currency_pct > 0 ) {
	$classes .= ' bw-woo-product-price--currency-scaled';
}

if ( '' !== $extra_class ) {
	$classes .= ' ' . $extra_class;
}

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
	<div class="bw-woo-product-price__value">
		<?php if ( '' !== $price_prefix ) : ?>
			<span class="bw-woo-product-price__prefix"><?php echo esc_html( $price_prefix ); ?></span>
		<?php endif; ?>
		<?php echo wp_kses_post( $price_html ); ?>
		<?php if ( '' !== $tax_suffix ) : ?>
			<small class="bw-woo-product-price__suffix"><?php echo esc_html( $tax_suffix ); ?></small>
		<?php endif; ?>
	</div>
</div>
<?php
return ob_get_clean();
