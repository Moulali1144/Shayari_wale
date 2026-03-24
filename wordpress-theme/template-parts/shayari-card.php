<?php
/**
 * Shayari Card Template
 * 
 * @package Shayari_World
 */

$shayari_id = get_the_ID();
$author_name = get_post_meta($shayari_id, 'author_name', true);
$likes = get_post_meta($shayari_id, 'likes', true);
$likes = $likes ? intval($likes) : 0;

// Get translations
$text_en = get_the_content();
$text_hi = get_post_meta($shayari_id, 'text_hi', true);
$text_te = get_post_meta($shayari_id, 'text_te', true);
$text_gu = get_post_meta($shayari_id, 'text_gu', true);
$text_mr = get_post_meta($shayari_id, 'text_mr', true);
$text_ta = get_post_meta($shayari_id, 'text_ta', true);

// Get category
$categories = get_the_terms($shayari_id, 'shayari_category');
$category_name = $categories && !is_wp_error($categories) ? $categories[0]->name : '';
$category_slug = $categories && !is_wp_error($categories) ? $categories[0]->slug : '';

// Get featured image
$thumbnail = get_the_post_thumbnail_url($shayari_id, 'shayari-thumbnail');
if (!$thumbnail) {
    $thumbnail = get_template_directory_uri() . '/assets/images/default-shayari.jpg';
}
?>

<div class="shayari-card" 
     data-id="<?php echo esc_attr($shayari_id); ?>"
     data-category="<?php echo esc_attr($category_slug); ?>"
     data-text-en="<?php echo esc_attr($text_en); ?>"
     data-text-hi="<?php echo esc_attr($text_hi); ?>"
     data-text-te="<?php echo esc_attr($text_te); ?>"
     data-text-gu="<?php echo esc_attr($text_gu); ?>"
     data-text-mr="<?php echo esc_attr($text_mr); ?>"
     data-text-ta="<?php echo esc_attr($text_ta); ?>">
    
    <!-- Image Section -->
    <div class="card-image">
        <img src="<?php echo esc_url($thumbnail); ?>" alt="<?php echo esc_attr($category_name); ?>">
        <div class="card-overlay"></div>
        
        <!-- Category Badge -->
        <div class="card-badge">
            <span class="badge"><?php echo esc_html($category_name); ?></span>
        </div>
        
        <!-- Language Buttons -->
        <div class="card-lang-btns">
            <button class="lang-btn-small active" data-lang="en">EN</button>
            <button class="lang-btn-small" data-lang="hi">HI</button>
            <button class="lang-btn-small" data-lang="te">TE</button>
            <button class="lang-btn-small" data-lang="ta">TA</button>
            <button class="lang-btn-small" data-lang="gu">GU</button>
            <button class="lang-btn-small" data-lang="mr">MA</button>
        </div>
    </div>

    <!-- Content Section -->
    <div class="card-content">
        <div class="card-text" data-current-lang="en">
            <?php echo wp_kses_post(nl2br($text_en)); ?>
        </div>
        
        <!-- Author and Actions -->
        <div class="card-footer">
            <div class="card-author">
                <div class="author-avatar">
                    <?php echo esc_html(substr($author_name ? $author_name : 'A', 0, 1)); ?>
                </div>
                <span class="author-name"><?php echo esc_html($author_name ? $author_name : 'Anonymous'); ?></span>
            </div>
            
            <div class="card-actions">
                <button class="action-btn like-btn" data-id="<?php echo esc_attr($shayari_id); ?>">
                    <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                    </svg>
                    <span class="like-count"><?php echo esc_html($likes); ?></span>
                </button>
                
                <button class="action-btn copy-btn">
                    <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                </button>
                
                <button class="action-btn share-btn">
                    <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="18" cy="5" r="3"></circle>
                        <circle cx="6" cy="12" r="3"></circle>
                        <circle cx="18" cy="19" r="3"></circle>
                        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
                    </svg>
                </button>
                
                <button class="action-btn download-btn">
                    <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg>
                </button>
            </div>
        </div>
        
        <!-- Redeem Button for 500+ likes -->
        <?php if ($likes >= 500) : ?>
            <div class="card-redeem">
                <button class="btn btn-redeem" data-id="<?php echo esc_attr($shayari_id); ?>">
                    <svg class="icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polyline points="20 12 20 22 4 22 4 12"></polyline>
                        <rect x="2" y="7" width="20" height="5"></rect>
                        <line x1="12" y1="22" x2="12" y2="7"></line>
                        <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
                        <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
                    </svg>
                    <?php echo esc_html__('Redeem Voucher', 'shayari-world'); ?>
                </button>
            </div>
        <?php endif; ?>
    </div>
</div>
