/**
 * Shayari World - Main JavaScript
 * 
 * @package Shayari_World
 */

(function($) {
    'use strict';

    // Global variables
    let currentLanguage = 'en';
    let likedShayaris = new Set(JSON.parse(localStorage.getItem('likedShayaris') || '[]'));

    // Initialize on document ready
    $(document).ready(function() {
        initLanguageSelector();
        initCardLanguageButtons();
        initLikeButtons();
        initCopyButtons();
        initShareButtons();
        initDownloadButtons();
        initRedeemButtons();
        initSubmitForm();
        initSearch();
        initCategoryFilter();
        initMobileMenu();
        initScrollEffects();
    });

    /**
     * Language Selector
     */
    function initLanguageSelector() {
        $('.lang-btn').on('click', function() {
            const lang = $(this).data('lang');
            currentLanguage = lang;
            
            $('.lang-btn').removeClass('active');
            $(this).addClass('active');
            
            // Update all cards to new language
            $('.shayari-card').each(function() {
                updateCardLanguage($(this), lang);
            });
        });
    }

    /**
     * Card Language Buttons
     */
    function initCardLanguageButtons() {
        $('.lang-btn-small').on('click', function(e) {
            e.stopPropagation();
            const card = $(this).closest('.shayari-card');
            const lang = $(this).data('lang');
            
            card.find('.lang-btn-small').removeClass('active');
            $(this).addClass('active');
            
            updateCardLanguage(card, lang);
        });
    }

    /**
     * Update Card Language
     */
    function updateCardLanguage(card, lang) {
        const textKey = 'text-' + lang;
        const text = card.data(textKey);
        
        if (text) {
            card.find('.card-text')
                .fadeOut(200, function() {
                    $(this).html(text.replace(/\n/g, '<br>')).fadeIn(200);
                })
                .attr('data-current-lang', lang);
        }
    }

    /**
     * Like Buttons
     */
    function initLikeButtons() {
        $('.like-btn').on('click', function() {
            const btn = $(this);
            const shayariId = btn.data('id');
            
            if (likedShayaris.has(shayariId.toString())) {
                showNotification('You already liked this Shayari!', 'info');
                return;
            }
            
            $.ajax({
                url: shayariData.ajaxurl,
                type: 'POST',
                data: {
                    action: 'shayari_like',
                    nonce: shayariData.nonce,
                    shayari_id: shayariId
                },
                success: function(response) {
                    if (response.success) {
                        btn.addClass('liked');
                        btn.find('.like-count').text(response.data.likes);
                        likedShayaris.add(shayariId.toString());
                        localStorage.setItem('likedShayaris', JSON.stringify([...likedShayaris]));
                        showNotification('Liked!', 'success');
                    }
                },
                error: function() {
                    showNotification('Failed to like. Please try again.', 'error');
                }
            });
        });
        
        // Mark already liked shayaris
        $('.like-btn').each(function() {
            const shayariId = $(this).data('id');
            if (likedShayaris.has(shayariId.toString())) {
                $(this).addClass('liked');
            }
        });
    }

    /**
     * Copy Buttons
     */
    function initCopyButtons() {
        $('.copy-btn').on('click', function() {
            const card = $(this).closest('.shayari-card');
            const text = card.find('.card-text').text();
            
            copyToClipboard(text);
            showNotification('Copied to clipboard!', 'success');
        });
    }

    /**
     * Share Buttons
     */
    function initShareButtons() {
        $('.share-btn').on('click', function() {
            const card = $(this).closest('.shayari-card');
            const text = card.find('.card-text').text();
            const url = window.location.href;
            
            if (navigator.share) {
                navigator.share({
                    title: 'Shayari',
                    text: text,
                    url: url
                }).catch(() => {});
            } else {
                copyToClipboard(text + '\n\n' + url);
                showNotification('Link copied! Share it with your friends.', 'success');
            }
        });
    }

    /**
     * Download Buttons
     */
    function initDownloadButtons() {
        $('.download-btn').on('click', function() {
            const card = $(this).closest('.shayari-card');
            const text = card.find('.card-text').text();
            const category = card.data('category');
            
            downloadAsImage(text, category);
        });
    }

    /**
     * Redeem Buttons
     */
    function initRedeemButtons() {
        $('.btn-redeem').on('click', function() {
            const shayariId = $(this).data('id');
            showRedeemDialog(shayariId);
        });
    }

    /**
     * Submit Form
     */
    function initSubmitForm() {
        $('#submit-shayari-form').on('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                action: 'shayari_submit',
                nonce: shayariData.nonce,
                name: $('#submit-name').val(),
                email: $('#submit-email').val(),
                category: $('#submit-category').val(),
                language: $('#submit-language').val(),
                shayari: $('#submit-shayari').val()
            };
            
            $.ajax({
                url: shayariData.ajaxurl,
                type: 'POST',
                data: formData,
                beforeSend: function() {
                    $('.btn-submit').prop('disabled', true).text('Submitting...');
                },
                success: function(response) {
                    if (response.success) {
                        showNotification('Shayari submitted successfully! It will be reviewed and published soon.', 'success');
                        $('#submit-shayari-form')[0].reset();
                    } else {
                        showNotification(response.data.message || 'Failed to submit. Please try again.', 'error');
                    }
                },
                error: function() {
                    showNotification('Failed to submit. Please try again.', 'error');
                },
                complete: function() {
                    $('.btn-submit').prop('disabled', false).text('Submit Your Shayari');
                }
            });
        });
    }

    /**
     * Search Functionality
     */
    function initSearch() {
        let searchTimeout;
        
        $('#shayari-search').on('input', function() {
            clearTimeout(searchTimeout);
            const query = $(this).val().toLowerCase();
            
            searchTimeout = setTimeout(function() {
                $('.shayari-card').each(function() {
                    const text = $(this).find('.card-text').text().toLowerCase();
                    const category = $(this).data('category').toLowerCase();
                    
                    if (text.includes(query) || category.includes(query)) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }, 300);
        });
    }

    /**
     * Category Filter
     */
    function initCategoryFilter() {
        $('.filter-btn').on('click', function() {
            const category = $(this).data('category');
            
            $('.filter-btn').removeClass('active');
            $(this).addClass('active');
            
            if (category === 'all') {
                $('.shayari-card').show();
            } else {
                $('.shayari-card').each(function() {
                    if ($(this).data('category') === category) {
                        $(this).show();
                    } else {
                        $(this).hide();
                    }
                });
            }
        });
    }

    /**
     * Mobile Menu
     */
    function initMobileMenu() {
        $('#mobile-menu-toggle').on('click', function() {
            $(this).toggleClass('active');
            $('#mobile-nav').slideToggle();
        });
    }

    /**
     * Scroll Effects
     */
    function initScrollEffects() {
        $(window).on('scroll', function() {
            const scrollTop = $(window).scrollTop();
            
            // Header shadow on scroll
            if (scrollTop > 50) {
                $('.site-header').addClass('scrolled');
            } else {
                $('.site-header').removeClass('scrolled');
            }
        });
    }

    /**
     * Show Redeem Dialog
     */
    function showRedeemDialog(shayariId) {
        const html = `
            <div class="modal-overlay" id="redeem-modal">
                <div class="modal-content">
                    <button class="modal-close">&times;</button>
                    <h2>Redeem Amazon Voucher</h2>
                    <p>Enter your details to redeem your ₹500 Amazon voucher</p>
                    <form id="redeem-form">
                        <input type="hidden" name="shayari_id" value="${shayariId}">
                        <div class="form-group">
                            <label>Full Name</label>
                            <input type="text" name="full_name" required>
                        </div>
                        <div class="form-group">
                            <label>Phone Number</label>
                            <input type="tel" name="phone" required>
                        </div>
                        <div class="form-group">
                            <label>Amazon Account Email</label>
                            <input type="email" name="amazon_email" required>
                        </div>
                        <div class="form-group">
                            <label>Submitter Email (for verification)</label>
                            <input type="email" name="submitter_email" required>
                        </div>
                        <button type="submit" class="btn btn-primary">Submit Request</button>
                    </form>
                </div>
            </div>
        `;
        
        $('body').append(html);
        
        $('#redeem-modal .modal-close').on('click', function() {
            $('#redeem-modal').remove();
        });
        
        $('#redeem-form').on('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                action: 'shayari_redeem',
                nonce: shayariData.nonce,
                shayari_id: shayariId,
                full_name: $('[name="full_name"]').val(),
                phone: $('[name="phone"]').val(),
                amazon_email: $('[name="amazon_email"]').val(),
                submitter_email: $('[name="submitter_email"]').val()
            };
            
            $.ajax({
                url: shayariData.ajaxurl,
                type: 'POST',
                data: formData,
                success: function(response) {
                    if (response.success) {
                        showNotification(response.data.message, 'success');
                        $('#redeem-modal').remove();
                    } else {
                        showNotification(response.data.message, 'error');
                    }
                },
                error: function() {
                    showNotification('Failed to submit request. Please try again.', 'error');
                }
            });
        });
    }

    /**
     * Copy to Clipboard
     */
    function copyToClipboard(text) {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    }

    /**
     * Download as Image
     */
    function downloadAsImage(text, category) {
        // Create canvas
        const canvas = document.createElement('canvas');
        canvas.width = 800;
        canvas.height = 600;
        const ctx = canvas.getContext('2d');
        
        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, 800, 600);
        gradient.addColorStop(0, '#667eea');
        gradient.addColorStop(1, '#764ba2');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, 800, 600);
        
        // Text
        ctx.fillStyle = '#ffffff';
        ctx.font = '24px Poppins';
        ctx.textAlign = 'center';
        
        const lines = text.split('\n');
        let y = 250;
        lines.forEach(line => {
            ctx.fillText(line, 400, y);
            y += 40;
        });
        
        // Watermark
        ctx.font = '16px Poppins';
        ctx.fillText('ShayariWorld.com', 400, 550);
        
        // Download
        canvas.toBlob(function(blob) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'shayari-' + Date.now() + '.png';
            a.click();
            URL.revokeObjectURL(url);
        });
    }

    /**
     * Show Notification
     */
    function showNotification(message, type = 'info') {
        const colors = {
            success: '#10b981',
            error: '#ef4444',
            info: '#3b82f6'
        };
        
        const notification = $(`
            <div class="notification" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: ${colors[type]};
                color: white;
                padding: 1rem 1.5rem;
                border-radius: 8px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                z-index: 9999;
                animation: slideIn 0.3s ease-out;
            ">
                ${message}
            </div>
        `);
        
        $('body').append(notification);
        
        setTimeout(function() {
            notification.fadeOut(function() {
                $(this).remove();
            });
        }, 3000);
    }

})(jQuery);
