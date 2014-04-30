<?php
/**
 * Nav Walkers
 * Customize the menu output for use with Foundation
 *
 * @package <%= themename %>
 */

/**
 * Navigation Menu Adjustments
 */
class _s_topbar extends Walker_Nav_Menu {

  function start_lvl(&$output, $depth = 0, $args = array() ) {
    $indent = str_repeat("\t", $depth);
    $output .= "\n$indent<ul class=\"dropdown\">\n";
  }

  function display_element( $element, &$children_elements, $max_depth, $depth=0, $args, &$output ) {
    $id_field = $this->db_fields['id'];
      if ( !empty( $children_elements[ $element->$id_field ] ) ) {
        $element->classes[] = 'has-dropdown';
      }
    Walker_Nav_Menu::display_element( $element, $children_elements, $max_depth, $depth, $args, $output );
  }
}