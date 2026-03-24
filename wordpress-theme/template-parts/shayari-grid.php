<?php
/**
 * Shayari Grid Template
 * 
 * @package Shayari_World
 */

$paged = (get_query_var('paged')) ? get_query_var('paged') : 1;

$args = array(
    'post_type' => 'shayari',
    'posts_per_page' => 12,
    'paged' => $paged,
    'post_status' => 'publish',
    'orderby' => 'date',
    'order' => 'DESC',
);

$shayari_query = new WP_Query($args);
?>

<section class="shayari-section" id="shayaris">
    <div class="container">
        <div class="section-header">
            <h2 class="section-title"><?php echo esc_html__('Featured Shayari', 'shayari-world'); ?></h2>
            
            <!-- Search Bar -->
            <div class="search-bar">
                <input type="text" id="shayari-search" placeholder="<?php echo esc_attr__('Search Shayari...', 'shayari-world'); ?>">
                <button type="button" class="search-btn">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.35-4.35"></path>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Category Filter -->
        <div class="filter-bar">
            <button class="filter-btn active" data-category="all"><?php echo esc_html__('All', 'shayari-world'); ?></button>
            <?php
            $categories = get_terms(array(
                'taxonomy' => 'shayari_category',
                'hide_empty' => true,
            ));
            
            if ($categories && !is_wp_error($categories)) :
                foreach ($categories as $category) :
                    ?>
                    <button class="filter-btn" data-category="<?php echo esc_attr($category->slug); ?>">
                        <?php echo esc_html($category->name); ?>
                    </button>
                    <?php
                endforeach;
            endif;
            ?>
        </div>

        <!-- Shayari Grid -->
        <div class="shayari-grid" id="shayari-grid">
            <?php if ($shayari_query->have_posts()) : ?>
                <?php while ($shayari_query->have_posts()) : $shayari_query->the_post(); ?>
                    <?php get_template_part('template-parts/shayari-card'); ?>
                <?php endwhile; ?>
            <?php else : ?>
                <p class="no-results"><?php echo esc_html__('No Shayari found. Try a different search.', 'shayari-world'); ?></p>
            <?php endif; ?>
        </div>

        <!-- Pagination -->
        <?php if ($shayari_query->max_num_pages > 1) : ?>
            <div class="pagination">
                <?php
                echo paginate_links(array(
                    'total' => $shayari_query->max_num_pages,
                    'current' => $paged,
                    'prev_text' => '&laquo;',
                    'next_text' => '&raquo;',
                ));
                ?>
            </div>
        <?php endif; ?>

        <?php wp_reset_postdata(); ?>
    </div>
</section>
