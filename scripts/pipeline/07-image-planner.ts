/**
 * Article-Derived Image Planner & Prompt Hashing Engine
 * Plans 2–5 purposeful architectural visuals derived directly from the article's specific concepts.
 */

import { GeneratedSection, SourceAnalysis, ImagePlan } from './01-types';
import crypto from 'crypto';

export class ImagePlanner {
  private generatedPromptHashes: Set<string> = new Set();

  private hashPrompt(prompt: string): string {
    return crypto.createHash('sha256').update(prompt.trim().toLowerCase()).digest('hex');
  }

  public planImages(
    source: SourceAnalysis,
    sections: GeneratedSection[]
  ): ImagePlan[] {
    const plans: ImagePlan[] = [];

    // Choose up to 4 key sections that benefit most from a visual illustration
    const visualCandidateSections = sections.filter(
      s => s.knowledgeLayer === 'SOURCE_DIRECT' ||
           s.knowledgeLayer === 'EDUCATIONAL_EXPANSION' ||
           s.knowledgeLayer === 'PRACTICAL_GUIDELINES'
    ).slice(0, 4);

    for (const sec of visualCandidateSections) {
      let visualConcept = '';
      let whyUseful = '';

      if (sec.title.toLowerCase().includes('septic') || sec.title.toLowerCase().includes('waste') || sec.title.toLowerCase().includes('plumbing')) {
        visualConcept = 'Architectural cross-section of house showing North-West corner septic chamber with safety offset from boundary';
        whyUseful = 'Helps homeowners understand correct distance ratios between septic tank and compound wall';
      } else if (sec.title.toLowerCase().includes('road') || sec.title.toLowerCase().includes('thrust') || sec.title.toLowerCase().includes('potu')) {
        visualConcept = 'Site layout elevation showing compound wall deflection barrier and landscape buffer against road intersection';
        whyUseful = 'Illustrates physical boundary deflection techniques without demolition';
      } else if (sec.title.toLowerCase().includes('tree') || sec.title.toLowerCase().includes('plant') || sec.title.toLowerCase().includes('botanical')) {
        visualConcept = 'Garden compound landscape showing tall canopy trees along South-West and open green lawn in North-East';
        whyUseful = 'Demonstrates correct solar height hierarchy for residential landscaping';
      } else if (sec.title.toLowerCase().includes('kitchen') || sec.title.toLowerCase().includes('fire') || sec.title.toLowerCase().includes('stove')) {
        visualConcept = 'Modern luxury Indian kitchen with cooking platform facing East and water sink placed in North-East corner';
        whyUseful = 'Clarifies the practical separation between fire and water elements in the kitchen';
      } else {
        visualConcept = `Photorealistic architectural perspective of luxury Indian residence demonstrating ${sec.title}`;
        whyUseful = `Visualizes the spatial layout discussed in ${sec.title}`;
      }

      const prompt = `Photorealistic luxury architectural rendering of ${visualConcept} with warm natural daylight, high detail, no watermark`;
      const promptHash = this.hashPrompt(prompt);

      if (!this.generatedPromptHashes.has(promptHash)) {
        this.generatedPromptHashes.add(promptHash);

        const sanitized = encodeURIComponent(prompt.slice(0, 100));
        const imageUrl = `https://image.pollinations.ai/prompt/${sanitized}?width=1200&height=700&nologo=true`;

        plans.push({
          imagePurpose: `Illustrate ${sec.title}`,
          relatedSection: sec.title,
          visualConcept,
          prompt,
          whyThisImageIsUseful: whyUseful,
          imageUrl,
          promptHash
        });
      }
    }

    return plans;
  }
}
