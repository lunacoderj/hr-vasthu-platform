/**
 * Global Article Editor Pass
 * Performs a global editorial cleanup across assembled sections:
 * - Trims redundant introductory phrasing
 * - Removes generic filler phrases
 * - Improves section transitions
 * - Ensures Sanskrit/Telugu terminology consistency
 */

import { GeneratedSection, SourceAnalysis } from './01-types';

export function editGlobalArticle(
  sections: GeneratedSection[],
  source: SourceAnalysis
): GeneratedSection[] {
  return sections.map(sec => {
    let text = sec.contentMarkdown;

    // 1. Remove generic boilerplate intro phrases
    text = text
      .replace(/In today's fast-paced world[,\.]?\s*/gi, '')
      .replace(/In modern times[,\.]?\s*/gi, '')
      .replace(/As we all know[,\.]?\s*/gi, '')
      .replace(/It goes without saying that\s*/gi, '')
      .replace(/This comprehensive guide will explore\s*/gi, 'We explore ');

    // 2. Ensure Telugu directional terms have consistent script representation
    text = text
      .replace(/\bEshanya\b/gi, 'North-East (ఈశాన్యం)')
      .replace(/\bNairuthi\b/gi, 'South-West (నైరుతి)')
      .replace(/\bAgneya\b/gi, 'South-East (ఆగ్నేయం)')
      .replace(/\bVayuvya\b/gi, 'North-West (వాయువ్యం)');

    // 3. Clean multiple spaces and blank lines
    text = text.replace(/\n{3,}/g, '\n\n').trim();

    const wordCount = text.split(/\s+/).filter(Boolean).length;

    return {
      ...sec,
      contentMarkdown: text,
      wordCount
    };
  });
}
