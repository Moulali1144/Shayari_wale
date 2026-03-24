<?php
/**
 * Main Template File
 * 
 * @package Shayari_World
 */

get_header();
?>

<main id="main-content" class="site-main">
    <?php get_template_part('template-parts/hero'); ?>
    <?php get_template_part('template-parts/categories'); ?>
    <?php get_template_part('template-parts/shayari-grid'); ?>
    <?php get_template_part('template-parts/submit-section'); ?>
</main>

<?php
get_footer();
