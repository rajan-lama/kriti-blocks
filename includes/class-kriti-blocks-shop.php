<?php
/**
 * AJAX shop features for the Product Grid block: "Load more" and a filter bar.
 *
 * A visitor can only narrow what the block already shows. The endpoint finds
 * the grid block in the post content by its id, keeps the block's own settings
 * (categories, price range, per page and so on), and adds the visitor's choices
 * on top after checking each one. The block template does the rendering, so
 * the markup is identical to the first page load.
 *
 * @package Kriti_Blocks
 */

namespace Kriti_Blocks;

if ( ! defined( 'WPINC' ) ) {
	die;
}

final class Shop {

	const BLOCK     = 'kriti-blocks/woo-product-grid';
	const NAMESPACE = 'kriti-blocks/v1';
	const ROUTE     = '/products';
	const CONTROLS  = array( 'search', 'sort', 'category', 'stock', 'price' );
	const ORDERBY   = array( 'date', 'price', 'price-desc', 'popularity', 'rating', 'title' );
	const PER_10MIN = 600;

	const CARD_ROUTE = '/product-card';
	const LIST_ROUTE = '/product-list';
	const CARD_10MIN = 600;
	const LIST_MAX   = 24;
	const VARIATIONS = 60;
	const GROUPED_MAX = 20;

	const SEARCH_ROUTE = '/product-search';
	const SEARCH_LIMIT = 6;
	const SEARCH_10MIN = 900;

	/**
	 * Set only while the endpoint renders the block.
	 *
	 * @var array|null
	 */
	private static $override = null;

	public static function init() {
		add_action( 'rest_api_init', array( __CLASS__, 'register_route' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_search_route' ) );
		add_action( 'rest_api_init', array( __CLASS__, 'register_card_routes' ) );
	}

	/*
	------------------------------------------------------------------
	 * Quick view and wishlist data
	 * ---------------------------------------------------------------- */

	public static function register_card_routes() {
		register_rest_route(
			self::NAMESPACE,
			self::CARD_ROUTE,
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'handle_card' ),
				// Public on purpose: it returns only catalog data the shop already shows.
				'permission_callback' => '__return_true',
				'args'                => array(
					'id' => array(
						'required'          => true,
						'sanitize_callback' => 'absint',
					),
				),
			)
		);
		register_rest_route(
			self::NAMESPACE,
			self::LIST_ROUTE,
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'handle_list' ),
				'permission_callback' => '__return_true',
				'args'                => array(
					'ids' => array(
						'required'          => true,
						'sanitize_callback' => static function ( $value ) {
							return is_string( $value ) ? mb_substr( $value, 0, 400 ) : '';
						},
					),
				),
			)
		);
	}

	/**
	 * The product, only when the shop would show it to any visitor.
	 *
	 * @param int $id Product ID.
	 * @return \WC_Product|null
	 */
	private static function public_product( $id ) {
		$product = $id > 0 ? wc_get_product( $id ) : false;
		if ( ! $product instanceof \WC_Product
			|| 'publish' !== $product->get_status()
			|| 'hidden' === $product->get_catalog_visibility()
			|| post_password_required( $product->get_id() )
		) {
			return null;
		}
		return $product;
	}

	/**
	 * Price HTML as one line of text. WooCommerce adds hidden screen-reader
	 * text ("Price range: ...") that would otherwise be glued on, and sale
	 * prices need a space between the old and the new price.
	 */
	private static function price_text( $html ) {
		$html = preg_replace( '#<span[^>]*screen-reader-text[^>]*>.*?</span>#s', '', (string) $html );
		$html = str_replace( array( '</del>', '</ins>' ), array( '</del> ', '</ins> ' ), (string) $html );
		return preg_replace( '/\s+/', ' ', self::plain( $html ) );
	}

	/**
	 * The most of a product that can be bought at once, or null when there is no limit
	 * (stock not managed, or backorders allowed). Capped at 99, the dialog's own cap.
	 */
	private static function max_quantity( \WC_Product $product ) {
		$max = $product->get_max_purchase_quantity();
		return ( is_numeric( $max ) && $max > 0 && $max < 99 ) ? (int) $max : null;
	}

	private static function plain( $html ) {
		return trim( wp_strip_all_tags( html_entity_decode( (string) $html, ENT_QUOTES, 'UTF-8' ) ) );
	}

	private static function image_url( $attachment_id, $size ) {
		$url = $attachment_id ? wp_get_attachment_image_url( (int) $attachment_id, $size ) : '';
		return $url ? esc_url_raw( $url ) : '';
	}

	/**
	 * Plain data for a product card. No HTML, so the page script can build the
	 * card with text nodes.
	 *
	 * @param \WC_Product $product Product.
	 * @param bool        $detail  Include pictures, summary and variations.
	 * @return array
	 */
	private static function card_data( \WC_Product $product, $detail ) {
		$in_stock = $product->is_in_stock();
		$buyable  = $product->is_purchasable() && $in_stock;
		$mode     = 'view';
		if ( $buyable && $product->is_type( 'simple' ) ) {
			$mode = 'ajax';
		} elseif ( $buyable && $product->is_type( 'variable' ) ) {
			$mode = 'variation';
		} elseif ( $in_stock && $product->is_type( 'grouped' ) ) {
			// A grouped product is not purchasable itself, only its items are. They are checked below.
			$mode = 'grouped';
		}

		$data = array(
			'id'       => $product->get_id(),
			'title'    => self::plain( $product->get_name() ),
			'url'      => esc_url_raw( $product->get_permalink() ),
			'price'    => self::price_text( $product->get_price_html() ),
			'image'    => self::image_url( $product->get_image_id(), 'woocommerce_thumbnail' ),
			'in_stock' => (bool) $in_stock,
			'mode'     => $mode,
		);
		if ( 'ajax' === $mode ) {
			// The most that can be bought, when stock is managed. Null means no limit.
			$data['max'] = self::max_quantity( $product );
		}
		if ( ! $detail ) {
			return $data;
		}

		$images = array();
		$ids    = array_merge( array( $product->get_image_id() ), $product->get_gallery_image_ids() );
		foreach ( array_slice( array_filter( $ids ), 0, 4 ) as $attachment_id ) {
			$url = self::image_url( $attachment_id, 'large' );
			if ( '' !== $url ) {
				$images[] = $url;
			}
		}
		$summary         = self::plain( $product->get_short_description() );
		$data['images']  = $images;
		$data['summary'] = mb_strlen( $summary ) > 400 ? mb_substr( $summary, 0, 397 ) . '...' : $summary;

		if ( 'variation' === $mode ) {
			$variations = $product->get_available_variations();
			if ( count( $variations ) > self::VARIATIONS ) {
				// Too many to offer here: send the visitor to the product page.
				$data['mode'] = 'view';
				return $data;
			}
			$attributes = array();
			foreach ( $product->get_variation_attributes() as $name => $options ) {
				$key     = 'attribute_' . sanitize_title( $name );
				$choices = array();
				foreach ( (array) $options as $option ) {
					$label = (string) $option;
					if ( taxonomy_exists( $name ) ) {
						$term = get_term_by( 'slug', $option, $name );
						if ( $term && ! is_wp_error( $term ) ) {
							$label = $term->name;
						}
					}
					$choices[] = array(
						'value' => (string) $option,
						'label' => self::plain( $label ),
					);
				}
				$attributes[] = array(
					'key'     => $key,
					'label'   => self::plain( wc_attribute_label( $name, $product ) ),
					'options' => $choices,
				);
			}
			$data['attributes'] = $attributes;
			$data['variations'] = array_map(
				static function ( $variation ) {
					$map = array();
					foreach ( (array) ( $variation['attributes'] ?? array() ) as $attr_key => $attr_value ) {
						$map[ sanitize_key( $attr_key ) ] = (string) $attr_value;
					}
					return array(
						'id'         => (int) $variation['variation_id'],
						'attributes' => $map,
						'price'      => self::price_text( $variation['price_html'] ?? '' ),
						'in_stock'   => ! empty( $variation['is_in_stock'] ),
						'max'        => ( isset( $variation['max_qty'] ) && is_numeric( $variation['max_qty'] ) && (int) $variation['max_qty'] > 0 ) ? min( (int) $variation['max_qty'], 99 ) : null,
						'image'      => ! empty( $variation['image']['src'] ) ? esc_url_raw( $variation['image']['src'] ) : '',
					);
				},
				$variations
			);
		}

		if ( 'grouped' === $mode ) {
			$children = array();
			foreach ( array_slice( $product->get_children(), 0, self::GROUPED_MAX ) as $child_id ) {
				$child = wc_get_product( $child_id );
				// A grouped product's items are often hidden from the shop on their own, so
				// catalog visibility is not checked here. Unpublished and locked ones are skipped.
				if ( ! $child instanceof \WC_Product || 'publish' !== $child->get_status() || post_password_required( $child->get_id() ) ) {
					continue;
				}
				$can        = $child->is_type( 'simple' ) && $child->is_purchasable() && $child->is_in_stock();
				$children[] = array(
					'id'       => $child->get_id(),
					'title'    => self::plain( $child->get_name() ),
					'price'    => self::price_text( $child->get_price_html() ),
					'in_stock' => (bool) $child->is_in_stock(),
					'buyable'  => $can,
					'max'      => $can ? self::max_quantity( $child ) : null,
				);
			}
			$data['children'] = $children;
			if ( empty( array_filter( wp_list_pluck( $children, 'buyable' ) ) ) ) {
				// Nothing in the group can be bought here: send the visitor to the product page.
				$data['mode'] = 'view';
			}
		}
		return $data;
	}

	public static function handle_card( \WP_REST_Request $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return new \WP_Error( 'kb_card_unavailable', __( 'Not available.', 'kriti-blocks' ), array( 'status' => 404 ) );
		}
		if ( self::limited( 'kbshop_c_', self::CARD_10MIN ) ) {
			return new \WP_Error( 'kb_card_rate', __( 'Too many requests. Try again shortly.', 'kriti-blocks' ), array( 'status' => 429 ) );
		}
		$product = self::public_product( (int) $request['id'] );
		if ( ! $product ) {
			return new \WP_Error( 'kb_card_missing', __( 'Product not found.', 'kriti-blocks' ), array( 'status' => 404 ) );
		}
		return new \WP_REST_Response( self::card_data( $product, true ), 200 );
	}

	public static function handle_list( \WP_REST_Request $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return new \WP_Error( 'kb_card_unavailable', __( 'Not available.', 'kriti-blocks' ), array( 'status' => 404 ) );
		}
		if ( self::limited( 'kbshop_c_', self::CARD_10MIN ) ) {
			return new \WP_Error( 'kb_card_rate', __( 'Too many requests. Try again shortly.', 'kriti-blocks' ), array( 'status' => 429 ) );
		}
		$ids   = array_slice(
			array_values( array_unique( array_filter( array_map( 'absint', preg_split( '/[\s,]+/', (string) $request['ids'], -1, PREG_SPLIT_NO_EMPTY ) ) ) ) ),
			0,
			self::LIST_MAX
		);
		$items = array();
		foreach ( $ids as $id ) {
			$product = self::public_product( $id );
			if ( $product ) {
				$items[] = self::card_data( $product, false );
			}
		}
		return new \WP_REST_Response( array( 'items' => $items ), 200 );
	}

	/**
	 * Counts a request for this visitor and says whether they are over the limit.
	 * Only a hash of the address is kept.
	 */
	private static function limited( $prefix, $max ) {
		$ip   = isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '';
		$ip   = (string) apply_filters( 'kriti_blocks_rating_client_ip', $ip );
		$key  = $prefix . md5( wp_salt() . $ip );
		$used = (int) get_transient( $key );
		if ( $used >= $max ) {
			return true;
		}
		set_transient( $key, $used + 1, 10 * MINUTE_IN_SECONDS );
		return false;
	}

	public static function register_search_route() {
		register_rest_route(
			self::NAMESPACE,
			self::SEARCH_ROUTE,
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'handle_search' ),
				// Public on purpose: it returns only products the site's own search would show.
				'permission_callback' => '__return_true',
				'args'                => array(
					'q'   => array(
						'required'          => true,
						'sanitize_callback' => static function ( $value ) {
							return mb_substr( sanitize_text_field( (string) $value ), 0, 60 );
						},
					),
					'cat' => array(
						'default'           => '',
						// A closure, because WordPress passes extra arguments that sanitize_title() would misread.
						'sanitize_callback' => static function ( $value ) {
							return sanitize_title( (string) $value );
						},
					),
				),
			)
		);
	}

	/**
	 * Live search suggestions: plain data only, so the page script can build the
	 * list without inserting any HTML from the server.
	 */
	public static function handle_search( \WP_REST_Request $request ) {
		if ( ! class_exists( 'WooCommerce' ) || ! function_exists( 'wc_get_products' ) ) {
			return new \WP_Error( 'kb_search_unavailable', __( 'Not available.', 'kriti-blocks' ), array( 'status' => 404 ) );
		}
		$q = (string) $request['q'];
		if ( mb_strlen( $q ) < 2 ) {
			return new \WP_REST_Response( array( 'items' => array() ), 200 );
		}
		if ( self::limited( 'kbshop_s_', self::SEARCH_10MIN ) ) {
			return new \WP_Error( 'kb_search_rate', __( 'Too many searches. Try again shortly.', 'kriti-blocks' ), array( 'status' => 429 ) );
		}

		$args = array(
			'status'     => 'publish',
			'limit'      => self::SEARCH_LIMIT,
			's'          => $q,
			'visibility' => 'search',
			'orderby'    => 'relevance',
		);
		$cat  = (string) $request['cat'];
		if ( '' !== $cat && term_exists( $cat, 'product_cat' ) ) {
			$args['category'] = array( $cat );
		}

		$items = array();
		foreach ( wc_get_products( $args ) as $product ) {
			if ( ! $product instanceof \WC_Product || post_password_required( $product->get_id() ) ) {
				continue;
			}
			$image   = wp_get_attachment_image_url( (int) $product->get_image_id(), 'thumbnail' );
			$items[] = array(
				'title' => wp_strip_all_tags( $product->get_name() ),
				'url'   => esc_url_raw( $product->get_permalink() ),
				'price' => self::price_text( $product->get_price_html() ),
				'image' => $image ? esc_url_raw( $image ) : '',
			);
		}
		return new \WP_REST_Response( array( 'items' => $items ), 200 );
	}

	/**
	 * The visitor's page and filters while the endpoint is rendering, else null.
	 *
	 * @return array{page:int,filters:array}|null
	 */
	public static function override() {
		return self::$override;
	}

	public static function valid_id( $value ) {
		return is_string( $value ) && 1 === preg_match( '/^[a-z0-9]{6,40}$/', $value );
	}

	/**
	 * Filter bar controls the block has turned on.
	 *
	 * @param array $attributes Block attributes.
	 * @return string[]
	 */
	public static function controls( array $attributes ) {
		$wanted = isset( $attributes['filterControls'] ) && is_array( $attributes['filterControls'] ) ? $attributes['filterControls'] : array();
		return array_values( array_intersect( self::CONTROLS, array_map( 'strval', $wanted ) ) );
	}

	public static function register_route() {
		register_rest_route(
			self::NAMESPACE,
			self::ROUTE,
			array(
				'methods'             => 'GET',
				'callback'            => array( __CLASS__, 'handle' ),
				// Public on purpose: it only returns what the page already shows. Everything is validated below.
				'permission_callback' => '__return_true',
				'args'                => array(
					'post_id' => array(
						'required'          => true,
						'sanitize_callback' => 'absint',
					),
					'grid'    => array(
						'required'          => true,
						'validate_callback' => array( __CLASS__, 'valid_id' ),
					),
					'page'    => array(
						'default'           => 1,
						'sanitize_callback' => 'absint',
					),
				),
			)
		);
	}

	private static function find_block( array $blocks, $grid_id ) {
		foreach ( $blocks as $block ) {
			if ( self::BLOCK === ( $block['blockName'] ?? '' ) && ( $block['attrs']['gridId'] ?? '' ) === $grid_id ) {
				return $block;
			}
			if ( ! empty( $block['innerBlocks'] ) ) {
				$found = self::find_block( $block['innerBlocks'], $grid_id );
				if ( $found ) {
					return $found;
				}
			}
		}
		return null;
	}

	/**
	 * Checks the visitor's choices. Only controls the block turned on are used.
	 *
	 * @param \WP_REST_Request $request  Request.
	 * @param string[]         $controls Enabled controls.
	 * @return array
	 */
	public static function sanitize_filters( $request, array $controls ) {
		$out = array();
		if ( in_array( 'search', $controls, true ) ) {
			$q = mb_substr( sanitize_text_field( (string) $request->get_param( 'q' ) ), 0, 60 );
			if ( '' !== $q ) {
				$out['q'] = $q;
			}
		}
		if ( in_array( 'sort', $controls, true ) ) {
			$sort = (string) $request->get_param( 'orderby' );
			if ( in_array( $sort, self::ORDERBY, true ) ) {
				$out['orderby'] = $sort;
			}
		}
		if ( in_array( 'category', $controls, true ) ) {
			$cat = absint( $request->get_param( 'cat' ) );
			if ( $cat && term_exists( $cat, 'product_cat' ) ) {
				$out['cat'] = $cat;
			}
		}
		if ( in_array( 'stock', $controls, true ) && '1' === (string) $request->get_param( 'stock' ) ) {
			$out['stock'] = true;
		}
		if ( in_array( 'price', $controls, true ) ) {
			foreach ( array( 'min', 'max' ) as $key ) {
				$value = $request->get_param( $key );
				if ( is_numeric( $value ) && (float) $value > 0 ) {
					$out[ $key ] = min( (float) $value, 1000000000 );
				}
			}
		}
		return $out;
	}

	public static function handle( \WP_REST_Request $request ) {
		if ( ! class_exists( 'WooCommerce' ) ) {
			return new \WP_Error( 'kb_shop_unavailable', __( 'Not available.', 'kriti-blocks' ), array( 'status' => 404 ) );
		}
		$post_id = (int) $request['post_id'];
		$post    = get_post( $post_id );
		if ( ! $post || 'publish' !== $post->post_status || ! is_post_publicly_viewable( $post ) || post_password_required( $post ) ) {
			return new \WP_Error( 'kb_shop_post', __( 'Not available.', 'kriti-blocks' ), array( 'status' => 404 ) );
		}
		$block = self::find_block( parse_blocks( $post->post_content ), (string) $request['grid'] );
		if ( ! $block ) {
			return new \WP_Error( 'kb_shop_block', __( 'Not available.', 'kriti-blocks' ), array( 'status' => 404 ) );
		}
		$attrs    = $block['attrs'];
		$controls = self::controls( $attrs );
		if ( empty( $attrs['loadMore'] ) && empty( $controls ) ) {
			return new \WP_Error( 'kb_shop_block', __( 'Not available.', 'kriti-blocks' ), array( 'status' => 404 ) );
		}

		// A cap per address, because each call runs a product query.
		if ( self::limited( 'kbshop_r_', self::PER_10MIN ) ) {
			return new \WP_Error( 'kb_shop_rate', __( 'Too many requests. Try again shortly.', 'kriti-blocks' ), array( 'status' => 429 ) );
		}

		$page = max( 1, min( (int) $request['page'], 200 ) );

		// The block renders for this post, so get_the_ID() and visibility checks work.
		$GLOBALS['post'] = $post; // phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited
		setup_postdata( $post );

		self::$override = array(
			'page'    => $page,
			'filters' => self::sanitize_filters( $request, $controls ),
		);
		try {
			$html = render_block( $block );
		} finally {
			self::$override = null;
			wp_reset_postdata();
		}

		$items = array();
		if ( preg_match_all( '#<li class="bw-woo-product-grid__item">.*?</li>#s', $html, $m ) ) {
			$items = $m[0];
		}
		$pages = 0;
		if ( preg_match( '#data-pages="(\d+)"#', $html, $p ) ) {
			$pages = (int) $p[1];
		}
		return new \WP_REST_Response(
			array(
				'html'  => implode( '', $items ),
				'count' => count( $items ),
				'page'  => $page,
				'pages' => $pages,
			),
			200
		);
	}
}
