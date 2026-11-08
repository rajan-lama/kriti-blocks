<?php
/**
 * FAQPage structured data for the Accordion and FAQ blocks.
 *
 * A block opts in with its `faqSchema` attribute. Questions and answers from
 * every opted-in block on the page are merged into one FAQPage object, printed
 * once in the footer, because search engines expect a single FAQPage per URL.
 *
 * @package Kriti_Blocks
 */

namespace Kriti_Blocks;

if ( ! defined( 'WPINC' ) ) {
	die;
}

class Schema {

	/**
	 * @var array<int,array{question:string,answer:string}>
	 */
	private static $items = array();

	public static function init() {
		add_filter( 'render_block', array( __CLASS__, 'collect' ), 20, 2 );
		add_action( 'wp_footer', array( __CLASS__, 'print_json_ld' ), 20 );
	}

	public static function collect( $content, $block ) {
		$name = isset( $block['blockName'] ) ? $block['blockName'] : '';
		if ( 'kriti-blocks/faq' !== $name && 'kriti-blocks/accordion' !== $name ) {
			return $content;
		}
		if ( empty( $block['attrs']['faqSchema'] ) || is_admin() ) {
			return $content;
		}

		if ( 'kriti-blocks/faq' === $name ) {
			foreach ( (array) ( $block['attrs']['faqItems'] ?? array() ) as $item ) {
				self::add( $item['question'] ?? '', $item['answer'] ?? '' );
			}
		} else {
			foreach ( (array) $block['innerBlocks'] as $inner ) {
				if ( 'kriti-blocks/accordion-item' !== ( $inner['blockName'] ?? '' ) ) {
					continue;
				}
				$answer = '';
				foreach ( (array) $inner['innerBlocks'] as $child ) {
					$answer .= render_block( $child );
				}
				self::add( $inner['attrs']['itemTitle'] ?? '', $answer );
			}
		}
		return $content;
	}

	private static function add( $question, $answer ) {
		$question = trim( wp_strip_all_tags( (string) $question ) );
		$answer   = trim(
			wp_kses(
				(string) $answer,
				array(
					'h1'     => array(),
					'h2'     => array(),
					'h3'     => array(),
					'h4'     => array(),
					'h5'     => array(),
					'h6'     => array(),
					'br'     => array(),
					'ol'     => array(),
					'ul'     => array(),
					'li'     => array(),
					'p'      => array(),
					'div'    => array(),
					'b'      => array(),
					'strong' => array(),
					'i'      => array(),
					'em'     => array(),
					'a'      => array( 'href' => true ),
				)
			)
		);
		if ( '' === $question || '' === wp_strip_all_tags( $answer ) ) {
			return;
		}
		self::$items[] = array(
			'question' => $question,
			'answer'   => $answer,
		);
	}

	public static function print_json_ld() {
		if ( empty( self::$items ) ) {
			return;
		}
		$data = array(
			'@context'   => 'https://schema.org',
			'@type'      => 'FAQPage',
			'mainEntity' => array_map(
				function ( $i ) {
					return array(
						'@type'          => 'Question',
						'name'           => $i['question'],
						'acceptedAnswer' => array(
							'@type' => 'Answer',
							'text'  => $i['answer'],
						),
					);
				},
				self::$items
			),
		);
		// JSON_HEX_* keep "</script>" and similar sequences from ending the tag.
		$json = wp_json_encode( $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP );
		echo '<script type="application/ld+json">' . $json . "</script>\n"; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped
		self::$items = array();
	}
}
