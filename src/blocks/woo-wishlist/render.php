<?php
/**
 * Server render for the BW Wishlist block.
 *
 * The saved products live in the visitor's browser, so the server only prints
 * the container. The page script fills it in.
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

if ( ! class_exists( 'WooCommerce' ) ) {
	return '';
}

$title      = isset( $attributes['title'] ) ? sanitize_text_field( (string) $attributes['title'] ) : '';
$empty_text = isset( $attributes['emptyText'] ) ? sanitize_text_field( (string) $attributes['emptyText'] ) : '';
$empty_text = '' !== $empty_text ? $empty_text : __( 'Your wishlist is empty.', 'kriti-blocks' );
$columns    = isset( $attributes['columns'] ) ? min( max( absint( $attributes['columns'] ), 1 ), 4 ) : 3;
$show_cart  = ! isset( $attributes['showAddToCart'] ) || (bool) $attributes['showAddToCart'];
$extra      = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id    = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$args = array(
	'class'              => trim( 'bw-woo-wishlist ' . $extra ),
	'style'              => '--bw-woo-wishlist-columns:' . $columns . ';',
	'data-kb-wishlist'   => '1',
	'data-endpoint'      => esc_url_raw( rest_url( \Kriti_Blocks\Shop::NAMESPACE . \Kriti_Blocks\Shop::LIST_ROUTE ) ),
	'data-cart-endpoint' => $show_cart ? esc_url_raw( \WC_AJAX::get_endpoint( 'add_to_cart' ) ) : '',
	'data-cart-url'      => function_exists( 'wc_get_cart_url' ) ? esc_url_raw( wc_get_cart_url() ) : '',
	'data-i18n'          => wp_json_encode(
		array(
			'empty'      => $empty_text,
			'addToCart'  => __( 'Add to cart', 'kriti-blocks' ),
			'added'      => __( 'Added to cart.', 'kriti-blocks' ),
			'viewCart'   => __( 'View cart', 'kriti-blocks' ),
			'view'       => __( 'View product', 'kriti-blocks' ),
			'choose'     => __( 'Choose options', 'kriti-blocks' ),
			'outOfStock' => __( 'Out of stock', 'kriti-blocks' ),
			'remove'     => __( 'Remove from wishlist', 'kriti-blocks' ),
			'cartError'  => __( 'Could not add the product to the cart.', 'kriti-blocks' ),
			'error'      => __( 'Could not load your wishlist.', 'kriti-blocks' ),
		)
	),
);

// Logged-in visitors also keep their wishlist on their account.
$args = array_merge( $args, \Kriti_Blocks\Wishlist::account_attributes() );

if ( '' !== $html_id ) {
	$args['id'] = $html_id;
}

ob_start();
?>
<div <?php echo get_block_wrapper_attributes( $args ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( '' !== $title ) : ?>
		<h2 class="bw-woo-wishlist__title"><?php echo esc_html( $title ); ?></h2>
	<?php endif; ?>
	<p class="bw-woo-wishlist__empty" hidden><?php echo esc_html( $empty_text ); ?></p>
	<ul class="bw-woo-wishlist__items"></ul>
	<p class="bw-woo-wishlist__status" role="status" aria-live="polite"></p>
</div>
<?php
return ob_get_clean();
