<?php
/*
    Plugin name: Carroussel-Enseignants
    Author: Audrey Dénommée
    Plugin uri: https://github.com/OreoBambolii
    Version: 1.0.0
    Description: Permet d'afficher les informations et les photos des enseignants du TIM
*/

// Enqueue the Google Material Icons, CSS, and JS
function enqueue_profs_assets() {
    // Enqueue Google Material Icons
    wp_enqueue_style('google-material-icons', 'https://fonts.googleapis.com/icon?family=Material+Icons');
    
    $version_css = filemtime(plugin_dir_path( __FILE__ ) . "style.css"); 
    $version_js = filemtime(plugin_dir_path(__FILE__) . "js/profs.js");
    
    wp_enqueue_style('em_plugin_profs_css', plugin_dir_url(__FILE__) . "style.css", array(), $version_css);
    wp_enqueue_script('em_plugin_profs_js', plugin_dir_url(__FILE__) . "js/profs.js", array(), $version_js, true);
}
add_action('wp_enqueue_scripts', 'enqueue_profs_assets');

// Create the carousel structure
function creation_carroussel() {
    $recent_posts = wp_get_recent_posts(array(
        'numberposts' => 5,
        'post_status' => 'publish'
    ));

    $images_html = '';
    foreach($recent_posts as $post) {
        $post_id = $post['ID'];
        $featured_img_url = get_the_post_thumbnail_url($post_id, 'full');
        if($featured_img_url) {
            $images_html .= '<img src="'. $featured_img_url .'" alt="'. get_the_title($post_id) .'">';
        }
    }

    $contenu = '
    <section class="section-profs">
        <button class="btn-prev"><span class="material-icons">chevron_left</span></button>
        <div class="carroussel">
        
            <div class="images">
                ' . $images_html . '
            </div>
        </div>
        <button class="btn-next"><span class="material-icons">chevron_right</span></button>
    </section>';

    return $contenu;
}
add_shortcode('em_profs', 'creation_carroussel');
?>
