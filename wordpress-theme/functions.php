<?php
/**
 * Shayari World Theme Functions
 * 
 * @package Shayari_World
 */

// Exit if accessed directly
if (!defined('ABSPATH')) {
    exit;
}

// Theme version
define('SHAYARI_VERSION', '1.0.0');

/**
 * Theme Setup
 */
function shayari_world_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array('search-form', 'comment-form', 'comment-list', 'gallery', 'caption'));
    add_theme_support('custom-logo');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'shayari-world'),
        'footer' => __('Footer Menu', 'shayari-world'),
    ));
    
    // Add image sizes
    add_image_size('shayari-thumbnail', 400, 300, true);
    add_image_size('shayari-large', 800, 600, true);
}
add_action('after_setup_theme', 'shayari_world_setup');

/**
 * Enqueue Scripts and Styles
 */
function shayari_world_scripts() {
    // Google Fonts
    wp_enqueue_style('shayari-fonts', 'https://fonts.googleapis.com/css2?family=Great+Vibes&family=Noto+Nastaliq+Urdu:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600;700&family=Noto+Sans+Tamil:wght@400;500;600;700&family=Noto+Sans+Telugu:wght@400;500;600;700&family=Noto+Sans+Gujarati:wght@400;500;600;700&family=Poppins:wght@300;400;500;600;700&display=swap', array(), null);
    
    // Main stylesheet
    wp_enqueue_style('shayari-style', get_template_directory_uri() . '/assets/css/main.css', array(), SHAYARI_VERSION);
    
    // Main JavaScript
    wp_enqueue_script('shayari-main', get_template_directory_uri() . '/assets/js/main.js', array('jquery'), SHAYARI_VERSION, true);
    
    // Localize script
    wp_localize_script('shayari-main', 'shayariData', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('shayari_nonce'),
        'siteUrl' => get_site_url(),
    ));
}
add_action('wp_enqueue_scripts', 'shayari_world_scripts');

/**
 * Register Custom Post Type: Shayari
 */
function shayari_register_post_type() {
    $labels = array(
        'name' => __('Shayaris', 'shayari-world'),
        'singular_name' => __('Shayari', 'shayari-world'),
        'add_new' => __('Add New', 'shayari-world'),
        'add_new_item' => __('Add New Shayari', 'shayari-world'),
        'edit_item' => __('Edit Shayari', 'shayari-world'),
        'new_item' => __('New Shayari', 'shayari-world'),
        'view_item' => __('View Shayari', 'shayari-world'),
        'search_items' => __('Search Shayaris', 'shayari-world'),
        'not_found' => __('No shayaris found', 'shayari-world'),
        'not_found_in_trash' => __('No shayaris found in Trash', 'shayari-world'),
    );
    
    $args = array(
        'labels' => $labels,
        'public' => true,
        'has_archive' => true,
        'menu_icon' => 'dashicons-edit',
        'supports' => array('title', 'editor', 'thumbnail', 'custom-fields'),
        'rewrite' => array('slug' => 'shayari'),
        'show_in_rest' => true,
    );
    
    register_post_type('shayari', $args);
}
add_action('init', 'shayari_register_post_type');

/**
 * Register Taxonomy: Category
 */
function shayari_register_taxonomy() {
    $labels = array(
        'name' => __('Categories', 'shayari-world'),
        'singular_name' => __('Category', 'shayari-world'),
        'search_items' => __('Search Categories', 'shayari-world'),
        'all_items' => __('All Categories', 'shayari-world'),
        'edit_item' => __('Edit Category', 'shayari-world'),
        'update_item' => __('Update Category', 'shayari-world'),
        'add_new_item' => __('Add New Category', 'shayari-world'),
        'new_item_name' => __('New Category Name', 'shayari-world'),
        'menu_name' => __('Categories', 'shayari-world'),
    );
    
    $args = array(
        'labels' => $labels,
        'hierarchical' => true,
        'public' => true,
        'show_in_rest' => true,
        'rewrite' => array('slug' => 'category'),
    );
    
    register_taxonomy('shayari_category', 'shayari', $args);
}
add_action('init', 'shayari_register_taxonomy');

/**
 * AJAX: Like Shayari
 */
function shayari_like_ajax() {
    check_ajax_referer('shayari_nonce', 'nonce');
    
    $shayari_id = intval($_POST['shayari_id']);
    $likes = get_post_meta($shayari_id, 'likes', true);
    $likes = $likes ? intval($likes) + 1 : 1;
    
    update_post_meta($shayari_id, 'likes', $likes);
    
    wp_send_json_success(array('likes' => $likes));
}
add_action('wp_ajax_shayari_like', 'shayari_like_ajax');
add_action('wp_ajax_nopriv_shayari_like', 'shayari_like_ajax');

/**
 * AJAX: Submit Shayari
 */
function shayari_submit_ajax() {
    check_ajax_referer('shayari_nonce', 'nonce');
    
    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $category = sanitize_text_field($_POST['category']);
    $language = sanitize_text_field($_POST['language']);
    $shayari_text = sanitize_textarea_field($_POST['shayari']);
    
    // Create post
    $post_id = wp_insert_post(array(
        'post_title' => 'Shayari by ' . $name,
        'post_content' => $shayari_text,
        'post_type' => 'shayari',
        'post_status' => 'pending',
    ));
    
    if ($post_id) {
        // Add meta data
        update_post_meta($post_id, 'author_name', $name);
        update_post_meta($post_id, 'author_email', $email);
        update_post_meta($post_id, 'language', $language);
        update_post_meta($post_id, 'likes', 0);
        update_post_meta($post_id, 'is_user_submitted', true);
        
        // Set category
        wp_set_object_terms($post_id, $category, 'shayari_category');
        
        wp_send_json_success(array('message' => 'Shayari submitted successfully!'));
    } else {
        wp_send_json_error(array('message' => 'Failed to submit shayari.'));
    }
}
add_action('wp_ajax_shayari_submit', 'shayari_submit_ajax');
add_action('wp_ajax_nopriv_shayari_submit', 'shayari_submit_ajax');

/**
 * AJAX: Redeem Voucher
 */
function shayari_redeem_ajax() {
    check_ajax_referer('shayari_nonce', 'nonce');
    
    $shayari_id = intval($_POST['shayari_id']);
    $full_name = sanitize_text_field($_POST['full_name']);
    $phone = sanitize_text_field($_POST['phone']);
    $amazon_email = sanitize_email($_POST['amazon_email']);
    $submitter_email = sanitize_email($_POST['submitter_email']);
    
    // Verify email matches
    $stored_email = get_post_meta($shayari_id, 'author_email', true);
    
    if ($stored_email !== $submitter_email) {
        wp_send_json_error(array('message' => 'Email verification failed!'));
        return;
    }
    
    // Check likes
    $likes = get_post_meta($shayari_id, 'likes', true);
    if ($likes < 500) {
        wp_send_json_error(array('message' => 'Not enough likes yet!'));
        return;
    }
    
    // Check if already redeemed
    $redeemed = get_post_meta($shayari_id, 'voucher_redeemed', true);
    if ($redeemed) {
        wp_send_json_error(array('message' => 'Already redeemed!'));
        return;
    }
    
    // Store redemption request
    $redemption_data = array(
        'shayari_id' => $shayari_id,
        'full_name' => $full_name,
        'phone' => $phone,
        'amazon_email' => $amazon_email,
        'submitter_email' => $submitter_email,
        'date' => current_time('mysql'),
        'status' => 'pending',
    );
    
    add_post_meta($shayari_id, 'redemption_request', $redemption_data);
    
    wp_send_json_success(array('message' => 'Redemption request submitted!'));
}
add_action('wp_ajax_shayari_redeem', 'shayari_redeem_ajax');
add_action('wp_ajax_nopriv_shayari_redeem', 'shayari_redeem_ajax');

/**
 * Add custom meta boxes
 */
function shayari_add_meta_boxes() {
    add_meta_box(
        'shayari_translations',
        __('Translations', 'shayari-world'),
        'shayari_translations_callback',
        'shayari',
        'normal',
        'high'
    );
    
    add_meta_box(
        'shayari_details',
        __('Shayari Details', 'shayari-world'),
        'shayari_details_callback',
        'shayari',
        'side',
        'default'
    );
}
add_action('add_meta_boxes', 'shayari_add_meta_boxes');

/**
 * Translations meta box callback
 */
function shayari_translations_callback($post) {
    wp_nonce_field('shayari_translations_nonce', 'shayari_translations_nonce');
    
    $text_hi = get_post_meta($post->ID, 'text_hi', true);
    $text_te = get_post_meta($post->ID, 'text_te', true);
    $text_gu = get_post_meta($post->ID, 'text_gu', true);
    $text_mr = get_post_meta($post->ID, 'text_mr', true);
    $text_ta = get_post_meta($post->ID, 'text_ta', true);
    ?>
    <p>
        <label for="text_hi"><strong><?php _e('Hindi (हिंदी)', 'shayari-world'); ?></strong></label><br>
        <textarea id="text_hi" name="text_hi" rows="4" style="width:100%;"><?php echo esc_textarea($text_hi); ?></textarea>
    </p>
    <p>
        <label for="text_te"><strong><?php _e('Telugu (తెలుగు)', 'shayari-world'); ?></strong></label><br>
        <textarea id="text_te" name="text_te" rows="4" style="width:100%;"><?php echo esc_textarea($text_te); ?></textarea>
    </p>
    <p>
        <label for="text_gu"><strong><?php _e('Gujarati (ગુજરાતી)', 'shayari-world'); ?></strong></label><br>
        <textarea id="text_gu" name="text_gu" rows="4" style="width:100%;"><?php echo esc_textarea($text_gu); ?></textarea>
    </p>
    <p>
        <label for="text_mr"><strong><?php _e('Marathi (मराठी)', 'shayari-world'); ?></strong></label><br>
        <textarea id="text_mr" name="text_mr" rows="4" style="width:100%;"><?php echo esc_textarea($text_mr); ?></textarea>
    </p>
    <p>
        <label for="text_ta"><strong><?php _e('Tamil (தமிழ்)', 'shayari-world'); ?></strong></label><br>
        <textarea id="text_ta" name="text_ta" rows="4" style="width:100%;"><?php echo esc_textarea($text_ta); ?></textarea>
    </p>
    <?php
}

/**
 * Details meta box callback
 */
function shayari_details_callback($post) {
    wp_nonce_field('shayari_details_nonce', 'shayari_details_nonce');
    
    $author_name = get_post_meta($post->ID, 'author_name', true);
    $likes = get_post_meta($post->ID, 'likes', true);
    ?>
    <p>
        <label for="author_name"><strong><?php _e('Author Name', 'shayari-world'); ?></strong></label><br>
        <input type="text" id="author_name" name="author_name" value="<?php echo esc_attr($author_name); ?>" style="width:100%;">
    </p>
    <p>
        <label for="likes"><strong><?php _e('Likes', 'shayari-world'); ?></strong></label><br>
        <input type="number" id="likes" name="likes" value="<?php echo esc_attr($likes ? $likes : 0); ?>" style="width:100%;">
    </p>
    <?php
}

/**
 * Save meta box data
 */
function shayari_save_meta_boxes($post_id) {
    // Check nonces
    if (!isset($_POST['shayari_translations_nonce']) || !wp_verify_nonce($_POST['shayari_translations_nonce'], 'shayari_translations_nonce')) {
        return;
    }
    
    if (!isset($_POST['shayari_details_nonce']) || !wp_verify_nonce($_POST['shayari_details_nonce'], 'shayari_details_nonce')) {
        return;
    }
    
    // Check autosave
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    
    // Check permissions
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }
    
    // Save translations
    if (isset($_POST['text_hi'])) {
        update_post_meta($post_id, 'text_hi', sanitize_textarea_field($_POST['text_hi']));
    }
    if (isset($_POST['text_te'])) {
        update_post_meta($post_id, 'text_te', sanitize_textarea_field($_POST['text_te']));
    }
    if (isset($_POST['text_gu'])) {
        update_post_meta($post_id, 'text_gu', sanitize_textarea_field($_POST['text_gu']));
    }
    if (isset($_POST['text_mr'])) {
        update_post_meta($post_id, 'text_mr', sanitize_textarea_field($_POST['text_mr']));
    }
    if (isset($_POST['text_ta'])) {
        update_post_meta($post_id, 'text_ta', sanitize_textarea_field($_POST['text_ta']));
    }
    
    // Save details
    if (isset($_POST['author_name'])) {
        update_post_meta($post_id, 'author_name', sanitize_text_field($_POST['author_name']));
    }
    if (isset($_POST['likes'])) {
        update_post_meta($post_id, 'likes', intval($_POST['likes']));
    }
}
add_action('save_post_shayari', 'shayari_save_meta_boxes');
