<?php
/**
 * Shortcodes
 *
 * @package <%= themename %>
 */

add_filter('widget_text', 'do_shortcode');

// Buttons [button][/button]
function _s_buttons( $atts, $content = null ) {

	extract( shortcode_atts( array(
		'link' => '#',
		'size' => '',
		'type' => 'primary',
		'style' => ''
		), $atts ) );

	return '<a href="' . esc_attr($link) . '" class="' . esc_attr($size) . ' ' . esc_attr($style) . ' ' . esc_attr($type) . ' button">' . $content . '</a>';
}

add_shortcode( 'button', '_s_buttons' );

// Panels [panel][/panel]
function _s_panels( $atts, $content = null ) {

	extract( shortcode_atts( array(
		'type' => '',
		'style' => ''
		), $atts ) );

	return '<div class="panel ' . esc_attr($type) . ' ' . esc_attr($style) . '">' . do_shortcode($content) . '</div>';
}

add_shortcode( 'panel', '_s_panels' );