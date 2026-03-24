# Shayari World - WordPress Theme

A beautiful multilingual Shayari website theme with 1300+ shayaris in Hindi, English, Telugu, Gujarati, Marathi, and Tamil.

## Features

- ✨ 1300+ Shayaris across 13 categories
- 🌍 6 Languages: English, Hindi, Telugu, Gujarati, Marathi, Tamil
- 💝 Like system with local storage
- 📤 Share functionality
- 📥 Download shayaris as images
- ✍️ User submission system
- 🎁 Amazon voucher redemption for 500+ likes
- 📱 Fully responsive design
- 🎨 Beautiful gradient UI
- ⚡ Fast and optimized

## Installation

### Step 1: Copy Theme Files

1. Copy the `wordpress-theme` folder to your WordPress installation:
   ```
   wp-content/themes/shayari-world/
   ```

### Step 2: Copy Shayari Data

1. Copy the `shayaris.json` file from `app/public/shayaris.json` to:
   ```
   wp-content/themes/shayari-world/data/shayaris.json
   ```

### Step 3: Copy Images

1. Copy all images from `app/public/images/` to:
   ```
   wp-content/themes/shayari-world/assets/images/
   ```

### Step 4: Activate Theme

1. Go to WordPress Admin → Appearance → Themes
2. Activate "Shayari World" theme

### Step 5: Import Data

1. Access the import script:
   ```
   yoursite.com/wp-content/themes/shayari-world/import-shayaris.php
   ```
   
2. Wait for the import to complete (this may take a few minutes)

### Step 6: Configure Permalinks

1. Go to Settings → Permalinks
2. Select "Post name" structure
3. Save changes

## Theme Structure

```
shayari-world/
├── assets/
│   ├── css/
│   │   └── main.css          # Main stylesheet
│   ├── js/
│   │   └── main.js           # Main JavaScript
│   └── images/               # Theme images
├── template-parts/
│   ├── hero.php              # Hero section
│   ├── categories.php        # Categories grid
│   ├── shayari-grid.php      # Shayari listing
│   ├── shayari-card.php      # Individual shayari card
│   └── submit-section.php    # Submission form
├── data/
│   └── shayaris.json         # Shayari data (copy from app)
├── functions.php             # Theme functions
├── header.php                # Header template
├── footer.php                # Footer template
├── index.php                 # Main template
├── style.css                 # Theme info
├── import-shayaris.php       # Data import script
└── README.md                 # This file
```

## Custom Post Types

### Shayari
- Post Type: `shayari`
- Taxonomy: `shayari_category`
- Meta Fields:
  - `author_name` - Author name
  - `likes` - Number of likes
  - `text_hi` - Hindi translation
  - `text_te` - Telugu translation
  - `text_gu` - Gujarati translation
  - `text_mr` - Marathi translation
  - `text_ta` - Tamil translation
  - `original_id` - Original ID from JSON
  - `is_user_submitted` - Boolean flag
  - `author_email` - Submitter email
  - `voucher_redeemed` - Boolean flag
  - `redemption_request` - Redemption data

## AJAX Endpoints

### Like Shayari
- Action: `shayari_like`
- Parameters: `shayari_id`
- Returns: Updated like count

### Submit Shayari
- Action: `shayari_submit`
- Parameters: `name`, `email`, `category`, `language`, `shayari`
- Returns: Success/error message

### Redeem Voucher
- Action: `shayari_redeem`
- Parameters: `shayari_id`, `full_name`, `phone`, `amazon_email`, `submitter_email`
- Returns: Success/error message

## Customization

### Colors
Edit CSS variables in `assets/css/main.css`:
```css
:root {
    --primary-color: #ff6b6b;
    --secondary-color: #4ecdc4;
    --accent-color: #ffe66d;
    /* ... */
}
```

### Categories
Add/edit categories in WordPress Admin → Shayaris → Categories

### Translations
Edit language strings in `functions.php` or use a translation plugin

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Performance

- Optimized CSS and JavaScript
- Lazy loading for images
- Efficient AJAX calls
- Local storage for likes
- Minimal database queries

## Security

- Nonce verification for AJAX
- Input sanitization
- Output escaping
- SQL injection prevention
- XSS protection

## Support

For issues or questions, please contact the theme developer.

## Credits

- Font: Poppins, Noto Sans (Google Fonts)
- Icons: Lucide Icons
- Framework: WordPress
- Original Design: React App (converted to WordPress)

## License

This theme is licensed under GPL v2 or later.

## Changelog

### Version 1.0.0
- Initial release
- 1300+ shayaris imported
- 13 categories
- 6 languages
- Full feature set implemented
