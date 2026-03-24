/**
 * Enhanced Download Image Generator
 * Creates beautiful shayari images with gradient backgrounds and decorative elements
 */

import type { Shayari, Language } from '../data/shayariData';

/**
 * Load image from URL
 */
function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

/**
 * Get font family based on language
 */
function getFontFamily(lang: Language): string {
  switch (lang) {
    case 'hi':
    case 'mr':
      return 'Noto Sans Devanagari, sans-serif';
    case 'te':
      return 'Noto Sans Telugu, sans-serif';
    case 'ta':
      return 'Noto Sans Tamil, sans-serif';
    case 'gu':
      return 'Noto Sans Gujarati, sans-serif';
    default:
      return 'Poppins, sans-serif';
  }
}

/**
 * Get language display name
 */
function getLanguageDisplayName(lang: Language): string {
  const names: Record<Language, string> = {
    en: 'English',
    hi: 'हिंदी',
    te: 'తెలుగు',
    gu: 'ગુજરાતી',
    mr: 'मराठी',
    ta: 'தமிழ்',
  };
  return names[lang];
}

/**
 * Wrap text to fit within width
 */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  const paragraphs = text.split('\n');
  
  for (const paragraph of paragraphs) {
    if (!paragraph.trim()) {
      lines.push('');
      continue;
    }
    
    const words = paragraph.split(' ');
    let currentLine = '';
    
    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const metrics = ctx.measureText(testLine);
      
      if (metrics.width > maxWidth && currentLine) {
        lines.push(currentLine);
        currentLine = word;
      } else {
        currentLine = testLine;
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
  }
  
  return lines;
}

/**
 * Generate and download shayari image
 */
export async function generateShayariImage(
  shayari: Shayari,
  text: string,
  lang: Language,
  categoryName: string
): Promise<void> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas not supported');
  
  // Set canvas size
  canvas.width = 1080;
  canvas.height = 1920;
  
  // ===== Background Gradient =====
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(0.5, '#764ba2');
  gradient.addColorStop(1, '#f093fb');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // ===== Decorative Translucent Circles =====
  ctx.save();
  ctx.globalAlpha = 0.1;
  const circles = [
    { x: 200, y: 200, r: 300 },
    { x: 880, y: 400, r: 250 },
    { x: 150, y: 1200, r: 350 },
    { x: 900, y: 1600, r: 280 },
    { x: 540, y: 800, r: 200 },
  ];
  
  circles.forEach(circle => {
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.r, 0, Math.PI * 2);
    ctx.fillStyle = 'white';
    ctx.fill();
  });
  ctx.restore();
  
  // ===== White Card Frame with Shadow =====
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
  ctx.shadowBlur = 50;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 25;
  ctx.fillStyle = 'white';
  roundRect(ctx, 80, 120, canvas.width - 160, canvas.height - 240, 30);
  ctx.fill();
  ctx.restore();
  
  // ===== Inner Decorative Border (Coral Color) =====
  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 4;
  roundRect(ctx, 100, 140, canvas.width - 200, canvas.height - 280, 25);
  ctx.stroke();
  
  // ===== Corner Decorations (Teal Color) =====
  ctx.strokeStyle = '#4ecdc4';
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  
  const cornerSize = 60;
  const offset = 100;
  
  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(offset, offset + cornerSize);
  ctx.lineTo(offset, offset);
  ctx.lineTo(offset + cornerSize, offset);
  ctx.stroke();
  
  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(canvas.width - offset - cornerSize, offset);
  ctx.lineTo(canvas.width - offset, offset);
  ctx.lineTo(canvas.width - offset, offset + cornerSize);
  ctx.stroke();
  
  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(offset, canvas.height - offset - cornerSize);
  ctx.lineTo(offset, canvas.height - offset);
  ctx.lineTo(offset + cornerSize, canvas.height - offset);
  ctx.stroke();
  
  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(canvas.width - offset - cornerSize, canvas.height - offset);
  ctx.lineTo(canvas.width - offset, canvas.height - offset);
  ctx.lineTo(canvas.width - offset, canvas.height - offset - cornerSize);
  ctx.stroke();
  
  // ===== Logo "Shayari wale" at Top =====
  ctx.fillStyle = '#ff6b6b';
  ctx.font = 'bold 56px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Shayari wale', canvas.width / 2, 200);
  
  // Decorative line under logo
  const lineGradient = ctx.createLinearGradient(
    canvas.width / 2 - 200,
    280,
    canvas.width / 2 + 200,
    280
  );
  lineGradient.addColorStop(0, 'rgba(255, 107, 107, 0)');
  lineGradient.addColorStop(0.5, 'rgba(255, 107, 107, 1)');
  lineGradient.addColorStop(1, 'rgba(255, 107, 107, 0)');
  ctx.strokeStyle = lineGradient;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 200, 280);
  ctx.lineTo(canvas.width / 2 + 200, 280);
  ctx.stroke();
  
  // ===== Category Badge =====
  const badgeY = 320;
  const badgeWidth = 280;
  const badgeHeight = 60;
  const badgeX = (canvas.width - badgeWidth) / 2;
  
  // Badge background
  ctx.fillStyle = '#fff5f5';
  roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 30);
  ctx.fill();
  
  // Badge border
  ctx.strokeStyle = '#ff6b6b';
  ctx.lineWidth = 3;
  roundRect(ctx, badgeX, badgeY, badgeWidth, badgeHeight, 30);
  ctx.stroke();
  
  // Badge text
  ctx.fillStyle = '#ff6b6b';
  ctx.font = 'bold 32px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(categoryName, canvas.width / 2, badgeY + badgeHeight / 2);
  
  // ===== Shayari Image (if available) =====
  let imageY = 420;
  try {
    const img = await loadImage(shayari.image);
    const imgSize = 400;
    const imgX = (canvas.width - imgSize) / 2;
    
    ctx.save();
    ctx.beginPath();
    ctx.arc(canvas.width / 2, imageY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    
    ctx.drawImage(img, imgX, imageY, imgSize, imgSize);
    ctx.restore();
    
    // Image border
    ctx.strokeStyle = '#4ecdc4';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(canvas.width / 2, imageY + imgSize / 2, imgSize / 2, 0, Math.PI * 2);
    ctx.stroke();
    
    imageY += imgSize + 60;
  } catch (error) {
    console.warn('Failed to load image:', error);
    imageY += 40;
  }
  
  // ===== Shayari Text =====
  const fontFamily = getFontFamily(lang);
  ctx.font = `36px ${fontFamily}`;
  ctx.fillStyle = '#2c3e50';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  
  const maxTextWidth = canvas.width - 280;
  const lines = wrapText(ctx, text, maxTextWidth);
  const lineHeight = 52;
  const textBlockHeight = lines.length * lineHeight;
  let textY = imageY;
  
  // Draw text with proper line wrapping
  lines.forEach((line, index) => {
    ctx.fillText(line, canvas.width / 2, textY + index * lineHeight);
  });
  
  textY += textBlockHeight + 60;
  
  // ===== Author Name =====
  ctx.font = 'italic 32px Poppins, sans-serif';
  ctx.fillStyle = '#7f8c8d';
  ctx.textAlign = 'center';
  ctx.fillText(`— ${shayari.author}`, canvas.width / 2, textY);
  
  textY += 80;
  
  // ===== Language Indicator =====
  const langBadgeWidth = 200;
  const langBadgeHeight = 50;
  const langBadgeX = (canvas.width - langBadgeWidth) / 2;
  
  ctx.fillStyle = '#e8f5e9';
  roundRect(ctx, langBadgeX, textY, langBadgeWidth, langBadgeHeight, 25);
  ctx.fill();
  
  ctx.strokeStyle = '#4ecdc4';
  ctx.lineWidth = 2;
  roundRect(ctx, langBadgeX, textY, langBadgeWidth, langBadgeHeight, 25);
  ctx.stroke();
  
  ctx.fillStyle = '#4ecdc4';
  ctx.font = 'bold 28px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(getLanguageDisplayName(lang), canvas.width / 2, textY + langBadgeHeight / 2);
  
  // ===== Footer =====
  const footerY = canvas.height - 150;
  
  // Website URL
  ctx.fillStyle = '#ff6b6b';
  ctx.font = 'bold 40px Poppins, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Shayariwale.in', canvas.width / 2, footerY);
  
  // Social sharing hint
  ctx.fillStyle = '#95a5a6';
  ctx.font = '28px Poppins, sans-serif';
  ctx.fillText('Share the love of poetry', canvas.width / 2, footerY + 50);
  
  // ===== Download =====
  canvas.toBlob((blob) => {
    if (!blob) return;
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shayari-${shayari.id}-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 'image/png');
}

/**
 * Helper function to draw rounded rectangle
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
