<?php
/**
 * Submit Section Template
 * 
 * @package Shayari_World
 */
?>

<section class="submit-section" id="submit">
    <div class="container">
        <div class="submit-content">
            <div class="submit-header">
                <h2 class="section-title"><?php echo esc_html__('Share Your Words With The World', 'shayari-world'); ?></h2>
                <p class="section-subtitle">
                    <?php echo esc_html__('Have a shayari that speaks to the heart? Submit your original poetry and join our community of wordsmiths. Every verse matters, every voice deserves to be heard.', 'shayari-world'); ?>
                </p>
            </div>

            <form id="submit-shayari-form" class="submit-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="submit-name"><?php echo esc_html__('Name', 'shayari-world'); ?></label>
                        <input type="text" id="submit-name" name="name" required>
                    </div>
                    
                    <div class="form-group">
                        <label for="submit-email"><?php echo esc_html__('Email', 'shayari-world'); ?></label>
                        <input type="email" id="submit-email" name="email" required>
                    </div>
                </div>

                <div class="form-row">
                    <div class="form-group">
                        <label for="submit-category"><?php echo esc_html__('Category', 'shayari-world'); ?></label>
                        <select id="submit-category" name="category" required>
                            <option value=""><?php echo esc_html__('Select a category', 'shayari-world'); ?></option>
                            <?php
                            $categories = get_terms(array(
                                'taxonomy' => 'shayari_category',
                                'hide_empty' => false,
                            ));
                            
                            if ($categories && !is_wp_error($categories)) :
                                foreach ($categories as $category) :
                                    ?>
                                    <option value="<?php echo esc_attr($category->slug); ?>">
                                        <?php echo esc_html($category->name); ?>
                                    </option>
                                    <?php
                                endforeach;
                            endif;
                            ?>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="submit-language"><?php echo esc_html__('Language', 'shayari-world'); ?></label>
                        <select id="submit-language" name="language" required>
                            <option value=""><?php echo esc_html__('Select language', 'shayari-world'); ?></option>
                            <option value="en">English</option>
                            <option value="hi">हिंदी (Hindi)</option>
                            <option value="te">తెలుగు (Telugu)</option>
                            <option value="gu">ગુજરાતી (Gujarati)</option>
                            <option value="mr">मराठी (Marathi)</option>
                            <option value="ta">தமிழ் (Tamil)</option>
                        </select>
                    </div>
                </div>

                <div class="form-group">
                    <label for="submit-shayari"><?php echo esc_html__('Your Shayari', 'shayari-world'); ?></label>
                    <textarea id="submit-shayari" name="shayari" rows="6" required></textarea>
                </div>

                <button type="submit" class="btn btn-primary btn-submit">
                    <?php echo esc_html__('Submit Your Shayari', 'shayari-world'); ?>
                </button>
            </form>

            <!-- Stats -->
            <div class="submit-stats">
                <div class="stat-card">
                    <div class="stat-number">
                        <?php
                        $total_submissions = wp_count_posts('shayari')->publish;
                        echo esc_html($total_submissions);
                        ?>
                    </div>
                    <div class="stat-label"><?php echo esc_html__('Submissions Received', 'shayari-world'); ?></div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-number">
                        <?php
                        $published = wp_count_posts('shayari')->publish;
                        echo esc_html($published);
                        ?>
                    </div>
                    <div class="stat-label"><?php echo esc_html__('Published', 'shayari-world'); ?></div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-number">50+</div>
                    <div class="stat-label"><?php echo esc_html__('Daily Submissions', 'shayari-world'); ?></div>
                </div>
            </div>
        </div>
    </div>
</section>
