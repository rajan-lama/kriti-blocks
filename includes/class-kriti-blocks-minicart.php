<?php
/**
 * Keeps the Mini Cart block's count and subtotal current.
 *
 * WooCommerce refreshes the cart through "fragments": a list of CSS selectors and the new
 * HTML for each. Its own widget is covered, but the count and subtotal of this block are
 * not, so they stayed as they were until the page was reloaded.
 *
 * @package Kriti_Blocks
 */

namespace Kriti_Blocks;

if ( ! defined( 'WPINC' ) ) {
	die;
}

final class Mini_Cart {

	public static function init() {
		add_filter( 'woocommerce_add_to_cart_fragments', array( __CLASS__, 'fragments' ) );
	}

	/**
	 * Adds the block's count and subtotal to the fragments WooCommerce sends.
	 *
	 * @param array $fragments Selector => HTML.
	 * @return array
	 */
	public static function fragments( $fragments ) {
		if ( ! function_exists( 'WC' ) || ! WC()->cart instanceof \WC_Cart ) {
			return $fragments;
		}
		$count    = number_format_i18n( (int) WC()->cart->get_cart_contents_count() );
		$subtotal = WC()->cart->is_empty() ? '' : WC()->cart->get_cart_subtotal();

		// Badge style.
		$fragments['.bw-woo-mini-cart__count'] = '<span class="bw-woo-mini-cart__count">' . esc_html( $count ) . '</span>';
		// Text style: the number inside "Cart (3)".
		$fragments['.bw-woo-mini-cart__count-text'] = '<span class="bw-woo-mini-cart__count-text">' . esc_html( $count ) . '</span>';
		$fragments['.bw-woo-mini-cart__subtotal']   = '<span class="bw-woo-mini-cart__subtotal">' . wp_kses_post( $subtotal ) . '</span>';
		return $fragments;
	}
}
