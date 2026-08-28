/**
 * SEO & Schema Gate
 */

import { StructuredArticle, ValidationResult } from './01-types';

export class SeoGate {
  private existingSlugs: Set<string> = new Set();

  public validateAndEnrich(article: StructuredArticle): ValidationResult {
    const errors: string[] = [];

    if (!article.slug || article.slug.length < 3) {
      errors.push('Invalid slug format');
    }

    if (this.existingSlugs.has(article.slug)) {
      // Append unique suffix to prevent collision
      article.slug = `${article.slug}-${Math.random().toString(36).substring(2, 6)}`;
    }
    this.existingSlugs.add(article.slug);

    if (!article.excerpt || article.excerpt.length < 20) {
      errors.push('Meta excerpt too short');
    }

    return {
      passed: errors.length === 0,
      errors
    };
  }
}
