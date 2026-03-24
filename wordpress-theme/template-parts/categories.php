<?php
/**
 * Categories Section Template
 * 
 * @package Shayari_World
 */

$categories = get_terms(array(
    'taxonomy' => 'shayari_category',
    'hide_empty' => false,
));
?>

<section class="categories-section" id="categories">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title"><?php echo esc_html__('Shayari Categories', 'shayari-world'); ?></h2>
            <p class="section-subtitle"><?php echo esc_html__('Find the perfect words for every emotion and occasion', 'shayari-world'); ?></p>
        </div>

        <div class="categories-grid">
            <?php if ($categories && !is_wp_error($categories)) : ?>
                <?php foreach ($categories as $category) : 
                    $category_image = get_term_meta($category->term_id, 'category_image', true);
                    $category_slug = $category->slug;
                    ?>
                    <a href="<?php echo esc_url(get_term_link($category)); ?>" class="category-card">
                        <div class="category-image">
                            <?php if ($category_image) : ?>
                                <img src="<?php echo esc_url($category_image); ?>" alt="<?php echo esc_attr($category->name); ?>">
                            <?php else : ?>
                                <img src="<?php echo esc_url(get_template_directory_uri() . '/assets/images/default-category.jpg'); ?>" alt="<?php echo esc_attr($category->name); ?>">
                            <?php endif; ?>
                            <div class="category-overlay"></div>
                        </div>
                        <div class="category-content">
                            <h3 class="category-name"><?php echo esc_html($category->name); ?></h3>
                            <span class="category-count"><?php echo esc_html($category->count); ?> <?php echo esc_html__('Shayaris', 'shayari-world'); ?></span>
                        </div>
                    </a>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>

        <div class="section-footer">
            <a href="<?php echo esc_url(home_url('/shayari')); ?>" class="btn btn-outline">
                <?php echo esc_html__('View All Categories', 'shayari-world'); ?>
            </a>
        </div>
    </div>
</section>
