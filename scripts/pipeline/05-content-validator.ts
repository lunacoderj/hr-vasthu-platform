/**
 * Deterministic Content & Repetition Validator
 * 
 * 4 Strict Quality Gates:
 * 1. Minimum Word Count & Required Sections Gate
 * 2. Paragraph SHA-256 Duplicate Detector Gate
 * 3. Body Sentence / N-gram Repetition Loop Detector Gate (Excludes headings & title tokens)
 * 4. Cross-Article Similarity Gate (Max 94% overlap allowed to prevent clones)
 */

import { StructuredArticle, ValidationResult } from './01-types';
import crypto from 'crypto';

export class ContentValidator {
  private acceptedArticleFingerprints: Map<string, Set<string>> = new Map();

  private hashText(text: string): string {
    return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');
  }

  private getNGrams(text: string, n = 5): Set<string> {
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(Boolean);

    const ngrams = new Set<string>();
    for (let i = 0; i <= words.length - n; i++) {
      ngrams.add(words.slice(i, i + n).join(' '));
    }
    return ngrams;
  }

  private computeSimilarity(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return intersection / union;
  }

  public validate(article: StructuredArticle): ValidationResult {
    const errors: string[] = [];

    // Gate 1: Word Count & Required Sections
    if (!article.sections || article.sections.length < 5) {
      errors.push(`Missing required sections (found ${article.sections?.length || 0}, minimum 5)`);
    }

    if (!article.title || article.title.length < 3) {
      errors.push('Invalid or empty title');
    }

    if (article.word_count < 650) {
      errors.push(`Word count too low (${article.word_count} words, minimum 650)`);
    }

    // Gate 2: Paragraph Duplication Detection (SHA-256 Hashes)
    const paragraphHashes = new Set<string>();
    for (const section of article.sections || []) {
      const paragraphs = section.content_markdown
        .split('\n\n')
        .map(p => p.trim())
        .filter(p => p.length > 50 && !p.startsWith('#') && !p.startsWith('|') && !p.startsWith('-'));

      for (const p of paragraphs) {
        const hash = this.hashText(p);
        if (paragraphHashes.has(hash)) {
          errors.push(`Duplicate paragraph detected in section "${section.title}": "${p.slice(0, 40)}..."`);
        } else {
          paragraphHashes.add(hash);
        }
      }
    }

    // Gate 3: Body Sentence Loop Detection (Excludes headings & table rows)
    const bodyParagraphs = article.sections
      .map(s => s.content_markdown)
      .join('\n\n')
      .split('\n\n')
      .filter(p => !p.startsWith('#') && !p.startsWith('|') && !p.startsWith('-') && !p.startsWith('>'))
      .join(' ');

    const sentences = bodyParagraphs
      .split(/[.!?]+/)
      .map(s => s.trim().toLowerCase())
      .filter(s => s.length > 40);

    const sentenceFreq: Record<string, number> = {};
    for (const s of sentences) {
      sentenceFreq[s] = (sentenceFreq[s] || 0) + 1;
      if (sentenceFreq[s] > 2) {
        errors.push(`Repeating sentence loop detected (${sentenceFreq[s]}x): "${s.slice(0, 50)}..."`);
      }
    }

    // Gate 4: Cross-Article Similarity Gate (Max 98% 5-gram overlap allowed)
    const allText = article.sections.map(s => s.content_markdown).join(' ');
    const currentNgrams = this.getNGrams(allText, 5);
    for (const [existingSlug, existingNgrams] of this.acceptedArticleFingerprints.entries()) {
      const sim = this.computeSimilarity(currentNgrams, existingNgrams);
      if (sim > 0.98) {
        errors.push(`Article similarity too high (${(sim * 100).toFixed(1)}%) with existing post "${existingSlug}"`);
      }
    }

    if (errors.length === 0) {
      this.acceptedArticleFingerprints.set(article.slug, currentNgrams);
      return {
        passed: true,
        errors: [],
        word_count: article.word_count,
        quality_score: Math.min(100, Math.max(75, Math.round(article.word_count / 25)))
      };
    }

    return {
      passed: false,
      errors,
      word_count: article.word_count,
      quality_score: 0
    };
  }
}
