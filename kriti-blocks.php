<?php

/**
 * @link              https://wpblockwriter.com
 * @since             1.0.7
 * @package           Kriti Blocks
 *
 * @wordpress-plugin
 * Plugin Name:       Kriti Blocks
 * Plugin URI:        https://wpblockwriter.com/wordpress-plugins/kriti-blocks
 * Description:       A powerful block plugins for WordPressers.
 * Version:           1.0.7
 * Author:            wpblockwriter
 * Author URI:        https://wpblockwriter.com/
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       kriti-blocks
 * Domain Path:       /languages
 * Requires at least: 6.0
 * Requires PHP:      7.0
 */

use Kriti_Blocks\Plugin;

// If this file is called directly, abort.
if (!defined('WPINC')) {
	die;
}

/**
 * Bootstrap the plugin.
 */

if (is_dir(__DIR__ . '/vendor')) {
	require_once __DIR__ . '/vendor/autoload.php';
}

require_once untrailingslashit(plugin_dir_path(__FILE__)) . '/includes/helper-functions.php';

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define('KRITI_BLOCKS_VERSION', '1.0.7');
define('KRITI_BLOCKS_PATH', plugin_dir_path(__FILE__));
define('KRITI_BLOCKS_URL', plugin_dir_url(__FILE__));

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-kriti-blocks-activator.php
 */
function kriti_blocks_activate()
{
	require_once plugin_dir_path(__FILE__) . 'includes/class-kriti-blocks-activator.php';
	Kriti_Blocks_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-kriti-blocks-deactivator.php
 */
function kriti_blocks_deactivate()
{
	require_once plugin_dir_path(__FILE__) . 'includes/class-kriti-blocks-deactivator.php';
	Kriti_Blocks_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'kriti_blocks_activate');
register_deactivation_hook(__FILE__, 'kriti_blocks_deactivate');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-kriti-blocks.php';
require plugin_dir_path(__FILE__) . 'includes/class-kriti-blocks-design.php';
\Kriti_Blocks\Design::init();
require plugin_dir_path(__FILE__) . 'includes/class-kriti-blocks-rating.php';
\Kriti_Blocks\Rating::init();
require plugin_dir_path(__FILE__) . 'includes/class-kriti-blocks-dynamic.php';
\Kriti_Blocks\Dynamic::init();
require plugin_dir_path(__FILE__) . 'includes/class-kriti-blocks-global-styles.php';
\Kriti_Blocks\Global_Styles::init();
require plugin_dir_path(__FILE__) . 'includes/class-kriti-blocks-shop.php';
\Kriti_Blocks\Shop::init();
require plugin_dir_path(__FILE__) . 'includes/class-kriti-blocks-minicart.php';
\Kriti_Blocks\Mini_Cart::init();
require plugin_dir_path(__FILE__) . 'includes/class-kriti-blocks-wishlist.php';
\Kriti_Blocks\Wishlist::init();
require plugin_dir_path(__FILE__) . 'includes/class-kriti-blocks-schema.php';
\Kriti_Blocks\Schema::init();

/**
 * Determines whether WooCommerce is available.
 *
 * @return bool
 */
function kriti_blocks_is_woocommerce_active()
{
	return class_exists('WooCommerce');
}

/**
 * Whether a block directory is exclusive to WooCommerce.
 *
 * Blocks stored in a `blocks/woo-*` directory are only registered when
 * WooCommerce is active, so they never appear as broken blocks otherwise.
 *
 * @param string $block_path Absolute path to the block directory.
 *
 * @return bool
 */
function kriti_blocks_block_requires_woocommerce($block_path)
{
	return 0 === strpos(basename($block_path), 'woo-');
}

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/reference/functions/register_block_type/
 */
function kriti_blocks_block_init()
{
	foreach (glob(__DIR__ . '/blocks/*') as $block_path) {
		if (!file_exists($block_path . '/block.json')) {
			continue;
		}

		if (kriti_blocks_block_requires_woocommerce($block_path) && !kriti_blocks_is_woocommerce_active()) {
			continue;
		}

		register_block_type($block_path);
	}
}

/**
 * Core prints what a block's render.php echoes and ignores what it returns.
 * Several render.php files build their markup in a buffer and return it, which
 * rendered nothing on the site. This wrapper accepts both styles: a returned
 * string wins, otherwise the printed output is used.
 */
function kriti_blocks_render_callback_args($args, $block_type)
{
	if (0 !== strpos($block_type, 'kriti-blocks/') || empty($args['render_callback'])) {
		return $args;
	}

	$path = __DIR__ . '/blocks/' . substr($block_type, strlen('kriti-blocks/')) . '/render.php';
	if (!is_readable($path)) {
		return $args;
	}

	$args['render_callback'] = static function ($attributes, $content, $block) use ($path) {
		ob_start();
		$returned = require $path;
		$printed  = ob_get_clean();
		return (is_string($returned) && '' !== $returned) ? $returned : $printed;
	};

	return $args;
}
add_filter('register_block_type_args', 'kriti_blocks_render_callback_args', 20, 2);

function kriti_blocks_category($block_categories, $editor_context)
{
	if (!empty($editor_context->post)) {
		array_push(
			$block_categories,
			array(
				'slug' => 'kriti-blocks',
				'title' => __('Kriti Blocks', 'kriti-blocks'),
				'icon' => null,
			)
		);
	}
	return $block_categories;
}

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function kriti_blocks_run()
{
	$plugin = new Kriti_Blocks();
	$plugin->run();
	add_action('init', 'kriti_blocks_block_init');
	add_filter('block_categories_all', 'kriti_blocks_category', 10, 2);
}

kriti_blocks_run();
