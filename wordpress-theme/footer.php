<?php
/**
 * Footer Template
 * 
 * @package Shayari_World
 */
?>

<footer class="site-footer">
    <div class="container">
        <div class="footer-content">
            <!-- About Section -->
            <div class="footer-col">
                <div class="footer-logo">
                    <span class="logo-icon">✨</span>
                    <span class="logo-text"><?php bloginfo('name'); ?></span>
                </div>
                <p class="footer-description">
                    <?php echo esc_html__('Celebrating the art of poetry across languages and cultures.', 'shayari-world'); ?>
                </p>
                <div class="social-links">
                    <a href="#" class="social-link" aria-label="Facebook"><i class="icon-facebook"></i></a>
                    <a href="#" class="social-link" aria-label="Twitter"><i class="icon-twitter"></i></a>
                    <a href="#" class="social-link" aria-label="Instagram"><i class="icon-instagram"></i></a>
                    <a href="#" class="social-link" aria-label="YouTube"><i class="icon-youtube"></i></a>
                </div>
            </div>

            <!-- Quick Links -->
            <div class="footer-col">
                <h3><?php echo esc_html__('Quick Links', 'shayari-world'); ?></h3>
                <ul class="footer-links">
                    <li><a href="<?php echo esc_url(home_url('/')); ?>"><?php echo esc_html__('Home', 'shayari-world'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/shayari')); ?>"><?php echo esc_html__('Categories', 'shayari-world'); ?></a></li>
                    <li><a href="#submit"><?php echo esc_html__('Submit Shayari', 'shayari-world'); ?></a></li>
                    <li><a href="#about"><?php echo esc_html__('About Us', 'shayari-world'); ?></a></li>
                </ul>
            </div>

            <!-- Legal -->
            <div class="footer-col">
                <h3><?php echo esc_html__('Legal', 'shayari-world'); ?></h3>
                <ul class="footer-links">
                    <li><a href="<?php echo esc_url(home_url('/privacy-policy')); ?>"><?php echo esc_html__('Privacy Policy', 'shayari-world'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/terms-of-service')); ?>"><?php echo esc_html__('Terms of Service', 'shayari-world'); ?></a></li>
                    <li><a href="<?php echo esc_url(home_url('/content-guidelines')); ?>"><?php echo esc_html__('Content Guidelines', 'shayari-world'); ?></a></li>
                </ul>
            </div>

            <!-- Connect -->
            <div class="footer-col">
                <h3><?php echo esc_html__('Connect With Us', 'shayari-world'); ?></h3>
                <p><?php echo esc_html__('Stay updated with the latest Shayaris', 'shayari-world'); ?></p>
                <form class="newsletter-form" id="newsletter-form">
                    <input type="email" placeholder="<?php echo esc_attr__('Your email', 'shayari-world'); ?>" required>
                    <button type="submit"><?php echo esc_html__('Subscribe', 'shayari-world'); ?></button>
                </form>
            </div>
        </div>

        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. <?php echo esc_html__('All rights reserved.', 'shayari-world'); ?></p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
