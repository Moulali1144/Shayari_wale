/**
 * Map local .webp images from Images/ folder to shayaris.json
 * 
 * Image filename format: {rowNumber}_{descriptive_name}_{suffix}_result.webp
 * The rowNumber (1-based) corresponds to the shayari index in shayaris.json
 * 
 * Strategy:
 * 1. Scan all .webp files in Images/ folder
 * 2. Build a map: rowNumber -> first matching filename
 * 3. For each shayari at index i, assign image from row (i+1)
 * 4. Copy images to app/public/images/shayaris/
 * 5. Update shayaris.json with local paths
 */

const fs = require('fs');
const path = require('path');

const IMAGES_SRC = path.join(__dirname, '..', 'Images');
const IMAGES_DEST = path.join(__dirname, 'public', 'images', 'shayaris');
const SHAYARIS_PATH = path.join(__dirname, 'public', 'shayaris.json');

// Ensure destination directory exists
if (!fs.existsSync(IMAGES_DEST)) {
  fs.mkdirSync(IMAGES_DEST, { recursive: true });
  console.log('Created directory:', IMAGES_DEST);
}

// Scan all .webp files and build rowNumber -> [filenames] map
console.log('Scanning Images folder...');
const allFiles = fs.readdirSync(IMAGES_SRC).filter(f => f.endsWith('.webp'));
console.log('Total .webp files found:', allFiles.length);

// Build map: rowNumber -> array of filenames (there can be multiple per row)
const rowToFiles = new Map();
for (const filename of allFiles) {
  const match = filename.match(/^(\d+)_/);
  if (match) {
    const rowNum = parseInt(match[1], 10);
    if (!rowToFiles.has(rowNum)) {
      rowToFiles.set(rowNum, []);
    }
    rowToFiles.get(rowNum).push(filename);
  }
}

console.log('Unique row numbers found:', rowToFiles.size);
console.log('Row number range:', Math.min(...rowToFiles.keys()), '-', Math.max(...rowToFiles.keys()));

// Read shayaris.json
const shayaris = JSON.parse(fs.readFileSync(SHAYARIS_PATH, 'utf8'));
console.log('Total shayaris:', shayaris.length);

// Track which files we actually need to copy
const filesToCopy = new Set();
let mapped = 0;
let notFound = 0;

// Map each shayari to an image
shayaris.forEach((shayari, idx) => {
  const rowNum = idx + 1; // 1-based row number
  const files = rowToFiles.get(rowNum);
  
  if (files && files.length > 0) {
    // Pick the first file for this row number
    const chosen = files[0];
    shayari.image = `/images/shayaris/${chosen}`;
    filesToCopy.add(chosen);
    mapped++;
  } else {
    // Try nearby rows as fallback
    let found = false;
    for (let offset = 1; offset <= 5; offset++) {
      const nearFiles = rowToFiles.get(rowNum + offset) || rowToFiles.get(rowNum - offset);
      if (nearFiles && nearFiles.length > 0) {
        const chosen = nearFiles[0];
        shayari.image = `/images/shayaris/${chosen}`;
        filesToCopy.add(chosen);
        mapped++;
        found = true;
        break;
      }
    }
    if (!found) {
      notFound++;
      console.log(`  No image for shayari idx=${idx} (row ${rowNum}), id=${shayari.id}`);
    }
  }
});

console.log(`\nMapping results:`);
console.log(`  Mapped: ${mapped}`);
console.log(`  Not found: ${notFound}`);
console.log(`  Files to copy: ${filesToCopy.size}`);

// Copy needed image files to destination
console.log('\nCopying images...');
let copied = 0;
let skipped = 0;
for (const filename of filesToCopy) {
  const src = path.join(IMAGES_SRC, filename);
  const dest = path.join(IMAGES_DEST, filename);
  if (!fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
    copied++;
  } else {
    skipped++;
  }
}
console.log(`  Copied: ${copied}, Already existed (skipped): ${skipped}`);

// Save updated shayaris.json
fs.writeFileSync(SHAYARIS_PATH, JSON.stringify(shayaris, null, 2), 'utf8');
console.log('\nSaved shayaris.json with local image paths');

// Show sample
console.log('\nSample (first 5):');
shayaris.slice(0, 5).forEach(s => {
  console.log(`  ${s.id} -> ${s.image}`);
});

console.log('\nDone!');
