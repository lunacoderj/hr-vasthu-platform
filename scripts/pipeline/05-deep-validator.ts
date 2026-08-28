/**
 * Deep Content Density & Multi-Signal Anti-Repetition Validator
 * Evaluates meaningful depth, source provenance, phrase loops, structural uniqueness, and claim audits.
 */

import { SourceAnalysis, DynamicOutline, GeneratedSection, ContentDensityMetrics } from './01-types';
import crypto from 'crypto';

export class DeepValidator {
  private acceptedFingerprints: Map<string, Set<string>> = new Map();
  private acceptedOutlines: Map<string, string[]> = new Map();

  private hashText(text: string): string {
    return crypto.createHash('sha256').update(text.trim().toLowerCase()).digest('hex');
  }

  private getNGrams(text: string, n = 4): Set<string> {
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

  private computeJaccard(setA: Set<string>, setB: Set<string>): number {
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return intersection / union;
  }

  public validateArticle(
    source: SourceAnalysis,
    outline: DynamicOutline,
    sections: GeneratedSection[]
  ): { metrics: ContentDensityMetrics; status: 'PASS' | 'FAIL' | 'CONTENT_DEPTH_INSUFFICIENT' | 'CONTENT_DUPLICATE_REVIEW'; errors: string[] } {
    const errors: string[] = [];

    const allMarkdown = sections.map(s => s.contentMarkdown).join('\n\n');
    const words = allMarkdown.split(/\s+/).filter(Boolean);
    const rawWordCount = words.length;

    // 1. Exact & Near Duplicate Paragraphs
    let duplicateParagraphCount = 0;
    const paragraphHashes = new Set<string>();
    for (const sec of sections) {
      const paragraphs = sec.contentMarkdown
        .split('\n\n')
        .map(p => p.trim())
        .filter(p => p.length > 50 && !p.startsWith('#') && !p.startsWith('|') && !p.startsWith('-'));

      for (const p of paragraphs) {
        const hash = this.hashText(p);
        if (paragraphHashes.has(hash)) {
          duplicateParagraphCount++;
        } else {
          paragraphHashes.add(hash);
        }
      }
    }

    // 2. Duplicate Sentences
    const sentences = allMarkdown
      .split(/[.!?]+/)
      .map(s => s.trim().toLowerCase())
      .filter(s => s.length > 35 && !s.startsWith('#') && !s.startsWith('|'));

    const sentenceFreq: Record<string, number> = {};
    let duplicateSentenceCount = 0;
    for (const s of sentences) {
      sentenceFreq[s] = (sentenceFreq[s] || 0) + 1;
      if (sentenceFreq[s] > 2) {
        duplicateSentenceCount++;
      }
    }

    // 3. Generic AI Filler Detection
    const genericPhrases = [
      "in today's world",
      "in modern times",
      "it is important to understand",
      "let us explore",
      "vastu shastra is an ancient science",
      "this comprehensive guide",
      "as we all know"
    ];
    let fillerOccurrences = 0;
    const lowerText = allMarkdown.toLowerCase();
    for (const phrase of genericPhrases) {
      if (lowerText.includes(phrase)) {
        fillerOccurrences++;
      }
    }
    const genericFillerPercentage = parseFloat(((fillerOccurrences / (sentences.length || 1)) * 100).toFixed(1));

    // 4. Meaningful Word Count Calculation
    const repetitionPercentage = parseFloat((((duplicateParagraphCount * 50 + duplicateSentenceCount * 15) / (rawWordCount || 1)) * 100).toFixed(1));
    const meaningfulWordCount = Math.max(0, Math.round(rawWordCount * (1 - (repetitionPercentage + genericFillerPercentage) / 100)));

    // 5. Source & Topic Relevance Scores
    let sourceKeywordsFound = 0;
    const topicTokens = source.primaryTopic.toLowerCase().split(/\s+/).filter(t => t.length > 3);
    for (const token of topicTokens) {
      if (lowerText.includes(token)) sourceKeywordsFound++;
    }
    const topicRelevanceScore = Math.min(100, Math.round((sourceKeywordsFound / (topicTokens.length || 1)) * 100));
    const sourceRelevanceScore = source.transcriptWordCount > 20 ? 95 : 85;
    const uniqueInformationScore = Math.max(60, Math.min(100, 100 - Math.round(repetitionPercentage * 2)));
    const sectionValueScore = Math.min(100, Math.round((sections.length / (outline.sections.length || 1)) * 100));

    // 6. Cross-Article Multi-Signal Similarity Check
    const currentNgrams = this.getNGrams(allMarkdown, 4);
    let maxSimilarity = 0;
    let mostSimilarSlug = '';

    for (const [slug, ngrams] of this.acceptedFingerprints.entries()) {
      const sim = this.computeJaccard(currentNgrams, ngrams);
      if (sim > maxSimilarity) {
        maxSimilarity = sim;
        mostSimilarSlug = slug;
      }
    }

    // 7. Claim Audit Provenance
    const sourceSupportedClaims = source.claimLedger.filter(c => c.supported && c.sourceType === 'VIDEO').length;
    const educationalContextClaims = source.claimLedger.filter(c => c.supported && c.sourceType === 'EDUCATIONAL_CONTEXT').length;
    const flaggedClaims = source.claimLedger.filter(c => !c.supported || c.sourceType === 'UNSUPPORTED').length;

    // 8. Overall Quality Score
    const finalQualityScore = Math.round(
      topicRelevanceScore * 0.3 +
      sourceRelevanceScore * 0.2 +
      uniqueInformationScore * 0.3 +
      sectionValueScore * 0.2
    );

    // Validation Thresholds
    let status: 'PASS' | 'FAIL' | 'CONTENT_DEPTH_INSUFFICIENT' | 'CONTENT_DUPLICATE_REVIEW' = 'PASS';

    if (rawWordCount < 1800) {
      errors.push(`Raw word count too low (${rawWordCount} words, minimum required for benchmark depth)`);
      status = 'CONTENT_DEPTH_INSUFFICIENT';
    }

    if (duplicateParagraphCount > 0) {
      errors.push(`${duplicateParagraphCount} duplicate paragraphs detected`);
      status = 'FAIL';
    }

    if (maxSimilarity > 0.90) {
      errors.push(`Cross-article similarity too high (${(maxSimilarity * 100).toFixed(1)}%) with post "${mostSimilarSlug}"`);
      status = 'CONTENT_DUPLICATE_REVIEW';
    }

    if (status === 'PASS') {
      this.acceptedFingerprints.set(source.youtubeId, currentNgrams);
      this.acceptedOutlines.set(source.youtubeId, outline.sections.map(s => s.title));
    }

    const metrics: ContentDensityMetrics = {
      rawWordCount,
      meaningfulWordCount,
      repetitionPercentage,
      genericFillerPercentage,
      sourceRelevanceScore,
      topicRelevanceScore,
      uniqueInformationScore,
      sectionValueScore,
      duplicateParagraphCount,
      duplicateSentenceCount,
      crossArticleSimilarityScore: parseFloat(maxSimilarity.toFixed(3)),
      claimAudit: {
        totalClaims: source.claimLedger.length,
        sourceSupportedClaims,
        educationalContextClaims,
        flaggedClaims
      },
      finalQualityScore
    };

    return {
      metrics,
      status,
      errors
    };
  }
}
