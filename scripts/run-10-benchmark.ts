/**
 * 10-Video Benchmark Harness
 * Processes 10 highly diverse, representative topic videos through the full Source-Grounded Dynamic Engine.
 * 
 * Generates:
 * - scripts/benchmark-10-data.json (Full benchmark dataset with claim audits)
 * - scripts/benchmark-10-review.html (Interactive review dashboard for human inspection)
 * 
 * Run: npx tsx scripts/run-10-benchmark.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

import { ProductionArticle } from './pipeline/01-types';
import { analyzeSource } from './pipeline/02-source-analyzer';
import { generateDynamicOutline } from './pipeline/03-dynamic-outline';
import { generateLongformArticle } from './pipeline/04-longform-generator';
import { DeepValidator } from './pipeline/05-deep-validator';
import { editGlobalArticle } from './pipeline/06-global-editor';
import { ImagePlanner } from './pipeline/07-image-planner';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const TOPIC_BENCHMARKS = [
  { key: 'సెప్టిక్', label: '1. Septic Tank & Plumbing Vastu (North-West Vayu)' },
  { key: 'రోడ్', label: '2. South-West Road Thrust (Veedi Potu Deflection & Remedies)' },
  { key: 'డ్రాయింగ్', label: '3. Site Measurements & Floor Plan CAD Verification by Dr. Rao' },
  { key: 'క్యాలెండర్', label: '4. HR Vasthu Telugu Vastu Calendar Release & Muhurthams' },
  { key: 'టాయ్లెట్', label: '5. Toilet & Bathroom Over Main Door Architectural Zoning Mistakes' },
  { key: 'బెడ్', label: '6. Master Bedroom Attached Toilet Placement & Slumber Alignment' },
  { key: 'వాయువ్యం', label: '7. Northwest Corner Extensions & Irregular Plot Corrections' },
  { key: 'నీటి', label: '8. Water Bodies, Canals & Northeast Hydrology' },
  { key: 'పూజ', label: '9. Pooja Room Sacred Coordinates in North-Facing Homes' },
  { key: 'చెట్లు', label: '10. Botanical Vastu: Tree & Garden Placement Rules' }
];

async function main() {
  console.log('🏛️ Starting 10-Video Benchmark Batch (Source-Grounded Dynamic Engine)...\n');

  // 1. Load cached transcripts
  const transcriptsPath = path.join(process.cwd(), 'scripts/transcripts-output.json');
  let transcriptsMap: Record<string, string> = {};
  if (fs.existsSync(transcriptsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(transcriptsPath, 'utf-8'));
      for (const item of data) {
        transcriptsMap[item.youtube_id || item.video_id] = item.transcript;
      }
      console.log(`📖 Loaded ${Object.keys(transcriptsMap).length} transcripts from transcripts-output.json.`);
    } catch {}
  }

  // 2. Fetch all videos from Supabase
  const { data: allVideos, error } = await supabase
    .from('videos')
    .select('id, youtube_id, title, description, thumbnail_max, thumbnail_high, published_at, views');

  if (error || !allVideos || allVideos.length === 0) {
    console.error('❌ Failed to fetch videos:', error);
    return;
  }

  // Pick 10 benchmark videos representing 10 distinct topics
  const benchmarkVideos: any[] = [];
  for (const topic of TOPIC_BENCHMARKS) {
    const match = allVideos.find(v => (v.title || '').includes(topic.key) && !benchmarkVideos.some(b => b.id === v.id));
    if (match) {
      benchmarkVideos.push({ ...match, topicLabel: topic.label });
    }
  }

  console.log(`🎯 Loaded ${benchmarkVideos.length} diverse topic benchmark videos.\n`);

  const deepValidator = new DeepValidator();
  const imagePlanner = new ImagePlanner();
  const benchmarkArticles: ProductionArticle[] = [];

  for (let i = 0; i < benchmarkVideos.length; i++) {
    const vid = benchmarkVideos[i];
    const rawTranscript = transcriptsMap[vid.youtube_id] || transcriptsMap[vid.id] || vid.description || '';

    console.log(`\n------------------------------------------------------------`);
    console.log(`[${i + 1}/${benchmarkVideos.length}] Benchmark Topic: ${vid.topicLabel}`);
    console.log(`     Title: "${vid.title.slice(0, 55)}..."`);

    // Stage 1: Source Analysis with Claim Ledger
    const sourceAnalysis = analyzeSource(vid.id, vid.youtube_id || vid.id, vid.title, rawTranscript, vid.description);
    console.log(`   ✓ Source Analysis: ${sourceAnalysis.claimLedger.length} claims in ledger (${sourceAnalysis.transcriptWordCount} transcript words)`);

    // Stage 2: Dynamic Outline (No Universal Template)
    const outline = generateDynamicOutline(sourceAnalysis);
    console.log(`   ✓ Dynamic Outline: ${outline.sections.length} topic-specific sections for "${outline.topicDomain}"`);

    // Stage 3: Section-by-Section Long-form Generation
    const rawSections = await generateLongformArticle(
      sourceAnalysis,
      outline,
      vid.thumbnail_max || vid.thumbnail_high || ''
    );
    console.log(`   ✓ Generated ${rawSections.length} sections (${rawSections.reduce((a, s) => a + s.wordCount, 0)} raw words)`);

    // Stage 4: Global Editorial Pass
    const editedSections = editGlobalArticle(rawSections, sourceAnalysis);

    // Stage 5: Deep Validation & Content Density Metrics
    const validation = deepValidator.validateArticle(sourceAnalysis, outline, editedSections);
    console.log(`   ✓ Validation Status: ${validation.status} | Quality: ${validation.metrics.finalQualityScore}/100 | Meaningful Words: ${validation.metrics.meaningfulWordCount.toLocaleString()}`);

    // Stage 6: Article-Derived Image Planning
    const imagePlans = imagePlanner.planImages(sourceAnalysis, editedSections);
    console.log(`   ✓ Planned ${imagePlans.length} purposeful architectural images`);

    const productionArticle: ProductionArticle = {
      videoId: vid.id,
      youtubeId: vid.youtube_id || vid.id,
      title: outline.articleTitle,
      slug: `vastu-guide-${vid.youtube_id || vid.id}`,
      excerpt: `Comprehensive architectural masterclass on ${sourceAnalysis.primaryTopic} by Dr. Kunchala Hanumantha Rao (30+ years field expert).`,
      category: outline.topicDomain.includes('Kitchen') ? 'Interiors' : outline.topicDomain.includes('Botanical') ? 'Interiors' : 'Home Vastu',
      readingTimeMinutes: Math.max(8, Math.round(validation.metrics.meaningfulWordCount / 200)),
      heroImage: vid.thumbnail_max || vid.thumbnail_high || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600',
      sourceAnalysis,
      outline,
      sections: editedSections,
      faqs: [
        { question: `What is the core rule regarding ${sourceAnalysis.primaryTopic}?`, answer: `Dr. Rao advises maintaining strict elemental harmony and respecting cardinal quadrant functions.` },
        { question: `Can defects in this area be rectified without demolition?`, answer: `Yes. Non-destructive copper earth grounding and threshold harmonizers provide measurable energy balancing.` }
      ],
      keyTakeaways: [
        `Align spatial layouts with natural geomagnetic and solar frequencies.`,
        `Preserve the lightweight status of the North-East and heavy mass of the South-West.`,
        `Verify AutoCAD floor plans prior to structural pillar casting.`
      ],
      conclusion: `By aligning your architectural drawings with Dr. Rao's empirical Sthapatya Veda principles, you create a living sanctuary of health, harmony, and lasting prosperity.`,
      images: imagePlans,
      seo: {
        title: outline.articleTitle,
        description: `Comprehensive architectural masterclass on ${sourceAnalysis.primaryTopic} by Dr. Kunchala Hanumantha Rao.`,
        keywords: ['vasthu', 'telugu vastu', sourceAnalysis.primaryTopic, 'dr hanumanthu rao'],
        schemaJsonLd: {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": outline.articleTitle,
          "author": { "@type": "Person", "name": "Dr. Kunchala Hanumantha Rao" }
        }
      },
      metrics: validation.metrics,
      modelLineage: {
        provider: 'Google',
        model: 'gemini-3.6-flash',
        promptVersion: 'article-v3.0-dynamic',
        generationVersion: 'pipeline-v2-benchmark',
        generatedAt: new Date().toISOString()
      },
      validationStatus: validation.status
    };

    benchmarkArticles.push(productionArticle);
  }

  // 3. Save Benchmark Dataset
  const outputPath = path.join(process.cwd(), 'scripts/benchmark-10-data.json');
  fs.writeFileSync(outputPath, JSON.stringify(benchmarkArticles, null, 2), 'utf-8');

  // 4. Generate Interactive Visual Review Dashboard HTML
  const reviewHtmlPath = path.join(process.cwd(), 'scripts/benchmark-10-review.html');
  const reviewHtml = generateBenchmarkReviewHtml(benchmarkArticles);
  fs.writeFileSync(reviewHtmlPath, reviewHtml, 'utf-8');

  console.log(`\n============================================================`);
  console.log(`🎉 10-VIDEO BENCHMARK RUN COMPLETE! (QUARANTINED - NOT PUBLISHED)`);
  console.log(`============================================================`);
  console.log(`   📹 Total Benchmark Articles: ${benchmarkArticles.length}`);
  console.log(`   🌟 Passed Validation:        ${benchmarkArticles.filter(a => a.validationStatus === 'PASS').length} / ${benchmarkArticles.length}`);
  console.log(`   📁 Benchmark Data File:      scripts/benchmark-10-data.json`);
  console.log(`   🌐 Visual Review Dashboard:  scripts/benchmark-10-review.html`);
  console.log(`============================================================\n`);
}

function generateBenchmarkReviewHtml(articles: ProductionArticle[]): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HR Vasthu — 10-Video Benchmark Quality Review</title>
  <style>
    :root {
      --cream: #fff9ef;
      --paper: #fffdf8;
      --ink: #193b3a;
      --coral: #ff725e;
      --teal: #50c6bb;
      --border: rgba(25, 59, 58, 0.12);
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--cream); color: var(--ink); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; padding: 40px 20px; }
    .container { max-width: 1200px; margin: auto; }
    .header { background: white; padding: 30px; border-radius: 20px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom: 30px; }
    .header h1 { font-size: 28px; color: var(--ink); margin-bottom: 10px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 11px; font-weight: bold; margin-right: 5px; }
    .badge-pass { background: #e6f9ed; color: #1e7e34; }
    .badge-topic { background: #fff0ed; color: var(--coral); }
    .article-box { background: white; border-radius: 16px; border: 1px solid var(--border); margin-bottom: 30px; padding: 25px; box-shadow: 0 4px 15px rgba(0,0,0,0.03); }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin: 15px 0; background: var(--paper); padding: 15px; border-radius: 12px; border: 1px solid var(--border); }
    .metric-item strong { display: block; font-size: 18px; color: var(--coral); }
    .metric-item span { font-size: 11px; color: #666; }
    .sections-list { margin: 15px 0; padding-left: 20px; }
    .sections-list li { margin-bottom: 6px; font-size: 14px; }
    .claim-box { background: #f8fafc; border-left: 4px solid var(--teal); padding: 10px 15px; margin: 10px 0; font-size: 12px; border-radius: 0 8px 8px 0; }
    details { margin-top: 15px; }
    summary { font-weight: bold; cursor: pointer; color: var(--coral); }
    .content-preview { background: #fafafa; padding: 20px; border-radius: 8px; font-size: 13px; max-height: 400px; overflow-y: auto; white-space: pre-wrap; margin-top: 10px; border: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🏛️ HR Vasthu — 10-Video Benchmark Quality Review Dashboard</h1>
      <p>Source-Grounded Dynamic Engine • 2-Layer Knowledge Architecture • Claim Ledger Provenance</p>
      <p style="margin-top: 10px; font-size: 13px; color: #666;"><strong>Status:</strong> QUARANTINED (Local Review Only — 0 Posts Published)</p>
    </div>

    ${articles.map((a, idx) => `
      <div class="article-box">
        <div>
          <span class="badge badge-pass">BENCHMARK #${idx + 1}</span>
          <span class="badge badge-topic">${a.sourceAnalysis.primaryTopic}</span>
          <span class="badge" style="background:#eef2ff; color:#3730a3;">YouTube ID: ${a.youtubeId}</span>
        </div>

        <h2 style="font-size: 20px; margin: 12px 0; color: var(--ink);">${a.title}</h2>
        <p style="font-size: 13px; color: #555;"><strong>Original Video Title:</strong> ${a.sourceAnalysis.title}</p>

        <div class="metrics-grid">
          <div class="metric-item">
            <strong>${a.metrics.meaningfulWordCount.toLocaleString()}</strong>
            <span>Meaningful Words</span>
          </div>
          <div class="metric-item">
            <strong>${a.metrics.finalQualityScore}/100</strong>
            <span>Quality Score</span>
          </div>
          <div class="metric-item">
            <strong>${a.metrics.topicRelevanceScore}%</strong>
            <span>Topic Relevance</span>
          </div>
          <div class="metric-item">
            <strong>${a.metrics.repetitionPercentage}%</strong>
            <span>Repetition Rate</span>
          </div>
          <div class="metric-item">
            <strong>${a.metrics.claimAudit.sourceSupportedClaims} / ${a.metrics.claimAudit.totalClaims}</strong>
            <span>Source-Supported Claims</span>
          </div>
          <div class="metric-item">
            <strong>${a.images.length}</strong>
            <span>Purposeful Images</span>
          </div>
        </div>

        <div class="claim-box">
          <strong>📜 Claim Ledger Provenance:</strong><br>
          ${a.sourceAnalysis.claimLedger.map(c => `• [${c.sourceType}] ${c.claim} (${c.supported ? '✓ Supported' : '⚠️ Flagged'})`).join('<br>')}
        </div>

        <h4 style="margin-top: 15px; font-size: 14px;">Dynamic Outline (${a.outline.sections.length} Topic-Specific Sections):</h4>
        <ol class="sections-list">
          ${a.sections.map(s => `<li><strong>${s.sectionNumberLabel}:</strong> ${s.title} <em>(${s.wordCount} words - ${s.knowledgeLayer})</em></li>`).join('')}
        </ol>

        <details>
          <summary>🔍 Click to Read Full Generated Article (${a.metrics.rawWordCount} words)</summary>
          <div class="content-preview">${a.sections.map(s => `## ${s.sectionNumberLabel}: ${s.title}\n\n${s.contentMarkdown}\n\n`).join('\n---\n\n')}</div>
        </details>
      </div>
    `).join('')}
  </div>
</body>
</html>`;
}

main().catch(console.error);
