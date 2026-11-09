<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
/**
 * Server render for the BW Product Categories block.
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

if ( ! class_exists( 'WooCommerce' ) || ! taxonomy_exists( 'product_cat' ) ) {
	return '';
}

$is_preview = defined( 'REST_REQUEST' ) && REST_REQUEST;

$allowed_orderby = array( 'name', 'count', 'slug', 'term_id' );
$allowed_order   = array( 'ASC', 'DESC' );
$allowed_layouts = array( 'grid', 'list', 'inline' );

$order_by = isset( $attributes['orderBy'] ) ? sanitize_key( $attributes['orderBy'] ) : 'name';
$order_by = in_array( $order_by, $allowed_orderby, true ) ? $order_by : 'name';
$order    = isset( $attributes['order'] ) ? strtoupper( (string) $attributes['order'] ) : 'ASC';
$order    = in_array( $order, $allowed_order, true ) ? $order : 'ASC';
$limit    = isset( $attributes['limit'] ) ? absint( $attributes['limit'] ) : 0;
$limit    = min( $limit, 100 );
$layout   = isset( $attributes['layout'] ) ? sanitize_key( $attributes['layout'] ) : 'grid';
$layout   = in_array( $layout, $allowed_layouts, true ) ? $layout : 'grid';
$columns  = isset( $attributes['columns'] ) ? absint( $attributes['columns'] ) : 3;
$columns  = min( max( $columns, 1 ), 6 );

$hide_empty     = ! isset( $attributes['hideEmpty'] ) || (bool) $attributes['hideEmpty'];
$show_count     = ! isset( $attributes['showCount'] ) || (bool) $attributes['showCount'];
$show_thumbnail = ! isset( $attributes['showThumbnail'] ) || (bool) $attributes['showThumbnail'];
$show_thumbnail = $show_thumbnail && 'inline' !== $layout;
$hierarchical   = ! empty( $attributes['hierarchical'] ) && is_taxonomy_hierarchical( 'product_cat' );

$parse_ids = static function ( $value ) {
	if ( ! is_array( $value ) ) {
		return array();
	}

	return array_slice( array_values( array_unique( array_filter( array_map( 'absint', array_filter( $value, 'is_scalar' ) ) ) ) ), 0, 100 );
};

$include_ids   = $parse_ids( isset( $attributes['includeIds'] ) ? $attributes['includeIds'] : array() );
$exclude_ids   = $parse_ids( isset( $attributes['excludeIds'] ) ? $attributes['excludeIds'] : array() );
$parent_filter = isset( $attributes['parentFilter'] ) ? sanitize_key( $attributes['parentFilter'] ) : 'all';
$parent_filter = in_array( $parent_filter, array( 'all', 'top', 'children' ), true ) ? $parent_filter : 'all';
$parent_id     = isset( $attributes['parentId'] ) ? absint( $attributes['parentId'] ) : 0;

// "Children of" without a parent has nothing to show, so treat it as "all".
if ( 'children' === $parent_filter && $parent_id < 1 ) {
	$parent_filter = 'all';
}

if ( ! empty( $attributes['hideUncategorized'] ) ) {
	$default_category = absint( get_option( 'default_product_cat', 0 ) );

	if ( $default_category > 0 ) {
		$exclude_ids[] = $default_category;
	}
}

$card_style     = isset( $attributes['cardStyle'] ) ? sanitize_key( $attributes['cardStyle'] ) : 'default';
$card_style     = in_array( $card_style, array( 'default', 'flat', 'overlay' ), true ) ? $card_style : 'default';
$image_zoom     = ! empty( $attributes['imageZoom'] );
$image_ratio    = isset( $attributes['imageRatio'] ) ? sanitize_key( $attributes['imageRatio'] ) : 'square';
$ratio_map      = array(
	'square' => '',
	'4-3'    => '4 / 3',
	'3-4'    => '3 / 4',
	'16-9'   => '16 / 9',
);
$image_ratio    = isset( $ratio_map[ $image_ratio ] ) ? $image_ratio : 'square';
$columns_tablet = isset( $attributes['columnsTablet'] ) ? min( absint( $attributes['columnsTablet'] ), 6 ) : 0;
$columns_mobile = isset( $attributes['columnsMobile'] ) ? min( absint( $attributes['columnsMobile'] ), 6 ) : 0;

$query_args = array(
	'taxonomy'   => 'product_cat',
	'hide_empty' => $hide_empty,
	'orderby'    => $order_by,
	'order'      => $order,
);

if ( ! empty( $include_ids ) ) {
	$query_args['include'] = $include_ids;
}

if ( ! empty( $exclude_ids ) ) {
	$query_args['exclude'] = array_values( array_unique( $exclude_ids ) ); // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude -- Bounded exclusion list.
}

if ( 'top' === $parent_filter ) {
	$query_args['parent'] = 0;
} elseif ( 'children' === $parent_filter ) {
	if ( $hierarchical ) {
		$query_args['child_of'] = $parent_id;
	} else {
		$query_args['parent'] = $parent_id;
	}
}

if ( $limit > 0 ) {
	$query_args['number'] = $limit;
}

$terms     = get_terms( $query_args );
$is_sample = false;

if ( is_wp_error( $terms ) || empty( $terms ) ) {
	if ( ! $is_preview ) {
		return '';
	}

	$terms     = array();
	$is_sample = true;
}

$render_term = static function ( $term, $children_output = '' ) use ( $is_sample, $show_count, $show_thumbnail ) {
	if ( $is_sample ) {
		$link  = '#';
		$name  = __( 'Product category', 'kriti-blocks' );
		$count = 0;
	} else {
		$link = get_term_link( $term );

		if ( is_wp_error( $link ) ) {
			return '';
		}

		$name  = $term->name;
		$count = (int) $term->count;
	}

	$output = '<li class="bw-woo-product-categories__item">';

	if ( $show_thumbnail ) {
		$output .= '<a class="bw-woo-product-categories__media" href="' . esc_url( $link ) . '">';

		if ( ! $is_sample ) {
			$thumbnail_id = absint( get_term_meta( $term->term_id, 'thumbnail_id', true ) );

			if ( $thumbnail_id ) {
				$output .= wp_get_attachment_image( $thumbnail_id, 'woocommerce_thumbnail', false, array( 'loading' => 'lazy' ) );
			} else {
				$output .= '<span class="bw-woo-product-categories__placeholder" aria-hidden="true"></span>';
			}
		} else {
			$output .= '<span class="bw-woo-product-categories__placeholder" aria-hidden="true"></span>';
		}

		$output .= '</a>';
	}

	$output .= '<div class="bw-woo-product-categories__body">';
	$output .= '<a class="bw-woo-product-categories__link" href="' . esc_url( $link ) . '">' . esc_html( $name ) . '</a>';

	if ( $show_count ) {
		$output .= '<span class="bw-woo-product-categories__count">' . esc_html( number_format_i18n( $count ) ) . '</span>';
	}

	$output .= $children_output;
	$output .= '</div>';
	$output .= '</li>';

	return $output;
};

$children_by_parent = array();

foreach ( $terms as $term ) {
	$children_by_parent[ $term->parent ][] = $term;
}

$render_branch = static function ( $parent_id ) use ( &$render_branch, &$children_by_parent, $render_term ) {
	$output = '';

	foreach ( $children_by_parent[ $parent_id ] ?? array() as $term ) {
		$children = $render_branch( $term->term_id );

		if ( '' !== $children ) {
			$children = '<ul class="bw-woo-product-categories__items bw-woo-product-categories__items--children">' . $children . '</ul>';
		}

		$output .= $render_term( $term, $children );
	}

	return $output;
};

if ( $is_sample ) {
	$items_markup = '';

	for ( $index = 0; $index < 3; $index++ ) {
		$items_markup .= $render_term( null );
	}
} elseif ( $hierarchical ) {
	/*
	 * By default the tree starts at the top level. With a parent or include
	 * filter, roots are the terms whose parent is not part of the result.
	 */
	if ( 'all' === $parent_filter && empty( $include_ids ) ) {
		$items_markup = $render_branch( 0 );
	} else {
		$result_ids   = wp_list_pluck( $terms, 'term_id' );
		$items_markup = '';

		foreach ( $terms as $term ) {
			if ( in_array( (int) $term->parent, array_map( 'intval', $result_ids ), true ) ) {
				continue;
			}

			$children = $render_branch( $term->term_id );

			if ( '' !== $children ) {
				$children = '<ul class="bw-woo-product-categories__items bw-woo-product-categories__items--children">' . $children . '</ul>';
			}

			$items_markup .= $render_term( $term, $children );
		}
	}
} else {
	$items_markup = '';

	foreach ( $terms as $term ) {
		$items_markup .= $render_term( $term );
	}
}

$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$classes = 'bw-woo-product-categories bw-woo-product-categories--' . $layout;

if ( $is_sample ) {
	$classes .= ' bw-woo-product-categories--preview';
}

if ( 'default' !== $card_style ) {
	$classes .= ' bw-woo-product-categories--card-' . $card_style;
}

if ( $image_zoom ) {
	$classes .= ' bw-woo-product-categories--zoom';
}

if ( '' !== $extra_class ) {
	$classes .= ' ' . $extra_class;
}

$extra_attributes = array(
	'class' => trim( $classes ),
);

$inline_style = '';

if ( 'grid' === $layout ) {
	$inline_style .= '--bw-woo-product-categories-columns:' . $columns . ';';

	if ( $columns_tablet > 0 ) {
		$inline_style .= '--bw-woo-product-categories-columns-tablet:' . $columns_tablet . ';';
	}

	if ( $columns_mobile > 0 ) {
		$inline_style .= '--bw-woo-product-categories-columns-mobile:' . $columns_mobile . ';';
	}
}

if ( '' !== $ratio_map[ $image_ratio ] ) {
	$inline_style .= '--bw-woo-product-categories-ratio:' . $ratio_map[ $image_ratio ] . ';';
}

if ( '' !== $inline_style ) {
	$extra_attributes['style'] = $inline_style;
}

if ( '' !== $html_id ) {
	$extra_attributes['id'] = $html_id;
}

$wrapper_attributes = get_block_wrapper_attributes( $extra_attributes );

ob_start();
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>>
	<ul class="bw-woo-product-categories__items">
		<?php echo $items_markup; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</ul>
</div>
<?php
return ob_get_clean();
