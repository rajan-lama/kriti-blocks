<?php

/**
 * Define the internationalization functionality
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @link       https://wpblockwriter.com
 * @since      1.0.0
 *
 * @package    Kriti Blocks
 * @subpackage Kriti Blocks/includes
 */

/**
 * Define the internationalization functionality.
 *
 * Loads and defines the internationalization files for this plugin
 * so that it is ready for translation.
 *
 * @since      1.0.0
 * @package    Kriti Blocks
 * @subpackage Kriti Blocks/includes
 * @author     Ri Themes <wpblockwriter@gmail.com>
 */
class Kriti_Blocks_i18n {


	/**
	 * Load the plugin text domain for translation.
	 *
	 * @since    1.0.0
	 */
	public function load_plugin_textdomain() {

		load_plugin_textdomain(
			'kriti-blocks',
			false,
			dirname( dirname( plugin_basename( __FILE__ ) ) ) . '/languages/'
		);

	}



}
