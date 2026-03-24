/**
 * Maps shayaris to local images by matching Image_Prompt from Excel
 * to image filename slugs in /public/images/shayaris/
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read Excel
const wb = XLSX.readFile('../Updated_combined_final.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

// Read all webp images
const imgDir = './public/images/shayaris';
const files = fs.readdirSync(imgDir).filter(f => f.endsWith('.webp'));

// Extract slug from filename: {num}_{slug}_{num}_{date}_result.webp
function extractSlug(filename) {
  const base = filename.replace('.webp', '');
  const parts = base.split('_');
  let dateIdx = -1;
  for (let i = parts.length - 1; i >= 0; i--) {
    if (/^\d{8}$/.test(parts[i])) { dateIdx = i; break; }
  }
  if (dateIdx === -1) return '';
  return parts.slice(1, dateIdx - 1).join('_').toLowerCase();
}

// Build slug -> sorted filenames map
const slugToFiles = {};
files.forEach(f => {
  const slug = extractSlug(f);
  if (!slugToFiles[slug]) slugToFiles[slug] = [];
  slugToFiles[slug].push(f);
});
// Sort each by row number
Object.keys(slugToFiles).forEach(s => {
  slugToFiles[s].sort((a, b) => parseInt(a.split('_')[0]) - parseInt(b.split('_')[0]));
});

// Convert prompt text to slug for matching
function promptToSlug(prompt) {
  if (!prompt) return '';
  const clean = prompt.split(',')[0].trim().toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, '_');
  return clean;
}

// Find best matching slug from available image slugs
function findBestSlug(promptSlug) {
  // Try progressively shorter prefixes
  for (let len = Math.min(promptSlug.length, 35); len >= 8; len -= 2) {
    const prefix = promptSlug.substring(0, len);
    const matches = Object.keys(slugToFiles).filter(s => s.startsWith(prefix));
    if (matches.length > 0) return matches[0];
  }
  // Try word-by-word
  const words = promptSlug.split('_');
  for (let w = Math.min(words.length, 5); w >= 2; w--) {
    const prefix = words.slice(0, w).join('_');
    const matches = Object.keys(slugToFiles).filter(s => s.startsWith(prefix));
    if (matches.length > 0) return matches[0];
  }
  return null;
}

// Category fallback slugs (when prompt doesn't match)
const categoryFallbacks = {
  'Ganesh Puja': ['devotee_offering_modak_to_gane', 'ganesh_chaturthi_festival_deco', 'lotus_flowers_and_ganesh_symbo', 'hands_folded_prayer_in_front_o', 'devotional_hands_folded_prayer', 'soft_diya_lights_around_ganesh', 'minimal_ganesh_outline_sacred', 'ganesh_temple_bells_and_incens', 'lord_ganesha_golden_idol_templ', 'traditional_ganpati_festival_s'],
  'Good Morning': ['coffee_cup_window_sunrise_cozy', 'flower_garden_morning_dew_sunl', 'golden_sunrise_sky_peaceful_mo', 'morning_tea_cup_sunlight_cozy', 'sunrise_over_mountains_calm_mo', 'sunlight_through_trees_fresh_m', 'soft_pastel_sunrise_sky_inspir', 'minimal_good_morning_quote_sun', 'city_sunrise_skyline_motivatio'],
  'Birthday': ['elegant_birthday_cake_golden_l', 'birthday_celebration_night_lig', 'birthday_gift_boxes_colorful_c', 'colorful_balloons_confetti_bir', 'birthday_cake_candles_celebrat', 'birthday_party_decorations_bal', 'happy_birthday_typography_cake', 'friends_celebrating_birthday_p', 'minimal_happy_birthday_poster'],
  'Attitude': ['bold_red_black_typography_atti', 'bold_attitude_quote_typography', 'modern_attitude_quote_poster_d', 'powerful_gaze_confidence_portr', 'confident_person_silhouette_su', 'leader_standing_alone_spotligh', 'mountain_peak_victory_stance_s', 'dark_dramatic_power_silhouette', 'bold_black_gold_motivational_d'],
  'Marriage Funny': ['happy_chaotic_married_life_car', 'funny_married_couple_cartoon_s', 'husband_confused_wife_confiden', 'lighthearted_wedding_ring_come', 'shopping_couple_exaggerated_co', 'married_couple_sofa_remote_con', 'married_couple_teamwork_househ', 'couple_laughing_together_kitch', 'husband_wife_playful_argument'],
  'Motivation': ['bold_black_gold_motivational_d', 'mountain_peak_victory_stance_s', 'city_sunrise_skyline_motivatio', 'bold_minimal_typography_motiva', 'minimal_black_gold_motivationa', 'climbing_steep_mountain_determ', 'broken_chain_symbolism_freedom', 'metamorphosis_butterfly_transf', 'early_morning_discipline_routi', 'calm_focused_individual_medita', 'gradual_staircase_progress_sym', 'edge_of_cliff_courage_decision', 'breaking_barrier_visual_metaph', 'gym_repetition_discipline_aest', 'boxer_training_sweat_determina', 'clock_patience_timing_success', 'adapting_chameleon_transformat', 'checklist_small_wins_productiv', 'action_arrow_forward_bold_desi'],
  'Breakup': ['broken_heart_glass_symbolism', 'empty_room_breakup_atmosphere', 'phone_message_breakup_concept', 'dramatic_storm_sky_heartbreak', 'lonely_road_at_night_emotional', 'rainy_window_heartbreak_scene', 'tearful_silhouette_city_lights', 'dim_cafe_lonely_chair_cinemat', 'person_walking_away_sunset_sad'],
  'Friendship': ['friends_laughing_sunset_cinem', 'group_hug_joyful_moment_cinem', 'campfire_storytelling_friends', 'friends_walking_beach_sunset', 'friends_cheering_success_cine', 'friends_selfie_happiness_cine', 'friends_sitting_rooftop_city_l', 'coffee_shop_friendship_chat_c', 'road_trip_friendship_adventure', 'festival_celebration_friends'],
  'Marriage Anniversary': ['anniversary_roses_and_rings_c', 'elegant_anniversary_cake_celeb', 'couple_dancing_slow_lights_ci', 'romantic_couple_candle_dinner', 'holding_hands_wedding_rings_c', 'romantic_beach_anniversary_wal', 'golden_anniversary_lights_cin', 'couple_sunset_embrace_cinemat', 'anniversary_gratitude_romantic'],
  'Sad': ['dim_room_emotional_sadness_ci', 'blue_toned_melancholy_portrait', 'dark_clouds_emotional_sky_cin', 'empty_park_bench_autumn_leaves', 'foggy_street_solitude_atmosphe', 'lonely_window_night_reflection', 'person_sitting_alone_rain_mood', 'single_chair_spotlight_lonelin', 'silhouette_staring_horizon_ci', 'soft_candlelight_sadness_mood'],
  'Islamic': ['crescent_moon_mosque_silhouett', 'desert_sunrise_reflection_spir', 'hands_making_dua_soft_golden_s', 'islamic_lantern_crescent_night', 'mosque_interior_sunlight_peace', 'ramadan_lantern_warm_glow_devo', 'islamic_geometric_pattern_spir', 'islamic_spiritual_mosque_light', 'muslim_prayer_sujood_peaceful', 'quran_glowing_light_calm_devot'],
  'Durga Puja': ['durga_maa_trident_divine_aura', 'goddess_durga_lion_spiritual_a', 'durga_idol_festival_decoration', 'durga_festival_marigold_decora', 'durga_puja_pandal_golden_light', 'durga_puja_cultural_celebratio', 'dhak_drums_festival_celebratio', 'devotees_praying_durga_temple', 'durga_puja_night_lights_pandal', 'durga_idol_flowers_incense_smo'],
  'Romantic': ['romantic_couple_sunset_silhoue', 'rose_petals_romantic_scene_ci', 'soft_candlelight_romance_theme', 'heart_bokeh_lights_romantic_mo', 'holding_hands_love_aesthetic', 'golden_hour_couple_portrait_c', 'romantic_rain_couple_scene_ci', 'love_letter_aesthetic_backgrou', 'romantic_balcony_night_lights', 'couple_walking_beach_sunset_c'],
};

// Track round-robin index per slug
const slugIndex = {};
function getNextFile(slug) {
  if (!slugToFiles[slug] || slugToFiles[slug].length === 0) return null;
  if (!slugIndex[slug]) slugIndex[slug] = 0;
  const file = slugToFiles[slug][slugIndex[slug] % slugToFiles[slug].length];
  slugIndex[slug]++;
  return file;
}

// Track fallback index per category
const catFallbackIndex = {};
function getFallbackFile(category) {
  const fallbacks = categoryFallbacks[category] || [];
  if (!catFallbackIndex[category]) catFallbackIndex[category] = 0;
  for (let attempt = 0; attempt < fallbacks.length; attempt++) {
    const slug = fallbacks[(catFallbackIndex[category] + attempt) % fallbacks.length];
    if (slugToFiles[slug] && slugToFiles[slug].length > 0) {
      catFallbackIndex[category] = (catFallbackIndex[category] + attempt + 1) % fallbacks.length;
      return getNextFile(slug);
    }
  }
  // Last resort: any webp file
  return files[Math.floor(Math.random() * files.length)];
}

// Build Excel row -> image mapping
// Excel rows 1..1300 correspond to shayaris in order
const rowToImage = {};
let matched = 0, fallback = 0;

for (let i = 1; i < data.length; i++) {
  const row = data[i];
  if (!row || !row[0]) continue;
  const category = row[0];
  const promptSlug = promptToSlug(row[7]);
  const bestSlug = findBestSlug(promptSlug);

  let imgFile;
  if (bestSlug) {
    imgFile = getNextFile(bestSlug);
    matched++;
  } else {
    imgFile = getFallbackFile(category);
    fallback++;
  }
  rowToImage[i] = imgFile ? `/images/shayaris/${imgFile}` : null;
}

console.log(`Matched by prompt: ${matched}, Fallback by category: ${fallback}`);

// Now read shayaris.json and update images
// The shayaris are in the same order as Excel rows (row 1 = shayaris[0])
const shayarisPath = './public/shayaris.json';
const shayaris = JSON.parse(fs.readFileSync(shayarisPath, 'utf8'));

console.log(`Total shayaris: ${shayaris.length}`);

let updated = 0, missing = 0;
shayaris.forEach((s, idx) => {
  const excelRow = idx + 1; // Excel row 1 = shayaris[0]
  const imgPath = rowToImage[excelRow];
  if (imgPath) {
    s.image = imgPath;
    updated++;
  } else {
    missing++;
    console.log(`No image for shayari ${idx} (Excel row ${excelRow})`);
  }
});

console.log(`Updated: ${updated}, Missing: ${missing}`);

fs.writeFileSync(shayarisPath, JSON.stringify(shayaris, null, 2));
console.log('Done! shayaris.json updated.');
