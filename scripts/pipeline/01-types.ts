/**
 * Pipeline Types & Schemas
 * 2-Layer Knowledge Architecture & Claim Ledger Provenance
 */

export interface Claim {
  claim: string;
  source: string | null;
  sourceType: 'VIDEO' | 'EDUCATIONAL_CONTEXT' | 'UNSUPPORTED';
  supported: boolean;
  notes?: string;
}

export interface SourceAnalysis {
  videoId: string;
  youtubeId: string;
  title: string;
  primaryTopic: string;
  mainQuestion: string;
  conceptsActuallyDiscussed: string[];
  directionsMentioned: string[];
  measurementsMentioned: string[];
  remediesMentioned: string[];
  importantStatements: string[];
  questionsAnswered: string[];
  unsupportedTopics: string[];
  claimLedger: Claim[];
  transcriptWordCount: number;
}

export interface OutlineSection {
  sectionNumber: number;
  sectionNumberLabel: string; // e.g. "01 — PRIMARY ANALYSIS"
  title: string;
  purpose: string;
  knowledgeLayer: 'SOURCE_DIRECT' | 'EDUCATIONAL_EXPANSION' | 'PRACTICAL_GUIDELINES' | 'FAQS_AND_SUMMARY';
  targetWordCount: number;
  conceptsToCover: string[];
}

export interface DynamicOutline {
  articleTitle: string;
  topicDomain: string;
  estimatedTotalWords: number;
  sections: OutlineSection[];
}

export interface GeneratedSection {
  number: number;
  sectionNumberLabel: string;
  title: string;
  purpose: string;
  knowledgeLayer: string;
  contentMarkdown: string;
  wordCount: number;
  imageConcept?: {
    purpose: string;
    prompt: string;
    caption: string;
    whyUseful: string;
    imageUrl: string;
  };
}

export interface ImagePlan {
  imagePurpose: string;
  relatedSection: string;
  visualConcept: string;
  prompt: string;
  whyThisImageIsUseful: string;
  imageUrl: string;
  promptHash: string;
}

export interface ContentDensityMetrics {
  rawWordCount: number;
  meaningfulWordCount: number;
  repetitionPercentage: number;
  genericFillerPercentage: number;
  sourceRelevanceScore: number; // 0-100
  topicRelevanceScore: number; // 0-100
  uniqueInformationScore: number; // 0-100
  sectionValueScore: number; // 0-100
  duplicateParagraphCount: number;
  duplicateSentenceCount: number;
  crossArticleSimilarityScore: number; // 0-1.0
  claimAudit: {
    totalClaims: number;
    sourceSupportedClaims: number;
    educationalContextClaims: number;
    flaggedClaims: number;
  };
  finalQualityScore: number; // 0-100
}

export interface ProductionArticle {
  videoId: string;
  youtubeId: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  readingTimeMinutes: number;
  heroImage: string;
  sourceAnalysis: SourceAnalysis;
  outline: DynamicOutline;
  sections: GeneratedSection[];
  faqs: { question: string; answer: string }[];
  keyTakeaways: string[];
  conclusion: string;
  images: ImagePlan[];
  seo: {
    title: string;
    description: string;
    keywords: string[];
    schemaJsonLd: Record<string, any>;
  };
  metrics: ContentDensityMetrics;
  modelLineage: {
    provider: string;
    model: string;
    promptVersion: string;
    generationVersion: string;
    generatedAt: string;
  };
  validationStatus: 'PASS' | 'FAIL' | 'CONTENT_DEPTH_INSUFFICIENT' | 'CONTENT_DUPLICATE_REVIEW';
}
