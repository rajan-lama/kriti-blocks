<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
/**
 * Server render for the BW Term List block.
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

$taxonomy = isset( $attributes['taxonomy'] ) ? sanitize_key( $attributes['taxonomy'] ) : 'category';

if ( ! taxonomy_exists( $taxonomy ) || ! is_taxonomy_viewable( $taxonomy ) ) {
	return '';
}

$allowed_orderby = array( 'name', 'count', 'slug', 'term_id' );
$allowed_order   = array( 'ASC', 'DESC' );

$order_by = isset( $attributes['orderBy'] ) ? sanitize_key( $attributes['orderBy'] ) : 'name';
$order_by = in_array( $order_by, $allowed_orderby, true ) ? $order_by : 'name';
$order    = isset( $attributes['order'] ) ? strtoupper( (string) $attributes['order'] ) : 'ASC';
$order    = in_array( $order, $allowed_order, true ) ? $order : 'ASC';
$limit    = isset( $attributes['limit'] ) ? absint( $attributes['limit'] ) : 0;
$limit    = min( $limit, 100 );

$hide_empty   = ! isset( $attributes['hideEmpty'] ) || (bool) $attributes['hideEmpty'];
$show_count   = ! isset( $attributes['showCount'] ) || (bool) $attributes['showCount'];
$hierarchical = ! empty( $attributes['hierarchical'] ) && is_taxonomy_hierarchical( $taxonomy );
$layout       = isset( $attributes['layout'] ) ? sanitize_key( $attributes['layout'] ) : 'list';
$layout       = in_array( $layout, array( 'list', 'inline' ), true ) ? $layout : 'list';

/*
 * Extra options. Each value is validated; the defaults reproduce the original output.
 */
$parse_ids = static function ( $value ) {
	if ( is_array( $value ) ) {
		$value = implode( ',', array_map( 'strval', array_filter( $value, 'is_scalar' ) ) );
	}

	$parts = preg_split( '/[\s,]+/', (string) $value, -1, PREG_SPLIT_NO_EMPTY );

	return array_slice( array_values( array_unique( array_filter( array_map( 'absint', $parts ) ) ) ), 0, 100 );
};

$include_ids    = $parse_ids( $attributes['includeIds'] ?? '' );
$exclude_ids    = $parse_ids( $attributes['excludeIds'] ?? '' );
$top_level_only = ! empty( $attributes['topLevelOnly'] ) && is_taxonomy_hierarchical( $taxonomy );
$link_style     = isset( $attributes['linkStyle'] ) ? sanitize_key( $attributes['linkStyle'] ) : 'auto';
$link_style     = in_array( $link_style, array( 'auto', 'plain', 'pill', 'outline' ), true ) ? $link_style : 'auto';
$columns        = isset( $attributes['columns'] ) ? min( max( absint( $attributes['columns'] ), 1 ), 4 ) : 1;
$show_desc      = ! empty( $attributes['showDescription'] );
$icon           = isset( $attributes['termIcon'] ) ? sanitize_key( $attributes['termIcon'] ) : 'none';

$icons = array(
	'folder' => 'M10 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-8z',
	'tag'    => 'M21.41 11.58 12.41 2.58A2 2 0 0 0 11 2H4a2 2 0 0 0-2 2v7c0 .55.22 1.05.59 1.42l9 9c.36.36.86.58 1.41.58s1.05-.22 1.41-.59l7-7c.37-.36.59-.86.59-1.41s-.23-1.06-.59-1.42M5.5 7A1.5 1.5 0 1 1 7 5.5 1.5 1.5 0 0 1 5.5 7',
	'hash'   => 'M10 3 8 9H4v2h3.33L6.67 13H3v2h3l-1 4h2l1-4h4l-1 4h2l1-4h4v-2h-3.33l.66-2H21V9h-3l1-6h-2l-1 6h-4l1-6zm1.33 8 .67-2h4l-.67 2z',
	'arrow'  => 'M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6z',
	'dot'    => 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8',
);

if ( ! isset( $icons[ $icon ] ) ) {
	$icon = 'none';
}

$colors = array(
	'linkColor'  => '--bw-term-color',
	'linkBg'     => '--bw-term-bg',
	'hoverColor' => '--bw-term-hover-color',
	'hoverBg'    => '--bw-term-hover-bg',
	'countColor' => '--bw-term-count-color',
);

$inline_style = '';

$color_classes = '';

foreach ( $colors as $attribute_name => $css_var ) {
	$color = isset( $attributes[ $attribute_name ] ) && is_string( $attributes[ $attribute_name ] ) ? sanitize_hex_color( $attributes[ $attribute_name ] ) : '';

	if ( $color ) {
		$inline_style .= $css_var . ':' . $color . ';';

		if ( 'linkColor' === $attribute_name ) {
			$color_classes .= ' bw-term-list--has-color';
		} elseif ( 'hoverColor' === $attribute_name ) {
			$color_classes .= ' bw-term-list--has-hover-color';
		}
	}
}

$query_args = array(
	'taxonomy'   => $taxonomy,
	'hide_empty' => $hide_empty,
	'orderby'    => $order_by,
	'order'      => $order,
);

if ( $limit > 0 ) {
	$query_args['number'] = $limit;
}

if ( ! empty( $include_ids ) ) {
	$query_args['include'] = $include_ids;
}

if ( ! empty( $exclude_ids ) ) {
	$query_args['exclude'] = $exclude_ids; // phpcs:ignore WordPressVIPMinimum.Performance.WPQueryParams.PostNotIn_exclude -- Bounded exclusion list.
}

if ( $top_level_only ) {
	$query_args['parent'] = 0;
}

$terms = get_terms( $query_args );

if ( is_wp_error( $terms ) || empty( $terms ) ) {
	return '';
}

$render_term = static function ( $term, $show_count, $children_output = '' ) use ( $icon, $icons, $show_desc ) {
	$link = get_term_link( $term );

	if ( is_wp_error( $link ) ) {
		return '';
	}

	$output  = '<li class="bw-term-list__item">';
	$output .= '<a class="bw-term-list__link" href="' . esc_url( $link ) . '">';

	if ( 'none' !== $icon ) {
		$output .= '<svg class="bw-term-list__icon" viewBox="0 0 24 24" width="14" height="14" aria-hidden="true" focusable="false"><path d="' . esc_attr( $icons[ $icon ] ) . '" fill="currentColor"/></svg>';
	}

	$output .= esc_html( $term->name );
	$output .= '</a>';

	if ( $show_count ) {
		$output .= '<span class="bw-term-list__count">(' . esc_html( number_format_i18n( $term->count ) ) . ')</span>';
	}

	if ( $show_desc && '' !== trim( (string) $term->description ) ) {
		$output .= '<span class="bw-term-list__description">' . esc_html( wp_trim_words( wp_strip_all_tags( $term->description ), 20 ) ) . '</span>';
	}

	$output .= $children_output;
	$output .= '</li>';

	return $output;
};

$children_by_parent = array();

foreach ( $terms as $term ) {
	$children_by_parent[ $term->parent ][] = $term;
}

$present_ids = array();

foreach ( $terms as $term ) {
	$present_ids[ $term->term_id ] = true;
}

// When include or exclude removes a parent, its children are shown at the top level.
$has_filter = ! empty( $include_ids ) || ! empty( $exclude_ids );

$render_branch = static function ( $parent_id ) use ( &$render_branch, &$children_by_parent, $render_term, $show_count ) {
	$output = '';

	foreach ( $children_by_parent[ $parent_id ] ?? array() as $term ) {
		$children = $render_branch( $term->term_id );

		if ( '' !== $children ) {
			$children = '<ul class="bw-term-list__items bw-term-list__items--children">' . $children . '</ul>';
		}

		$output .= $render_term( $term, $show_count, $children );
	}

	return $output;
};

if ( $hierarchical ) {
	if ( $has_filter ) {
		foreach ( $terms as $term ) {
			if ( $term->parent && ! isset( $present_ids[ $term->parent ] ) ) {
				$children_by_parent[0][] = $term;
			}
		}
	}

	$items_markup = $render_branch( 0 );
} else {
	$items_markup = '';

	foreach ( $terms as $term ) {
		$items_markup .= $render_term( $term, $show_count );
	}
}

$extra_class = isset( $attributes['extraClass'] ) ? (string) $attributes['extraClass'] : '';
$html_id     = isset( $attributes['htmlId'] ) ? (string) $attributes['htmlId'] : '';

$modifier_class = $color_classes;

if ( 'auto' !== $link_style ) {
	$modifier_class .= ' bw-term-list--link-' . $link_style;
}

if ( $columns > 1 && 'list' === $layout ) {
	$modifier_class .= ' bw-term-list--cols-' . $columns;
}

if ( 'none' !== $icon ) {
	$modifier_class .= ' bw-term-list--has-icon';
}

$extra_attributes = array(
	'class' => trim( 'bw-term-list bw-term-list--' . $layout . $modifier_class . ' ' . $extra_class ),
);

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
	<ul class="bw-term-list__items">
		<?php echo $items_markup; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped ?>
	</ul>
</div>
<?php
return ob_get_clean();
