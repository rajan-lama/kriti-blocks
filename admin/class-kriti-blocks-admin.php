<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://wpblockwriter.com
 * @since      1.0.0
 *
 * @package    Kriti Blocks
 * @subpackage Kriti Blocks/admin
 */
if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Kriti Blocks
 * @subpackage Kriti Blocks/admin
 * @author     Ri Themes <wpblockwriter@gmail.com>
 */
class Kriti_Blocks_Admin
{

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct($plugin_name, $version)
	{

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Kriti_Blocks_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Kriti_Blocks_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style('bootstrap', plugin_dir_url(__FILE__) . 'css/bootstrap.min.css', array(), '5.3.3', 'all');
    	wp_enqueue_style($this->plugin_name . '-editor', plugin_dir_url(__FILE__) . 'css/kriti-blocks-editor.css', array(), $this->version, 'all');
		wp_enqueue_style($this->plugin_name . '-admin', plugin_dir_url(__FILE__) . 'css/kriti-blocks-admin.css', array(), $this->version, 'all');

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts()
	{

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Kriti_Blocks_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Kriti_Blocks_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */
    	// In the block editor this action also fills the editor canvas (an iframe). Bootstrap's script
    	// cannot start there, because the iframe has no <body> yet, and nothing in the editor uses it.
    	// The main editor page still gets it from admin_enqueue_scripts.
    	if (!(is_admin() && 'enqueue_block_assets' === current_action())) {
    		wp_enqueue_script('bootstrap-bundle', KRITI_BLOCKS_URL. 'public/js/bootstrap/bootstrap.bundle.min.js', array(), '5.3.3', true);
    	}
		wp_enqueue_script($this->plugin_name, plugin_dir_url(__FILE__) . 'js/kriti-blocks-admin.js', array('jquery'), $this->version, false);

	}

}
