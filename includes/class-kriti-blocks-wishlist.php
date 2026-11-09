<?php
/**
 * Saves a logged-in visitor's wishlist on their account.
 *
 * The wishlist starts in the visitor's browser (see src/shared/kbwishlist.js). For someone who
 * is logged in, the page script also keeps the list in user meta, so it follows them to other
 * devices. Guests are not affected: they keep using the browser only.
 *
 * Only product IDs are stored. The routes need a logged-in user and WordPress's REST nonce,
 * so another site or script cannot read or change someone's list.
 *
 * @package Kriti_Blocks
 */

namespace Kriti_Blocks;

if ( ! defined( 'WPINC' ) ) {
	die;
}

final class Wishlist {

	const META      = 'kb_wishlist';
	const NAMESPACE = 'kriti-blocks/v1';
	const ROUTE     = '/wishlist';
	const MAX       = 100;

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_routes' ) );
		add_filter( 'wp_privacy_personal_data_exporters', array( __CLASS__, 'register_exporter' ) );
		add_filter( 'wp_privacy_personal_data_erasers', array( __CLASS__, 'register_eraser' ) );
	}

	public static function register_routes() {
		register_rest_route(
			self::NAMESPACE,
			self::ROUTE,
			array(
				array(
					'methods'             => 'GET',
					'callback'            => array( __CLASS__, 'handle_get' ),
					'permission_callback' => array( __CLASS__, 'can_use' ),
				),
				array(
					'methods'             => 'POST',
					'callback'            => array( __CLASS__, 'handle_save' ),
					'permission_callback' => array( __CLASS__, 'can_use' ),
					'args'                => array(
						'ids' => array(
							'required'          => true,
							'validate_callback' => static function ( $value ) {
								return is_array( $value ) && count( $value ) <= 500;
							},
						),
					),
				),
			)
		);
	}

	/**
	 * Only a logged-in user, using the REST nonce, may read or change their own list.
	 */
	public static function can_use() {
		return is_user_logged_in();
	}

	/**
	 * Data attributes for a block that shows the wishlist, so the page script can sync it.
	 * Empty for guests.
	 *
	 * @return array<string,string>
	 */
	public static function account_attributes() {
		if ( ! is_user_logged_in() ) {
			return array();
		}
		return array(
			'data-account-endpoint' => esc_url_raw( rest_url( self::NAMESPACE . self::ROUTE ) ),
			'data-account-nonce'    => wp_create_nonce( 'wp_rest' ),
		);
	}

	/**
	 * Keeps only whole, positive, unique IDs of published products, at most MAX.
	 *
	 * @param mixed $ids Raw list.
	 * @return int[]
	 */
	public static function clean( $ids ) {
		if ( ! is_array( $ids ) ) {
			return array();
		}
		$wanted = array();
		foreach ( $ids as $id ) {
			if ( is_scalar( $id ) && (int) $id > 0 && ! isset( $wanted[ (int) $id ] ) ) {
				$wanted[ (int) $id ] = true;
			}
			if ( count( $wanted ) >= self::MAX * 2 ) {
				break;
			}
		}
		if ( empty( $wanted ) ) {
			return array();
		}
		$wanted = array_keys( $wanted );
		// One query: which of these really are published products.
		$found = get_posts(
			array(
				'post_type'        => 'product',
				'post_status'      => 'publish',
				'post__in'         => $wanted,
				'posts_per_page'   => count( $wanted ),
				'orderby'          => 'post__in',
				'fields'           => 'ids',
				'no_found_rows'    => true,
				'suppress_filters' => false,
			)
		);
		return array_slice( array_map( 'intval', $found ), 0, self::MAX );
	}

	/**
	 * The saved list for a user, in the order it was saved.
	 *
	 * @param int $user_id User ID.
	 * @return int[]
	 */
	public static function get_ids( $user_id ) {
		$stored = get_user_meta( $user_id, self::META, true );
		return self::clean( is_array( $stored ) ? $stored : array() );
	}

	public static function handle_get() {
		$user_id = get_current_user_id();
		return new \WP_REST_Response(
			array(
				'user' => $user_id,
				'ids'  => self::get_ids( $user_id ),
			),
			200
		);
	}

	public static function handle_save( \WP_REST_Request $request ) {
		$user_id = get_current_user_id();
		$ids     = self::clean( $request['ids'] );
		if ( empty( $ids ) ) {
			delete_user_meta( $user_id, self::META );
		} else {
			update_user_meta( $user_id, self::META, $ids );
		}
		return new \WP_REST_Response(
			array(
				'user' => $user_id,
				'ids'  => $ids,
			),
			200
		);
	}

	/*
	------------------------------------------------------------------
	 * Privacy: WordPress's personal data export and erase tools.
	 * ---------------------------------------------------------------- */

	public static function register_exporter( $exporters ) {
		$exporters['kriti-blocks-wishlist'] = array(
			'exporter_friendly_name' => __( 'Kriti Blocks wishlist', 'kriti-blocks' ),
			'callback'               => array( __CLASS__, 'export' ),
		);
		return $exporters;
	}

	public static function register_eraser( $erasers ) {
		$erasers['kriti-blocks-wishlist'] = array(
			'eraser_friendly_name' => __( 'Kriti Blocks wishlist', 'kriti-blocks' ),
			'callback'             => array( __CLASS__, 'erase' ),
		);
		return $erasers;
	}

	public static function export( $email ) {
		$user = get_user_by( 'email', $email );
		$data = array();
		if ( $user ) {
			$titles = array();
			foreach ( self::get_ids( $user->ID ) as $id ) {
				$titles[] = get_the_title( $id );
			}
			if ( $titles ) {
				$data[] = array(
					'group_id'          => 'kriti-blocks-wishlist',
					'group_label'       => __( 'Wishlist', 'kriti-blocks' ),
					'group_description' => __( 'Products saved to the wishlist.', 'kriti-blocks' ),
					'item_id'           => 'kriti-blocks-wishlist-' . $user->ID,
					'data'              => array(
						array(
							'name'  => __( 'Products', 'kriti-blocks' ),
							'value' => implode( ', ', $titles ),
						),
					),
				);
			}
		}
		return array(
			'data' => $data,
			'done' => true,
		);
	}

	public static function erase( $email ) {
		$user    = get_user_by( 'email', $email );
		$removed = false;
		if ( $user && metadata_exists( 'user', $user->ID, self::META ) ) {
			delete_user_meta( $user->ID, self::META );
			$removed = true;
		}
		return array(
			'items_removed'  => $removed,
			'items_retained' => false,
			'messages'       => array(),
			'done'           => true,
		);
	}
}
