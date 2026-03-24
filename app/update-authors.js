/**
 * Script to update all Shayari authors
 * Changes "Anonymous" to randomly "Afsa Aleha" or "Arfa Aleha"
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the shayaris.json file
const filePath = path.join(__dirname, 'public', 'shayaris.json');
const shayaris = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Author names to randomly assign
const authors = ['Afsa Aleha', 'Arfa Aleha'];

// Function to get random author
function getRandomAuthor() {
  return authors[Math.floor(Math.random() * authors.length)];
}

// Update all shayaris
let updatedCount = 0;
shayaris.forEach(shayari => {
  if (shayari.author === 'Anonymous' || !shayari.author) {
    shayari.author = getRandomAuthor();
    updatedCount++;
  }
});

// Write back to file
fs.writeFileSync(filePath, JSON.stringify(shayaris, null, 2), 'utf8');

console.log(`✅ Updated ${updatedCount} shayaris!`);
console.log(`📊 Total shayaris: ${shayaris.length}`);
console.log(`👤 Authors: ${authors.join(', ')}`);

// Show distribution
const distribution = {};
shayaris.forEach(s => {
  distribution[s.author] = (distribution[s.author] || 0) + 1;
});

console.log('\n📈 Author Distribution:');
Object.entries(distribution).forEach(([author, count]) => {
  console.log(`   ${author}: ${count} shayaris`);
});
