<?php
/**
 * Visitor voting for the Rating block.
 *
 * The block is static, so the saved markup only carries a `data-kb-vote` id.
 * This class adds the live average and the endpoint when the block is
 * rendered, and stores a running total per block in post meta.
 *
 * Voting is meant for lightweight ratings. A visitor is recognised by a token
 * kept in their browser, so a determined person can vote more than once. An
 * hourly cap per address limits abuse. Do not use it where votes need to be
 * trustworthy.
 *
 * @package Kriti_Blocks
 */

namespace Kriti_Blocks;

if ( ! defined( 'WPINC' ) ) {
	die;
}

final class Rating {

	const BLOCK     = 'kriti-blocks/rating';
	const NAMESPACE = 'kriti-blocks/v1';
	const ROUTE     = '/rating-vote';
	const HOURLY    = 20;

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_route' ) );
		add_filter( 'render_block_' . self::BLOCK, array( __CLASS__, 'render' ), 10, 2 );
	}

	public static function register_route() {
		register_rest_route(
			self::NAMESPACE,
			self::ROUTE,
			array(
				'methods'             => 'POST',
				'callback'            => array( __CLASS__, 'handle_vote' ),
				// Public on purpose: visitors vote without an account. Everything is validated below.
				'permission_callback' => '__return_true',
				'args'                => array(
					'post_id' => array(
						'required'          => true,
						'sanitize_callback' => 'absint',
					),
					'vote_id' => array(
						'required'          => true,
						'validate_callback' => array( __CLASS__, 'valid_id' ),
					),
					'token'   => array(
						'required'          => true,
						'validate_callback' => array( __CLASS__, 'valid_id' ),
					),
					'value'   => array(
						'required'          => true,
						'sanitize_callback' => 'absint',
					),
				),
			)
		);
	}

	public static function valid_id( $value ) {
		return is_string( $value ) && 1 === preg_match( '/^[a-z0-9]{6,40}$/', $value );
	}

	/**
	 * Finds the voting rating block with this id in the post content.
	 *
	 * @param array  $blocks  Parsed blocks.
	 * @param string $vote_id Vote id.
	 * @return array|null Block attributes, or null.
	 */
	private static function find_block( array $blocks, $vote_id ) {
		foreach ( $blocks as $block ) {
			if ( self::BLOCK === ( $block['blockName'] ?? '' )
				&& ! empty( $block['attrs']['allowVoting'] )
				&& ( $block['attrs']['voteId'] ?? '' ) === $vote_id
			) {
				return $block['attrs'];
			}
			if ( ! empty( $block['innerBlocks'] ) ) {
				$found = self::find_block( $block['innerBlocks'], $vote_id );
				if ( $found ) {
					return $found;
				}
			}
		}
		return null;
	}

	private static function meta_key( $vote_id ) {
		return '_kb_rating_' . $vote_id;
	}

	/**
	 * @return array{average: float, count: int}
	 */
	public static function aggregate( $post_id, $vote_id ) {
		$data  = get_post_meta( $post_id, self::meta_key( $vote_id ), true );
		$count = is_array( $data ) ? (int) ( $data['count'] ?? 0 ) : 0;
		$sum   = is_array( $data ) ? (int) ( $data['sum'] ?? 0 ) : 0;
		return array(
			'average' => $count > 0 ? round( $sum / $count, 1 ) : 0.0,
			'count'   => $count,
		);
	}

	private static function client_ip() {
		$ip = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		/**
		 * Lets sites behind a proxy supply the real visitor address.
		 */
		return (string) apply_filters( 'kriti_blocks_rating_client_ip', $ip );
	}

	public static function handle_vote( \WP_REST_Request $request ) {
		$post_id = (int) $request['post_id'];
		$vote_id = (string) $request['vote_id'];
		$token   = (string) $request['token'];
		$value   = (int) $request['value'];

		$post = get_post( $post_id );
		if ( ! $post || 'publish' !== $post->post_status || ! is_post_publicly_viewable( $post ) || post_password_required( $post ) ) {
			return new \WP_Error( 'kb_rating_post', __( 'Voting is not available here.', 'kriti-blocks' ), array( 'status' => 404 ) );
		}

		$attrs = self::find_block( parse_blocks( $post->post_content ), $vote_id );
		if ( ! $attrs ) {
			return new \WP_Error( 'kb_rating_block', __( 'Voting is not available here.', 'kriti-blocks' ), array( 'status' => 404 ) );
		}

		$max = max( 1, min( 10, (int) ( $attrs['maxRating'] ?? 5 ) ) );
		if ( $value < 1 || $value > $max ) {
			return new \WP_Error( 'kb_rating_value', __( 'Invalid rating.', 'kriti-blocks' ), array( 'status' => 400 ) );
		}

		// Hourly cap per address. Only a hash is kept, never the address itself.
		$rate_key = 'kbrv_r_' . md5( wp_salt() . self::client_ip() );
		$used     = (int) get_transient( $rate_key );
		if ( $used >= self::HOURLY ) {
			return new \WP_Error( 'kb_rating_rate', __( 'Too many votes. Try again later.', 'kriti-blocks' ), array( 'status' => 429 ) );
		}

		// One vote per browser token for each block.
		$seen_key = 'kbrv_s_' . md5( wp_salt() . $post_id . $vote_id . $token );
		if ( get_transient( $seen_key ) ) {
			$result            = self::aggregate( $post_id, $vote_id );
			$result['already'] = true;
			return new \WP_REST_Response( $result, 409 );
		}

		set_transient( $rate_key, $used + 1, HOUR_IN_SECONDS );
		set_transient( $seen_key, 1, 30 * DAY_IN_SECONDS );

		// Concurrent votes can rarely overwrite each other. That is acceptable for a lightweight rating.
		$data = get_post_meta( $post_id, self::meta_key( $vote_id ), true );
		$data = is_array( $data ) ? $data : array();
		update_post_meta(
			$post_id,
			self::meta_key( $vote_id ),
			array(
				'sum'   => (int) ( $data['sum'] ?? 0 ) + $value,
				'count' => (int) ( $data['count'] ?? 0 ) + 1,
			)
		);

		$result          = self::aggregate( $post_id, $vote_id );
		$result['value'] = $value;
		return new \WP_REST_Response( $result, 200 );
	}

	/**
	 * Adds the endpoint and the live average to a voting rating block.
	 */
	public static function render( $content, $block ) {
		// Needs WordPress 6.2 or newer. On older versions the block is shown as saved.
		if ( ! class_exists( 'WP_HTML_Tag_Processor' ) ) {
			return $content;
		}
		$attrs   = $block['attrs'] ?? array();
		$vote_id = $attrs['voteId'] ?? '';
		$post_id = (int) get_the_ID();
		if ( empty( $attrs['allowVoting'] ) || ! self::valid_id( $vote_id ) || ! $post_id ) {
			return $content;
		}

		$tags = new \WP_HTML_Tag_Processor( $content );
		if ( ! $tags->next_tag() ) {
			return $content;
		}
		$result = self::aggregate( $post_id, $vote_id );
		$tags->set_attribute( 'data-endpoint', esc_url_raw( rest_url( self::NAMESPACE . self::ROUTE ) ) );
		$tags->set_attribute( 'data-post', (string) $post_id );
		$tags->set_attribute( 'data-count', (string) $result['count'] );
		$tags->set_attribute( 'data-average', (string) $result['average'] );
		return $tags->get_updated_html();
	}
}
