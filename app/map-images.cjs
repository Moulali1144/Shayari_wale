/**
 * Map unique image URLs from Excel to shayaris.json
 * Excel Col1 = English text, Col8 = Image_Link
 * Match by English text (first 80 chars)
 */
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Read Excel
const wb = XLSX.readFile('../Updated_combined_final.xlsx');
const ws = wb.Sheets[wb.SheetNames[0]];
const range = XLSX.utils.decode_range(ws['!ref']);

// Build map: normalized english text -> image URL
const textToImage = new Map();
const indexToImage = new Map(); // row index -> image URL (1-based)

for (let r = 1; r <= range.e.r; r++) {
  const engCell = ws[XLSX.utils.encode_cell({ r, c: 1 })];
  const imgCell = ws[XLSX.utils.encode_cell({ r, c: 8 })];
  if (!imgCell || !imgCell.v) continue;

  const imgUrl = String(imgCell.v).trim();
  if (!imgUrl.startsWith('http')) continue;

  indexToImage.set(r, imgUrl); // row index (1=first data row)

  if (engCell && engCell.v) {
    const key = String(engCell.v).replace(/\s+/g, ' ').trim().substring(0, 80).toLowerCase();
    textToImage.set(key, imgUrl);
  }
}

console.log('Excel image map size:', textToImage.size, '| index map:', indexToImage.size);

// Read shayaris.json
const shayarisPath = path.join(__dirname, 'public', 'shayaris.json');
const shayaris = JSON.parse(fs.readFileSync(shayarisPath, 'utf8'));
console.log('Total shayaris:', shayaris.length);

let byText = 0, byIndex = 0, notFound = 0;

shayaris.forEach((shayari, idx) => {
  // Try text match first
  const key = (shayari.text || '').replace(/\\n/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 80).toLowerCase();
  let imgUrl = textToImage.get(key);

  if (imgUrl) {
    shayari.image = imgUrl;
    byText++;
    return;
  }

  // Fallback: match by position (idx+1 = row number in excel)
  imgUrl = indexToImage.get(idx + 1);
  if (imgUrl) {
    shayari.image = imgUrl;
    byIndex++;
    return;
  }

  notFound++;
  console.log('NOT FOUND idx=' + idx + ' id=' + shayari.id);
});

console.log('\nResults:');
console.log('  Matched by text:', byText);
console.log('  Matched by index:', byIndex);
console.log('  Not found:', notFound);

// Save
fs.writeFileSync(shayarisPath, JSON.stringify(shayaris, null, 2), 'utf8');
console.log('\nSaved shayaris.json');

// Show sample
console.log('\nSample (first 5):');
shayaris.slice(0, 5).forEach(s => {
  console.log('  ' + s.id + ' -> ' + (s.image || 'NO IMAGE').substring(0, 80));
});
