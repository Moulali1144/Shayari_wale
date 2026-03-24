/**
 * Duplicate Shayari Checker
 * Checks for exact and partial matches across all languages
 */

import type { Shayari } from '../data/shayariData';

/**
 * Calculate similarity between two strings using Levenshtein distance
 * Returns a percentage (0-100) of how similar the strings are
 */
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase().trim().replace(/\s+/g, ' ');
  const s2 = str2.toLowerCase().trim().replace(/\s+/g, ' ');
  
  if (s1 === s2) return 100;
  
  const longer = s1.length > s2.length ? s1 : s2;
  const shorter = s1.length > s2.length ? s2 : s1;
  
  if (longer.length === 0) return 100;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return ((longer.length - editDistance) / longer.length) * 100;
}

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1: string, str2: string): number {
  const matrix: number[][] = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}

/**
 * Check if submitted shayari is duplicate
 * Checks against all existing shayaris in all languages
 */
export function checkDuplicateShayari(
  submittedText: string,
  allShayaris: Shayari[],
  threshold: number = 80
): {
  isDuplicate: boolean;
  matchedShayari?: Shayari;
  similarity?: number;
  matchedLanguage?: string;
} {
  const normalizedSubmitted = submittedText.toLowerCase().trim().replace(/\s+/g, ' ');
  
  for (const shayari of allShayaris) {
    // Check all language versions
    const textsToCheck = [
      { text: shayari.text, lang: 'English' },
      { text: shayari.textHi, lang: 'Hindi' },
      { text: shayari.textTe, lang: 'Telugu' },
      { text: shayari.textGu, lang: 'Gujarati' },
      { text: shayari.textMr, lang: 'Marathi' },
      { text: shayari.textTa, lang: 'Tamil' },
    ];
    
    for (const { text, lang } of textsToCheck) {
      if (!text) continue;
      
      const normalizedExisting = text.toLowerCase().trim().replace(/\s+/g, ' ');
      
      // Exact match check
      if (normalizedSubmitted === normalizedExisting) {
        return {
          isDuplicate: true,
          matchedShayari: shayari,
          similarity: 100,
          matchedLanguage: lang,
        };
      }
      
      // Partial match check (80%+ similarity)
      const similarity = calculateSimilarity(submittedText, text);
      if (similarity >= threshold) {
        return {
          isDuplicate: true,
          matchedShayari: shayari,
          similarity: Math.round(similarity),
          matchedLanguage: lang,
        };
      }
    }
  }
  
  return { isDuplicate: false };
}

/**
 * Check for common phrases that might indicate plagiarism
 */
export function checkCommonPhrases(text: string): boolean {
  const commonPhrases = [
    'copy paste',
    'copied from',
    'source:',
    'credit:',
    'original author',
  ];
  
  const lowerText = text.toLowerCase();
  return commonPhrases.some(phrase => lowerText.includes(phrase));
}

/**
 * Validate shayari quality
 */
export function validateShayariQuality(text: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Minimum length check
  if (text.trim().length < 20) {
    errors.push('Shayari is too short. Please write at least 20 characters.');
  }
  
  // Maximum length check
  if (text.trim().length > 1000) {
    errors.push('Shayari is too long. Please keep it under 1000 characters.');
  }
  
  // Check for excessive special characters
  const specialCharCount = (text.match(/[^a-zA-Z0-9\s\u0900-\u097F\u0C00-\u0C7F\u0A80-\u0AFF\u0900-\u097F\u0B80-\u0BFF]/g) || []).length;
  if (specialCharCount > text.length * 0.3) {
    errors.push('Too many special characters. Please use normal text.');
  }
  
  // Check for repeated characters
  if (/(.)\1{5,}/.test(text)) {
    errors.push('Please avoid excessive character repetition.');
  }
  
  // Check for URLs
  if (/https?:\/\/|www\./i.test(text)) {
    errors.push('Please do not include URLs in your shayari.');
  }
  
  // Check for email addresses
  if (/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i.test(text)) {
    errors.push('Please do not include email addresses in your shayari.');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}
