<?php
/**
 * Shayari Data Import Script
 * 
 * This script imports all shayaris from the JSON file into WordPress
 * Run this once after theme activation
 * 
 * Usage: Access via WordPress admin or run via WP-CLI
 * URL: yoursite.com/wp-content/themes/shayari-world/import-shayaris.php
 * 
 * @package Shayari_World
 */

// Load WordPress
require_once('../../../wp-load.php');

// Check if user is admin
if (!current_user_can('manage_options')) {
    die('Access denied. Admin privileges required.');
}

// Path to JSON file
$json_file = dirname(__FILE__) . '/data/shayaris.json';

if (!file_exists($json_file)) {
    die('Error: shayaris.json file not found. Please copy it from app/public/shayaris.json');
}

// Read JSON file
$json_data = file_get_contents($json_file);
$shayaris = json_decode($json_data, true);

if (!$shayaris) {
    die('Error: Failed to parse JSON file.');
}

echo '<h1>Importing Shayaris...</h1>';
echo '<p>Total shayaris to import: ' . count($shayaris) . '</p>';

// Category mapping
$category_names = array(
    'ganesh' => 'Ganesh Puja',
    'goodmorning' => 'Good Morning',
    'birthday' => 'Birthday',
    'attitude' => 'Attitude',
    'marriagefunny' => 'Marriage Funny',
    'motivation' => 'Motivation',
    'breakup' => 'Breakup',
    'friendship' => 'Friendship',
    'marriageanniversary' => 'Marriage Anniversary',
    'sad' => 'Sad',
    'islamic' => 'Islamic',
    'durgapuja' => 'Durga Puja',
    'romantic' => 'Romantic'
);

// Create categories first
echo '<h2>Creating Categories...</h2>';
$created_categories = array();

foreach ($category_names as $slug => $name) {
    $term = term_exists($slug, 'shayari_category');
    
    if (!$term) {
        $term = wp_insert_term($name, 'shayari_category', array('slug' => $slug));
        if (!is_wp_error($term)) {
            $created_categories[$slug] = $term['term_id'];
            echo '<p>✓ Created category: ' . $name . '</p>';
        }
    } else {
        $created_categories[$slug] = $term['term_id'];
        echo '<p>✓ Category exists: ' . $name . '</p>';
    }
}

// Import shayaris
echo '<h2>Importing Shayaris...</h2>';
$imported = 0;
$skipped = 0;

foreach ($shayaris as $shayari) {
    // Check if already exists
    $existing = get_posts(array(
        'post_type' => 'shayari',
        'meta_key' => 'original_id',
        'meta_value' => $shayari['id'],
        'posts_per_page' => 1
    ));
    
    if (!empty($existing)) {
        $skipped++;
        continue;
    }
    
    // Create post
    $post_data = array(
        'post_title' => 'Shayari ' . $shayari['id'],
        'post_content' => $shayari['text'],
        'post_type' => 'shayari',
        'post_status' => 'publish',
        'post_author' => 1,
    );
    
    $post_id = wp_insert_post($post_data);
    
    if ($post_id && !is_wp_error($post_id)) {
        // Add meta data
        update_post_meta($post_id, 'original_id', $shayari['id']);
        update_post_meta($post_id, 'author_name', $shayari['author']);
        update_post_meta($post_id, 'likes', $shayari['likes']);
        
        // Add translations
        if (isset($shayari['textHi'])) {
            update_post_meta($post_id, 'text_hi', $shayari['textHi']);
        }
        if (isset($shayari['textTe'])) {
            update_post_meta($post_id, 'text_te', $shayari['textTe']);
        }
        if (isset($shayari['textGu'])) {
            update_post_meta($post_id, 'text_gu', $shayari['textGu']);
        }
        if (isset($shayari['textMr'])) {
            update_post_meta($post_id, 'text_mr', $shayari['textMr']);
        }
        if (isset($shayari['textTa'])) {
            update_post_meta($post_id, 'text_ta', $shayari['textTa']);
        }
        
        // Set category
        if (isset($created_categories[$shayari['category']])) {
            wp_set_object_terms($post_id, $created_categories[$shayari['category']], 'shayari_category');
        }
        
        // Handle image
        if (isset($shayari['image'])) {
            $image_path = dirname(__FILE__) . '/assets' . $shayari['image'];
            
            if (file_exists($image_path)) {
                $upload = wp_upload_bits(basename($image_path), null, file_get_contents($image_path));
                
                if (!$upload['error']) {
                    $attachment = array(
                        'post_mime_type' => $upload['type'],
                        'post_title' => basename($image_path),
                        'post_content' => '',
                        'post_status' => 'inherit'
                    );
                    
                    $attach_id = wp_insert_attachment($attachment, $upload['file'], $post_id);
                    
                    if ($attach_id) {
                        require_once(ABSPATH . 'wp-admin/includes/image.php');
                        $attach_data = wp_generate_attachment_metadata($attach_id, $upload['file']);
                        wp_update_attachment_metadata($attach_id, $attach_data);
                        set_post_thumbnail($post_id, $attach_id);
                    }
                }
            }
        }
        
        $imported++;
        
        if ($imported % 50 == 0) {
            echo '<p>Imported ' . $imported . ' shayaris...</p>';
            flush();
        }
    }
}

echo '<h2>Import Complete!</h2>';
echo '<p>✓ Imported: ' . $imported . ' shayaris</p>';
echo '<p>✓ Skipped (already exists): ' . $skipped . ' shayaris</p>';
echo '<p><a href="' . admin_url() . '">Go to Dashboard</a></p>';
