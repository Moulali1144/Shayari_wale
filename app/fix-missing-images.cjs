/**
 * Fix shayaris that still have no local image (rows 704-1300).
 * Strategy: for each unmapped shayari, assign an image from the same category
 * by cycling through the already-mapped images of that category.
 */

const fs = require('fs');
const path = require('path');

const SHAYARIS_PATH = path.join(__dirname, 'public', 'shayaris.json');
const shayaris = JSON.parse(fs.readFileSync(SHAYARIS_PATH, 'utf8'));

// Separate mapped and unmapped
const mappedByCategory = {};
const unmappedIndices = [];

for (let i = 0; i < shayaris.length; i++) {
  const s = shayaris[i];
  if (s.image && s.image.startsWith('/images/shayaris/')) {
    if (!mappedByCategory[s.category]) mappedByCategory[s.category] = [];
    mappedByCategory[s.category].push(s.image);
  } else {
    unmappedIndices.push(i);
  }
}

console.log('Already mapped:', shayaris.length - unmappedIndices.length);
console.log('Unmapped:', unmappedIndices.length);

// Build a flat list of all images as ultimate fallback
const allImages = Object.values(mappedByCategory).flat();

// Track cycling index per category
const cycleIndex = {};

let fixed = 0;
let usedFallback = 0;

for (const idx of unmappedIndices) {
  const s = shayaris[idx];
  const pool = mappedByCategory[s.category];
  
  if (pool && pool.length > 0) {
    if (!cycleIndex[s.category]) cycleIndex[s.category] = 0;
    s.image = pool[cycleIndex[s.category] % pool.length];
    cycleIndex[s.category]++;
    fixed++;
  } else {
    // Ultimate fallback: cycle through all images
    if (!cycleIndex['__fallback__']) cycleIndex['__fallback__'] = 0;
    s.image = allImages[cycleIndex['__fallback__'] % allImages.length];
    cycleIndex['__fallback__']++;
    usedFallback++;
  }
}

console.log(`Fixed with category cycling: ${fixed}`);
console.log(`Fixed with global fallback: ${usedFallback}`);

// Verify no missing images
const stillMissing = shayaris.filter(s => !s.image || !s.image.startsWith('/images/shayaris/'));
console.log('Still missing after fix:', stillMissing.length);

fs.writeFileSync(SHAYARIS_PATH, JSON.stringify(shayaris, null, 2), 'utf8');
console.log('Saved shayaris.json');

// Show sample of fixed ones
console.log('\nSample fixed (first 5 from unmapped):');
unmappedIndices.slice(0, 5).forEach(i => {
  const s = shayaris[i];
  console.log(`  ${s.id} -> ${s.image}`);
});

// Show category distribution
console.log('\nCategory image pool sizes:');
for (const [cat, imgs] of Object.entries(mappedByCategory)) {
  console.log(`  ${cat}: ${imgs.length} images`);
}
