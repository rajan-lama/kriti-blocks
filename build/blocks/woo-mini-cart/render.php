<?php
/**
 * Server render for the BW Mini Cart block.
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

if ( ! class_exists( 'WooCommerce' ) || ! function_exists( 'woocommerce_mini_cart' ) ) {
	return '';
}

$show_toggle     = ! isset( $attributes['showToggle'] ) || (bool) $attributes['showToggle'];
$show_count      = ! isset( $attributes['showCount'] ) || (bool) $attributes['showCount'];
$open_by_default = isset( $attributes['openByDefault'] ) && (bool) $attributes['openByDefault'];

$display = isset( $attributes['display'] ) ? sanitize_key( $attributes['display'] ) : 'inline';
$display = in_array( $display, array( 'inline', 'dropdown', 'drawer' ), true ) ? $display : 'inline';

// Without a toggle there is nothing to open, so the cart stays inline.
if ( ! $show_toggle ) {
	$display = 'inline';
}

$drawer_side = isset( $attributes['drawerSide'] ) ? sanitize_key( $attributes['drawerSide'] ) : 'right';
$drawer_side = in_array( $drawer_side, array( 'left', 'right' ), true ) ? $drawer_side : 'right';
$icon        = isset( $attributes['icon'] ) ? sanitize_key( $attributes['icon'] ) : 'none';
$icon        = in_array( $icon, array( 'none', 'cart', 'bag', 'basket' ), true ) ? $icon : 'none';
$count_style = isset( $attributes['countStyle'] ) ? sanitize_key( $attributes['countStyle'] ) : 'text';
$count_style = in_array( $count_style, array( 'text', 'badge' ), true ) ? $count_style : 'text';
$show_subtotal = ! empty( $attributes['showSubtotal'] );
$hide_view     = ! empty( $attributes['hideViewCart'] );
$hide_checkout = ! empty( $attributes['hideCheckout'] );
$empty_text    = isset( $attributes['emptyText'] ) ? sanitize_text_field( (string) $attributes['emptyText'] ) : '';
$toggle_bg     = isset( $attributes['toggleColor'] ) ? sanitize_hex_color( (string) $attributes['toggleColor'] ) : '';
$toggle_fg     = isset( $attributes['toggleTextColor'] ) ? sanitize_hex_color( (string) $attributes['toggleTextColor'] ) : '';

$cart_title  = isset( $attributes['title'] ) ? trim( (string) $attributes['title'] ) : '';
$toggle_text = isset( $attributes['toggleText'] ) ? trim( (string) $attributes['toggleText'] ) : '';

if ( '' === $toggle_text ) {
	$toggle_text = __( 'Cart', 'kriti-blocks' );
}

$cart_count    = 0;
$cart_empty    = true;
$subtotal_html = '';

if ( function_exists( 'WC' ) && WC()->cart instanceof WC_Cart ) {
	$cart_count = (int) WC()->cart->get_cart_contents_count();
	$cart_empty = WC()->cart->is_empty();

	if ( $show_subtotal && ! $cart_empty ) {
		$subtotal_html = WC()->cart->get_cart_subtotal();
	}
}

$badge_count = '';

if ( $show_count && 'badge' === $count_style ) {
	$badge_count = number_format_i18n( $cart_count );
} elseif ( $show_count ) {
	$toggle_text = sprintf(
		/* translators: 1: cart label. 2: number of items currently in the cart. */
		__( '%1$s (%2$s)', 'kriti-blocks' ),
		$toggle_text,
		number_format_i18n( $cart_count )
	);
}

$is_preview = defined( 'REST_REQUEST' ) && REST_REQUEST;

$panel_id = wp_unique_id( 'bw-woo-mini-cart-panel-' );

$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$modifiers = '';

if ( 'inline' !== $display ) {
	$modifiers .= ' bw-woo-mini-cart--' . $display;
}

if ( 'drawer' === $display ) {
	$modifiers .= ' bw-woo-mini-cart--drawer-' . $drawer_side;
}

if ( $hide_view ) {
	$modifiers .= ' bw-woo-mini-cart--hide-view-cart';
}

if ( $hide_checkout ) {
	$modifiers .= ' bw-woo-mini-cart--hide-checkout';
}

$extra_attributes = array(
	'class'               => trim( 'bw-woo-mini-cart' . $modifiers . ' ' . $extra_class ),
	'data-open-by-default' => ( $open_by_default && 'drawer' !== $display ) ? 'true' : 'false',
);

$toggle_vars = array();

if ( $toggle_bg ) {
	$toggle_vars[] = '--bw-woo-mini-cart-toggle-bg:' . $toggle_bg;
}

if ( $toggle_fg ) {
	$toggle_vars[] = '--bw-woo-mini-cart-toggle-text:' . $toggle_fg;
}

if ( ! empty( $toggle_vars ) ) {
	$extra_attributes['style'] = implode( ';', $toggle_vars ) . ';';
}

$icon_paths = array(
	'cart'   => 'M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM1 2v2h2l3.6 7.6-1.35 2.4A2 2 0 0 0 7 17h12v-2H7.42l.9-1.6h7.45a2 2 0 0 0 1.75-1.03L21 5.5 19.25 4.5l-3.48 6.5H8.1L4.3 3H1Z',
	'bag'    => 'M6 7V6a6 6 0 0 1 12 0v1h3l-1 15H4L3 7h3Zm2 0h8V6a4 4 0 0 0-8 0v1Z',
	'basket' => 'M5.5 9 9 3h2L8.2 9H15.8L13 3h2l3.5 6H22v2h-1l-1.6 9H4.6L3 11H2V9h3.5Zm-.5 2 1.3 7h11.4l1.3-7H5Z',
);

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<?php if ( '' !== $cart_title ) : ?>
		<h2 class="bw-woo-mini-cart__title"><?php echo esc_html( $cart_title ); ?></h2>
	<?php endif; ?>

	<?php if ( $show_toggle ) : ?>
		<button
			class="bw-woo-mini-cart__toggle"
			type="button"
			aria-expanded="true"
			aria-controls="<?php echo esc_attr( $panel_id ); ?>"
		>
			<?php if ( 'none' !== $icon ) : ?>
				<svg class="bw-woo-mini-cart__icon" viewBox="0 0 24 24" width="1.2em" height="1.2em" aria-hidden="true" focusable="false"><path d="<?php echo esc_attr( $icon_paths[ $icon ] ); ?>" fill="currentColor" /></svg>
			<?php endif; ?>
			<?php echo esc_html( $toggle_text ); ?>
			<?php if ( '' !== $badge_count ) : ?>
				<span class="bw-woo-mini-cart__count"><?php echo esc_html( $badge_count ); ?></span>
			<?php endif; ?>
			<?php if ( '' !== $subtotal_html ) : ?>
				<span class="bw-woo-mini-cart__subtotal"><?php echo wp_kses_post( $subtotal_html ); ?></span>
			<?php endif; ?>
		</button>
	<?php endif; ?>

	<?php if ( 'drawer' === $display ) : ?>
		<div class="bw-woo-mini-cart__overlay" hidden></div>
	<?php endif; ?>

	<div
		class="bw-woo-mini-cart__panel widget_shopping_cart_content"
		id="<?php echo esc_attr( $panel_id ); ?>"
	>
		<?php if ( 'drawer' === $display ) : ?>
			<button class="bw-woo-mini-cart__close" type="button" aria-label="<?php esc_attr_e( 'Close cart', 'kriti-blocks' ); ?>">
				<span aria-hidden="true">&times;</span>
			</button>
		<?php endif; ?>

		<?php if ( $is_preview ) : ?>
			<ul class="cart_list product_list_widget">
				<li class="bw-woo-mini-cart__sample">
					<span class="bw-woo-mini-cart__sample-name"><?php echo esc_html__( 'Sample product', 'kriti-blocks' ); ?></span>
					<span class="bw-woo-mini-cart__sample-price"><?php echo wp_kses_post( wc_price( 19.99 ) ); ?></span>
				</li>
				<li class="bw-woo-mini-cart__sample">
					<span class="bw-woo-mini-cart__sample-name"><?php echo esc_html__( 'Another sample product', 'kriti-blocks' ); ?></span>
					<span class="bw-woo-mini-cart__sample-price"><?php echo wp_kses_post( wc_price( 24.5 ) ); ?></span>
				</li>
			</ul>

			<p class="woocommerce-mini-cart__total total">
				<?php echo esc_html__( 'Subtotal:', 'kriti-blocks' ); ?>
				<strong><?php echo wp_kses_post( wc_price( 44.49 ) ); ?></strong>
			</p>

			<p class="woocommerce-mini-cart__buttons buttons">
				<a class="button wc-forward" href="<?php echo esc_url( wc_get_cart_url() ); ?>">
					<?php echo esc_html__( 'View cart', 'kriti-blocks' ); ?>
				</a>
				<a class="button checkout wc-forward" href="<?php echo esc_url( wc_get_checkout_url() ); ?>">
					<?php echo esc_html__( 'Checkout', 'kriti-blocks' ); ?>
				</a>
			</p>
		<?php elseif ( $cart_empty && '' !== $empty_text ) : ?>
			<p class="woocommerce-mini-cart__empty-message"><?php echo esc_html( $empty_text ); ?></p>
		<?php else : ?>
			<?php woocommerce_mini_cart(); ?>
		<?php endif; ?>
	</div>
</div>
<?php
return ob_get_clean();
