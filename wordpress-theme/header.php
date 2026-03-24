<?php
/**
 * Header Template
 * 
 * @package Shayari_World
 */
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header" id="site-header">
    <nav class="navbar">
        <div class="container">
            <div class="nav-wrapper">
                <!-- Logo -->
                <div class="logo">
                    <a href="<?php echo esc_url(home_url('/')); ?>">
                        <span class="logo-icon">✨</span>
                        <span class="logo-text"><?php bloginfo('name'); ?></span>
                    </a>
                </div>

                <!-- Desktop Navigation -->
                <div class="nav-links desktop-nav">
                    <?php
                    wp_nav_menu(array(
                        'theme_location' => 'primary',
                        'container' => false,
                        'menu_class' => 'nav-menu',
                        'fallback_cb' => 'shayari_default_menu',
                    ));
                    ?>
                </div>

                <!-- Language Selector -->
                <div class="language-selector">
                    <button class="lang-btn" data-lang="en">EN</button>
                    <button class="lang-btn" data-lang="hi">HI</button>
                    <button class="lang-btn" data-lang="te">TE</button>
                    <button class="lang-btn" data-lang="ta">TA</button>
                    <button class="lang-btn" data-lang="gu">GU</button>
                    <button class="lang-btn" data-lang="mr">MA</button>
                </div>

                <!-- Mobile Menu Toggle -->
                <button class="mobile-menu-toggle" id="mobile-menu-toggle">
                    <span class="hamburger"></span>
                </button>
            </div>

            <!-- Mobile Navigation -->
            <div class="mobile-nav" id="mobile-nav">
                <?php
                wp_nav_menu(array(
                    'theme_location' => 'primary',
                    'container' => false,
                    'menu_class' => 'mobile-menu',
                    'fallback_cb' => 'shayari_default_menu',
                ));
                ?>
            </div>
        </div>
    </nav>
</header>

<?php
// Default menu fallback
function shayari_default_menu() {
    echo '<ul class="nav-menu">';
    echo '<li><a href="' . esc_url(home_url('/')) . '">Home</a></li>';
    echo '<li><a href="' . esc_url(home_url('/shayari')) . '">Categories</a></li>';
    echo '<li><a href="#submit">Submit Shayari</a></li>';
    echo '<li><a href="#contact">Contact</a></li>';
    echo '</ul>';
}
