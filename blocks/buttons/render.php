<?php
// phpcs:disable WordPress.NamingConventions.PrefixAllGlobals.NonPrefixedVariableFound -- Included inside a render callback, so these variables are local, not global.
if ( ! defined( 'ABSPATH' ) ) {
    exit; // Exit if accessed directly.
}
if( ! function_exists( 'kriti_blocks_render_buttons_block' ) ) {
function kriti_blocks_render_buttons_block( $attributes, $content, $block ) {
    $inner_blocks = $block->parsed_block['innerBlocks'];

    $nav = '<ul>';
    $panes = '';

    foreach ( $inner_blocks as $index => $inner ) {
        $title = $inner['attrs']['title'] ?? 'Tab';
        $tab_id = $inner['attrs']['tabId'] ?? 'tab-' . $index;

        // Navigation
        $nav .= '<li><a href="#' . esc_attr( $tab_id ) . '">' . esc_html( $title ) . '</a></li>';

        // Content
        $inner_content = render_block( $inner );

        $panes .= '<div id="' . esc_attr( $tab_id ) . '">';
        $panes .= $inner_content;
        $panes .= '</div>';
    }

    $nav .= '</ul>';

    return '<div id="tabs">' . $nav . $panes . '</div>';
}
}

    add_filter( 'render_block_kriti-blocks/tabs', 'kriti_blocks_render_buttons_block', 10, 3 );

