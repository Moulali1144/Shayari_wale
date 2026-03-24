<?php
/**
 * Hero Section Template
 * 
 * @package Shayari_World
 */
?>

<section class="hero-section">
    <div class="hero-bg"></div>
    <div class="container">
        <div class="hero-content">
            <h1 class="hero-title animate-fade-in">
                <?php echo esc_html__('Where Words Paint Emotions', 'shayari-world'); ?>
            </h1>
            <p class="hero-subtitle animate-fade-in-delay">
                <?php echo esc_html__('Discover 1300+ beautiful Shayaris in every category. From love to longing, joy to sorrow - find shayari that speaks to your soul.', 'shayari-world'); ?>
            </p>
            <div class="hero-buttons animate-fade-in-delay-2">
                <a href="#shayaris" class="btn btn-primary">
                    <span><?php echo esc_html__('Explore Shayari', 'shayari-world'); ?></span>
                    <svg class="btn-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M9 18l6-6-6-6"/>
                    </svg>
                </a>
                <a href="#submit" class="btn btn-secondary">
                    <span><?php echo esc_html__('Submit Your Own', 'shayari-world'); ?></span>
                </a>
            </div>
            <div class="hero-stats animate-fade-in-delay-3">
                <div class="stat-item">
                    <span class="stat-number">1300+</span>
                    <span class="stat-label"><?php echo esc_html__('Shayaris', 'shayari-world'); ?></span>
                </div>
                <div class="stat-divider">|</div>
                <div class="stat-item">
                    <span class="stat-number">13</span>
                    <span class="stat-label"><?php echo esc_html__('Categories', 'shayari-world'); ?></span>
                </div>
                <div class="stat-divider">|</div>
                <div class="stat-item">
                    <span class="stat-number">1M+</span>
                    <span class="stat-label"><?php echo esc_html__('Readers', 'shayari-world'); ?></span>
                </div>
            </div>
        </div>
    </div>
</section>
