<?php
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * ----------------------------------------
 * 1. Attributes Filter
 * ----------------------------------------
 */
$attributes = apply_filters(
	'bw_slider_block_attributes',
	$attributes,
	$content
);

$slides                = $attributes['slides'] ?? [];
$showTitle             = $attributes['showTitle'] ?? true;
$showDescription       = $attributes['showDescription'] ?? true;
$showSubtitle          = $attributes['showSubtitle'] ?? true;
$showPrimaryButtons    = $attributes['showPrimaryButtons'] ?? true;
$showSecondaryButtons  = $attributes['showSecondaryButtons'] ?? false;
$interval              = $attributes['interval'] ?? 3000;
$showIndicators        = $attributes['showIndicators'] ?? true;
$showControls          = $attributes['showControls'] ?? true;
$slideEffect           = $attributes['slideEffect'] ?? 'slide';

/**
 * Optional options added after the first release. Each default reproduces the
 * earlier output, and every value is validated before it reaches the markup.
 */
$kb_bool = static function ( $key ) use ( $attributes ) {
	return ! array_key_exists( $key, $attributes ) || rest_sanitize_boolean( $attributes[ $key ] );
};
$kb_num = static function ( $key, $min, $max ) use ( $attributes ) {
	$value = $attributes[ $key ] ?? null;
	if ( '' === $value || null === $value || ! is_numeric( $value ) ) {
		return null;
	}
	return (int) round( max( $min, min( $max, (float) $value ) ) );
};

$autoplay      = $kb_bool( 'autoplay' );
$pause_hover   = $kb_bool( 'pauseOnHover' );
$loop          = $kb_bool( 'loop' );
$touch         = $kb_bool( 'touch' );
$control_theme = ( $attributes['controlTheme'] ?? '' ) === 'dark' ? 'dark' : 'light';
$speed         = $kb_num( 'transitionSpeed', 100, 3000 );
$image_height  = $kb_num( 'imageHeight', 100, 1200 );
$image_fit     = in_array( $attributes['imageFit'] ?? '', array( 'cover', 'contain' ), true ) ? $attributes['imageFit'] : '';
$thumbnails    = ! empty( $attributes['showThumbnails'] );
$vertical      = ( $attributes['direction'] ?? '' ) === 'vertical';
$caption_align = in_array( $attributes['captionAlign'] ?? '', array( 'left', 'right' ), true ) ? $attributes['captionAlign'] : '';

$extra_classes = '';
$extra_style   = '';
$extra_data    = '';

if ( 'dark' === $control_theme ) {
	$extra_classes .= ' kb-carousel--dark';
}
if ( $vertical ) {
	$extra_classes .= ' kb-carousel--vertical';
}
if ( $caption_align ) {
	$extra_classes .= ' kb-carousel--cap-' . $caption_align;
}
if ( null !== $speed ) {
	$extra_classes .= ' kb-carousel--speed';
	$extra_style   .= '--kb-car-speed:' . $speed . 'ms;';
}
if ( null !== $image_height ) {
	$extra_classes .= ' kb-carousel--img-h';
	$extra_style   .= '--kb-car-h:' . $image_height . 'px;';
}
if ( $image_fit ) {
	$extra_style .= '--kb-car-fit:' . $image_fit . ';';
}
if ( ! $pause_hover ) {
	$extra_data .= ' data-bs-pause="false"';
}
if ( ! $loop ) {
	$extra_data .= ' data-bs-wrap="false"';
}
if ( ! $touch ) {
	$extra_data .= ' data-bs-touch="false"';
}
if ( '' !== $extra_style ) {
	$extra_data .= ' style="' . esc_attr( $extra_style ) . '"';
}

/**
 * ----------------------------------------
 * 2. Slides Filter
 * ----------------------------------------
 */
$slides = apply_filters(
	'bw_slider_slides',
	$slides,
	$attributes
);

/**
 * ----------------------------------------
 * 3. Carousel Classes
 * ----------------------------------------
 */
$carousel_class = 'carousel slide';

if ($slideEffect === 'fade') {
	$carousel_class .= ' carousel-fade';
}

$carousel_class .= $extra_classes;

$carousel_class = apply_filters(
	'bw_slider_carousel_class',
	$carousel_class,
	$attributes
);

/**
 * ----------------------------------------
 * 4. Slide Count (Indicators)
 * ----------------------------------------
 */
$blocks = parse_blocks($content);
$slide_count = count($blocks);

/**
 * ----------------------------------------
 * 5. Unique ID
 * ----------------------------------------
 */
$slider_id = apply_filters(
	'bw_slider_id',
	'slider-' . uniqid(),
	$attributes
);


/**
 * Optional thumbnail strip, built here so the default markup is untouched.
 * Bootstrap marks the active thumbnail because it sits in .carousel-indicators.
 */
$thumbs_html = '';
if ( $thumbnails && ! empty( $slides ) ) {
	$thumbs_html .= '<div class="carousel-indicators kb-carousel-thumbs">';
	foreach ( array_values( $slides ) as $thumb_index => $thumb_slide ) {
		$thumbs_html .= sprintf(
			'<button type="button" data-bs-target="#%s" data-bs-slide-to="%d" aria-label="%s"%s><img src="%s" alt=""></button>',
			esc_attr( $slider_id ),
			$thumb_index,
			esc_attr( sprintf( 'Go to slide %d', $thumb_index + 1 ) ),
			0 === $thumb_index ? ' class="active"' : '',
			esc_url( $thumb_slide['image'] ?? '' )
		);
	}
	$thumbs_html .= '</div>';
}

/**
 * ----------------------------------------
 * 6. Start Output Buffer
 * ----------------------------------------
 */
ob_start();
?>

<div id="<?php echo esc_attr($slider_id); ?>"
	class="<?php echo esc_attr($carousel_class); ?>"<?php echo $autoplay ? "\n\tdata-bs-ride=\"carousel\"" : ''; ?>
	data-bs-interval="<?php echo esc_attr($interval); ?>"<?php echo $extra_data; // Built above from validated values. ?>>

	<?php do_action('bw_slider_before_inner', $attributes); ?>

	<div class="carousel-inner">

		<?php foreach ($slides as $index => $slide):

			/**
			 * ----------------------------------------
			 * 7. Single Slide Filter
			 * ----------------------------------------
			 */
			$slide = apply_filters(
				'bw_slider_single_slide',
				$slide,
				$index,
				$attributes
			);

			ob_start();
		?>

		<div class="carousel-item <?php echo $index === 0 ? 'active' : ''; ?>">

			<?php do_action('bw_slider_before_slide', $slide, $index, $attributes); ?>

			<img src="<?php echo esc_attr($slide['image'] ?? ''); ?>" alt="<?php echo esc_attr($slide['alt'] ?? ''); ?>">

			<div class="carousel-caption d-none d-md-block">

				<?php if ($showTitle && !empty($slide['title'])): ?>
					<h2 class="bw-slider-title">
						<?php echo esc_html($slide['title']); ?>
					</h2>
				<?php endif; ?>

				<?php if ($showSubtitle && !empty($slide['subtitle'])): ?>
					<h5 class="bw-slider-subtitle">
						<?php echo esc_html($slide['subtitle']); ?>
					</h5>
				<?php endif; ?>

				<?php if ($showDescription && !empty($slide['description'])): ?>
					<p class="bw-slider-description">
						<?php echo esc_html($slide['description']); ?>
					</p>
				<?php endif; ?>

				<?php
				/**
				 * ----------------------------------------
				 * 8. Primary Button
				 * ----------------------------------------
				 */
				if ($showPrimaryButtons && !empty($slide['btn1Url']) && !empty($slide['btn1Text'])) {

					$primary_btn = sprintf(
						'<a class="btn btn-primary" href="%s">%s</a>',
						esc_url($slide['btn1Url']),
						esc_html($slide['btn1Text'])
					);

					echo wp_kses_post( apply_filters(
						'bw_slider_primary_button',
						$primary_btn,
						$slide,
						$attributes
					) );
				}

				/**
				 * ----------------------------------------
				 * 9. Secondary Button
				 * ----------------------------------------
				 */
				if ($showSecondaryButtons && !empty($slide['btn2Url']) && !empty($slide['btn2Text'])) {

					$secondary_btn = sprintf(
						'<a class="btn btn-secondary" href="%s">%s</a>',
						esc_url($slide['btn2Url']),
						esc_html($slide['btn2Text'])
					);

					echo wp_kses_post( apply_filters(
						'bw_slider_secondary_button',
						$secondary_btn,
						$slide,
						$attributes
					)) ;
				}
				?>

			</div>

			<?php do_action('bw_slider_after_slide', $slide, $index, $attributes); ?>

		</div>

		<?php
			/**
			 * ----------------------------------------
			 * 10. Slide HTML Filter
			 * ----------------------------------------
			 */
			$slide_html = ob_get_clean();

			echo wp_kses_post( apply_filters(
				'bw_slider_slide_html',
				$slide_html,
				$slide,
				$index,
				$attributes
			));

		endforeach; ?>

	</div>

	<?php do_action('bw_slider_after_inner', $attributes); echo $thumbs_html; // Built above from escaped values. ?>

	<?php if ($showControls): ?>
		<button class="carousel-control-prev"
			type="button"
			data-bs-target="#<?php echo esc_attr($slider_id); ?>"
			data-bs-slide="prev">
			<span class="carousel-control-prev-icon"></span>
		</button>

		<button class="carousel-control-next"
			type="button"
			data-bs-target="#<?php echo esc_attr($slider_id); ?>"
			data-bs-slide="next">
			<span class="carousel-control-next-icon"></span>
		</button>
	<?php endif; ?>

	<?php if ($showIndicators && $slide_count > 0): ?>
		<div class="carousel-indicators">
			<?php for ($i = 0; $i < $slide_count; $i++): ?>
				<button
					type="button"
					data-bs-target="#<?php echo esc_attr($slider_id); ?>"
					data-bs-slide-to="<?php echo esc_attr($i); ?>"
					class="<?php echo $i === 0 ? 'active' : ''; ?>">
				</button>
			<?php endfor; ?>
		</div>
	<?php endif; ?>

</div>

<?php
/**
 * ----------------------------------------
 * 11. Final Output Filter
 * ----------------------------------------
 */
$html = ob_get_clean();

echo wp_kses_post( apply_filters(
	'bw_slider_output',
	$html,
	$attributes,
	$slides
));
