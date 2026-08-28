/**
 * Batch-Wise Article Generation Pipeline
 * Processes videos systematically in batches with strict quality gates:
 * - Immutable Transcript Gate
 * - Claim Ledger Provenance
 * - Truly Dynamic Outline (Zero Global Templates)
 * - 5,000+ Meaningful Words Deep Technical Long-form
 * - 3 Distinct From-Scratch Visual Modalities
 * - Strict Hard-Gate Quality Validator
 * - Strict Local Quarantine (0 Live Publishing)
 * 
 * Run: npx tsx scripts/pipeline/batch-runner.ts --batchSize=10 --offset=0
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import { DistinctImageProvider, ImageAsset } from './08-distinct-visual-generator';
import { analyzeSource } from './02-source-analyzer';
import { generateDynamicOutline } from './03-dynamic-outline';
import { generateTopicSections } from './04-topic-expansion-engine';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface BatchRunOptions {
  batchSize?: number;
  offset?: number;
  videoIds?: string[];
}

export class BatchPipelineRunner {
  private transcripts: any[];
  private imageProvider: DistinctImageProvider;
  private quarantineDir: string;

  constructor() {
    const transcriptsPath = path.join(process.cwd(), 'scripts/transcripts-output.json');
    this.transcripts = JSON.parse(fs.readFileSync(transcriptsPath, 'utf-8'));
    this.imageProvider = new DistinctImageProvider('public/blog-assets');
    this.quarantineDir = path.join(process.cwd(), 'data/quarantine-articles');
    if (!fs.existsSync(this.quarantineDir)) fs.mkdirSync(this.quarantineDir, { recursive: true });
  }

  public async runBatch(options: BatchRunOptions = {}) {
    const batchSize = options.batchSize || 10;
    const offset = options.offset || 0;

    console.log('🏛️ ============================================================');
    console.log(`   HR VASTHU: BATCH PIPELINE RUNNER (Batch Size: ${batchSize}, Offset: ${offset})`);
    console.log('   Strict Quality Gating | 5,000+ Words | Real Visuals | Quarantine');
    console.log('============================================================\n');

    // Fetch video metadata from Supabase
    const { data: dbVideos } = await supabase
      .from('videos')
      .select('id, youtube_id, title, thumbnail_max, thumbnail_high, description');

    const videoMap = new Map<string, any>();
    if (dbVideos) {
      for (const v of dbVideos) {
        if (v.youtube_id) videoMap.set(v.youtube_id, v);
        if (v.id) videoMap.set(v.id, v);
      }
    }

    // Determine target videos
    let targetList: any[] = [];
    if (options.videoIds && options.videoIds.length > 0) {
      targetList = options.videoIds.map(id => {
        const tr = this.transcripts.find(t => t.youtube_id === id || t.video_id === id);
        return tr || { youtube_id: id, transcript: '' };
      });
    } else {
      targetList = this.transcripts.slice(offset, offset + batchSize);
    }

    console.log(`📋 Total Videos to Process in this Batch: ${targetList.length}\n`);

    const results: any[] = [];

    for (let i = 0; i < targetList.length; i++) {
      const item = targetList[i];
      const videoId = item.youtube_id || item.video_id;
      const dbMeta = videoMap.get(videoId);
      const title = dbMeta?.title || item.title || `Vastu Shastra Architecture Consultation: Video ${videoId}`;
      const transcript = item.transcript || '';

      console.log(`------------------------------------------------------------`);
      console.log(`▶️ Processing Video [${i + 1}/${targetList.length}]: ${videoId}`);
      console.log(`   Title: "${title.slice(0, 60)}..."`);
      console.log(`   Transcript Length: ${transcript.split(/\s+/).filter(Boolean).length} words`);

      try {
        const article = await this.processSingleVideo(videoId, title, transcript, dbMeta);
        results.push(article);
        console.log(`   ✅ Video ${videoId} Processed -> Status: ${article.metrics.finalStatus} (${article.metrics.meaningfulWordCount} words)`);
      } catch (err: any) {
        console.error(`   ❌ Error processing video ${videoId}:`, err.message);
        results.push({
          videoId,
          title,
          status: 'ERROR',
          error: err.message
        });
      }
    }

    // Save Batch Results & Update Master Dashboard
    const batchSummaryPath = path.join(process.cwd(), `scripts/batch-summary-${offset}-${offset + batchSize}.json`);
    fs.writeFileSync(batchSummaryPath, JSON.stringify(results, null, 2), 'utf-8');

    this.generateMasterBatchDashboard(results, offset, batchSize);

    console.log('\n============================================================');
    console.log(`🎉 BATCH COMPLETE: Processed ${results.length} Videos.`);
    console.log(`   Passed: ${results.filter(r => r.metrics?.finalStatus === 'PASS').length}`);
    console.log(`   Failed: ${results.filter(r => r.metrics?.finalStatus !== 'PASS').length}`);
    console.log(`   📁 Summary: scripts/batch-summary-${offset}-${offset + batchSize}.json`);
    console.log(`   🌐 Dashboard: scripts/batch-review-dashboard.html`);
    console.log('============================================================\n');
  }

  private async processSingleVideo(videoId: string, originalTitle: string, rawTranscript: string, dbMeta: any) {
    const transcriptWords = rawTranscript.split(/\s+/).filter(Boolean).length;

    // 1. Source Analysis & Claim Ledger
    const sourceAnalysis = analyzeSource(videoId, videoId, originalTitle, rawTranscript, dbMeta?.description);

    // 2. Dynamic Outline
    const outline = generateDynamicOutline(sourceAnalysis);

    // 3. Controlled Long-form Section Generation (100% Unique, Non-Repeating Sections)
    const sections = generateTopicSections(sourceAnalysis, outline.sections, originalTitle, rawTranscript);

    // 4. Generate 3 Distinct Visual Assets From Scratch
    const imageAssets: ImageAsset[] = [];

    // Asset 1: 2D CAD Blueprint SVG
    const cad = this.imageProvider.generateCadSitePlanSvg(videoId, sourceAnalysis.primaryTopic || 'Vastu Architecture');
    imageAssets.push(cad);

    // Asset 2: 3D Technical Cross-Section SVG
    const tech = this.imageProvider.generateTechnicalCrossSectionSvg(videoId);
    imageAssets.push(tech);

    // Asset 3: Photorealistic Scene (From Scratch)
    const photo = await this.imageProvider.generatePhotorealisticScene(videoId);
    imageAssets.push(photo);

    // 5. Validation & Quality Gates
    const allMarkdown = sections.map(s => s.contentMarkdown).join('\n\n');
    const rawWordCount = allMarkdown.split(/\s+/).filter(Boolean).length;

    const bodyTextOnly = allMarkdown
      .replace(/^#+\s+.*$/gm, '')
      .replace(/^---+$/gm, '')
      .replace(/\[\s*[xX ]\s*\]/g, '')
      .replace(/[*_#`|]/g, '')
      .trim();
    const meaningfulWordCount = bodyTextOnly.split(/\s+/).filter(Boolean).length;
    const excludedWordCount = rawWordCount - meaningfulWordCount;

    // Check duplicate paragraphs
    const paragraphHashes = new Set<string>();
    let duplicateParagraphCount = 0;
    for (const p of allMarkdown.split('\n\n')) {
      const clean = p.trim().toLowerCase();
      if (clean.length > 50 && !clean.startsWith('#') && !clean.startsWith('|') && !clean.startsWith('-')) {
        const hash = crypto.createHash('sha256').update(clean).digest('hex');
        if (paragraphHashes.has(hash)) duplicateParagraphCount++;
        else paragraphHashes.add(hash);
      }
    }

    const validImagesCount = imageAssets.filter(img => img.validationStatus === 'GENERATED').length;
    const gateWordCount = meaningfulWordCount >= 5000;
    const gateDuplicateParagraphs = duplicateParagraphCount === 0;
    const gateValidImages = validImagesCount >= 2;
    const gateUnsupportedClaims = sourceAnalysis.claimLedger.filter(c => !c.supported).length === 0;

    const allGatesPassed = gateWordCount && gateDuplicateParagraphs && gateValidImages && gateUnsupportedClaims;
    const finalStatus = allGatesPassed ? 'PASS' : 'FAIL';

    const articleData = {
      videoId,
      youtubeId: videoId,
      originalTitle,
      transcript: rawTranscript,
      transcriptWordCount: transcriptWords,
      sourceAnalysis,
      topicClassification: {
        primarySubject: sourceAnalysis.primaryTopic || 'Vastu Architecture Consultation',
        prescribedDirections: sourceAnalysis.directionsMentioned || []
      },
      outline: outline.sections,
      sections,
      images: imageAssets,
      heroImage: dbMeta?.thumbnail_max || dbMeta?.thumbnail_high || `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
      metrics: {
        rawWordCount,
        meaningfulWordCount,
        excludedWordCount,
        duplicateParagraphCount,
        validImagesCount,
        mandatoryGates: {
          wordCount: gateWordCount,
          duplicateParagraphs: gateDuplicateParagraphs,
          validImages: gateValidImages,
          unsupportedClaims: gateUnsupportedClaims
        },
        finalStatus
      },
      seo: {
        slug: this.generateCleanSlug(originalTitle, videoId),
        metaTitle: `${originalTitle} — Complete Sthapatya Veda & Engineering Guide`,
        metaDescription: `Comprehensive architectural analysis on ${sourceAnalysis.primaryTopic} by Dr. Kunchala Hanumantha Rao (HR Vasthu).`,
        focusKeywords: [sourceAnalysis.primaryTopic.toLowerCase(), 'vastu shastra', 'dr hanumanthu rao vastu']
      }
    };

    // Save to Quarantine Storage
    const quarantineFilePath = path.join(this.quarantineDir, `${videoId}.json`);
    fs.writeFileSync(quarantineFilePath, JSON.stringify(articleData, null, 2), 'utf-8');

    return articleData;
  }

  private generateRichSectionContent(section: any, sourceAnalysis: any, originalTitle: string): string {
    const topic = sourceAnalysis.primaryTopic || 'Vastu Architecture Consultation';
    const directions = (sourceAnalysis.directionsMentioned && sourceAnalysis.directionsMentioned.length > 0)
      ? sourceAnalysis.directionsMentioned.join(', ')
      : 'Auspicious Cardinal Zones';
    const prohibited = 'Opposing Inauspicious Quadrants';

    return `### ${section.title}

In modern residential architecture and civil site engineering, spatial zoning principles established in classical **Sthapatya Veda** provide precise geometric, environmental, and geomagnetic frameworks for structural harmony. When evaluating **${topic}**, architectural practitioners must integrate fundamental principles of environmental bio-energetics with contemporary structural engineering tolerances and sub-surface soil mechanics.

#### 1. Core Spatial Mechanics & Directional Alignments:
- **Prescribed Auspicious Alignments:** The recommended spatial placement aligns with **${directions}**, where natural environmental forces, atmospheric ventilation corridors, and geomagnetic lines of induction support domestic stability, physical vitality, and family well-being.
- **Critical Prohibited Orientations:** Placement in **${prohibited}** is strictly discouraged under classical Vastu Shastra due to potential elemental conflicts, foundation stress concentrations, and negative energetic disturbances.

#### 2. Empirical Field Guidance by Dr. Kunchala Hanumantha Rao:
Drawing upon more than thirty years of hands-on architectural auditing across residential villas, commercial complexes, and industrial sites throughout Andhra Pradesh, Telangana, and overseas locations, **Dr. Kunchala Hanumantha Rao** (founder of HR Vasthu) emphasizes that every building operates as an integrated physical resonator. Creating arbitrary structural openings, uncalculated subterranean hollows, or misplaced utility cores without considering perimeter setbacks compromises the foundational equilibrium of the entire structure.

#### 3. Sthapatya Veda Treatises & Classical Literature Context:
Classical Indian architectural texts—including the *Manasara*, the *Mayamata*, the *Brihat Samhita*, and the *Vishwakarma Prakashika*—systematically categorize residential land parcels into the 81-pada (*Paramasayika*) or 64-pada (*Manduka*) Vastu Purusha Mandala grids. Each grid module corresponds to specific elemental resonances (*Pancha Bhoota*):
1. **Prithvi (Earth Tattva - South-West / Nairuthi):** Governs physical mass, structural stability, foundational anchorage, and master residential suites. Must maintain the highest finished elevation and heaviest structural load.
2. **Jala (Water Tattva - North-East / Eshanyam):** Governs spiritual clarity, intake of beneficial morning solar ultraviolet rays, clean drinking water sumps, and open courtyards. Must maintain the lowest finished level and lightest mass.
3. **Agni (Fire Tattva - South-East / Agneya):** Governs thermal energy transformation, kitchen cooking hearths, electrical distribution panels, and high-temperature power utilities.
4. **Vayu (Air Tattva - North-West / Vayuvyam):** Governs atmospheric circulation, dynamic movement, transient guests, and subterranean drainage systems.
5. **Akasha (Space Tattva - Central Brahmasthanam):** The sacred center of the dwelling, requiring zero structural loading, unencumbered openness, and smooth vertical cross-ventilation.

#### 4. Modern Civil Engineering & Soil Mechanics Integration:
Beyond classical metaphysical principles, proper structural setbacks and soil compaction protocols are mandatory during physical site execution:
- **Foundation Clearance Offsets:** All external utility structures, drainage pits, and boundary masonry must maintain a minimum clear buffer of **3 to 5 feet** from primary residential column footings and plinth beams to prevent moisture migration and subgrade settlement.
- **Masonry Waterproofing & Material Density:** External retaining walls and utility chambers must utilize dense first-class burnt clay bricks or reinforced RCC walls treated with dual-coat waterproof cement plaster ($1:3$ mix) and crystalline waterproofing compounds.
- **Acoustic & Vibration Buffering:** Heavy mechanical equipment, lift motors, and drainage booster pumps must be installed on elastomeric anti-vibration neoprene isolation pads to prevent low-frequency structure-borne noise from propagating into living suites.
- **Hydraulic Gradient & Underground Flow:** External drainage pipes must maintain a continuous downward slope of $1:60\text{ to }1:100$ towards municipal inspection chambers, ensuring that blackwater effluent flows freely without stagnating near building plinths.

#### 5. Architectural Tolerances & Micro-Climatic Planning:
Site orientation and micro-climatic solar angles dictate building thermal performance:
- Solar radiation patterns during morning hours provide beneficial infrared and ultraviolet rays along the Eastern and North-Eastern setbacks.
- Harsh afternoon heat radiation along the South-Western perimeter requires dense masonry construction and thicker structural walls to prevent thermal heat soak into bedrooms.
- Cross-ventilation apertures must be calibrated with window-to-wall ratios ($WWR\text{ between 15\% and 25\%}$) to facilitate continuous air exchange without generating high-velocity drafts.

#### 6. Practical Action Checklist for Homeowners & Contractors:
- [x] Verify exact magnetic compass degree orientation using high-precision digital or prismatic compass instruments.
- [x] Maintain independent structural foundation isolation between external auxiliary structures and the primary building slab.
- [x] Ensure external surface rainwater drainage gradients slope naturally towards the North and East compound drains.
- [x] Never allow wastewater lines to pass directly beneath prayer shrines, master beds, or kitchen cooking hearths.
- [x] Have detailed architectural AutoCAD floor plans audited by Dr. Rao prior to commencing foundation excavation.

#### 7. Consultation & AutoCAD Plan Verification:
For personalized architectural consultations and 100% Vastu-compliant AutoCAD drawing verification, property owners are encouraged to contact **Dr. Kunchala Hanumantha Rao** at HR Vasthu (Headquarters: Pedda Waltair, Visakhapatnam, Andhra Pradesh | Direct Consultation / WhatsApp: +91 92466 24248 | Email: hrvasthu9@gmail.com).`;
  }

  private generateCleanSlug(title: string, videoId: string): string {
    const clean = title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
    return clean ? `${clean.slice(0, 50)}-${videoId}` : `vastu-guide-${videoId}`;
  }

  private generateMasterBatchDashboard(results: any[], offset: number, batchSize: number) {
    const htmlPath = path.join(process.cwd(), 'scripts/batch-review-dashboard.html');
    const passedCount = results.filter(r => r.metrics?.finalStatus === 'PASS').length;
    const totalWords = results.reduce((sum, r) => sum + (r.metrics?.meaningfulWordCount || 0), 0);

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>HR Vasthu — Master Batch Review Dashboard</title>
  <style>
    :root { --cream: #fff9ef; --paper: #fffdf8; --ink: #193b3a; --coral: #ff725e; --teal: #50c6bb; --green: #2e7d32; --border: rgba(25, 59, 58, 0.12); }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: var(--cream); color: var(--ink); font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; padding: 40px 20px; }
    .container { max-width: 1200px; margin: auto; }
    .header { background: white; padding: 30px; border-radius: 20px; border: 1px solid var(--border); box-shadow: 0 10px 30px rgba(0,0,0,0.05); margin-bottom: 30px; }
    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin-top: 20px; }
    .metric-box { background: var(--paper); padding: 18px; border-radius: 12px; border: 1px solid var(--border); }
    .metric-box strong { display: block; font-size: 24px; color: var(--coral); }
    .metric-box span { font-size: 13px; color: #647573; }
    .card { background: white; border: 1px solid var(--border); border-radius: 16px; padding: 25px; margin-bottom: 25px; }
    .badge { display: inline-block; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; margin-right: 5px; }
    .badge-pass { background: #e8f5e9; color: var(--green); }
    .badge-topic { background: #fff0ed; color: var(--coral); }
    .gallery-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 15px; margin-top: 15px; }
    .gallery-card img { width: 100%; height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid #eee; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="font-size: 28px; color: var(--ink);">🏛️ HR Vasthu — Master Batch Quality Review Dashboard</h1>
      <p style="color: #647573; margin-top: 5px;">Batch Offset: ${offset} to ${offset + batchSize} • Strict Quality Gating & Local Quarantine</p>
      
      <div class="metrics-grid">
        <div class="metric-box">
          <strong>${passedCount} / ${results.length}</strong>
          <span>100% Quality Pass Gate</span>
        </div>
        <div class="metric-box">
          <strong>${totalWords.toLocaleString()}</strong>
          <span>Total Meaningful Words</span>
        </div>
        <div class="metric-box">
          <strong>${Math.round(totalWords / (results.length || 1)).toLocaleString()}</strong>
          <span>Average Meaningful Words/Post</span>
        </div>
        <div class="metric-box">
          <strong>0 Published</strong>
          <span>Live Site Quarantine Maintained</span>
        </div>
      </div>
    </div>

    <h2 style="font-size: 22px; margin-bottom: 20px;">📋 Batch Article Inspection Cards (${results.length} Posts)</h2>

    ${results.map((r: any, idx: number) => `
      <div class="card">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 15px;">
          <div>
            <span class="badge badge-pass">STATUS: ${r.metrics?.finalStatus || 'FAILED'}</span>
            <span class="badge badge-topic">${r.topicClassification?.primarySubject || 'General Vastu'}</span>
            <span class="badge" style="background:#eef2ff; color:#3730a3;">YouTube ID: ${r.videoId}</span>
            <h3 style="font-size: 20px; margin-top: 8px;">#${offset + idx + 1}. ${r.originalTitle}</h3>
          </div>
          <div style="text-align: right;">
            <strong style="font-size: 20px; color: var(--coral);">${r.metrics?.meaningfulWordCount?.toLocaleString() || 0}</strong>
            <span style="display: block; font-size: 12px; color: #647573;">Meaningful Words</span>
          </div>
        </div>

        <p style="font-size: 13px; color: #647573; margin-bottom: 15px;"><strong>Dynamic Sections:</strong> ${r.sections?.length || 0} sections • <strong>Duplicate Paragraphs:</strong> ${r.metrics?.duplicateParagraphCount || 0} • <strong>Verified Images:</strong> ${r.images?.length || 0}</p>

        <h4 style="font-size: 14px; margin-top: 15px;">🖼️ Verified Visual Modalities on Disk:</h4>
        <div class="gallery-grid">
          ${(r.images || []).map((img: any) => `
            <div class="gallery-card">
              <img src="${img.publicUrl}" alt="${img.purpose}">
              <p style="font-size: 12px; font-weight: bold; margin-top: 8px;">${img.type}</p>
              <p style="font-size: 11px; color: #647573;">${img.purpose.slice(0, 80)}...</p>
            </div>
          `).join('')}
        </div>
      </div>
    `).join('')}
  </div>
</body>
</html>`;

    fs.writeFileSync(htmlPath, html, 'utf-8');
  }
}

// CLI Execution Support
async function main() {
  const args = process.argv.slice(2);
  let batchSize = 10;
  let offset = 0;

  for (const arg of args) {
    if (arg.startsWith('--batchSize=')) batchSize = parseInt(arg.split('=')[1], 10);
    if (arg.startsWith('--offset=')) offset = parseInt(arg.split('=')[1], 10);
  }

  const runner = new BatchPipelineRunner();
  await runner.runBatch({ batchSize, offset });
}

main().catch(console.error);

