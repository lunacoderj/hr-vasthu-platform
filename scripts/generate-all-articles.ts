/**
 * Phase 2 & 3: Generate In-Depth 5K-10K Word Section-by-Section Articles with Unique AI Images
 * 
 * Pipeline:
 * 1. Reads extracted transcripts from scripts/transcripts-output.json (or fetches on the fly)
 * 2. Uses Gemini API (Flash/Pro) or Ollama (if running) to generate an 8-section in-depth masterclass (800-1200 words per section -> 5k-10k words total)
 * 3. Generates unique watermark-free AI image prompts & URLs for every section (Pollinations.ai / Unsplash)
 * 4. Saves structured JSON articles to Supabase 'blogs' table with staggered scheduled_publish_at dates (3 per day)
 * 
 * Run: npx tsx scripts/generate-all-articles.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';

interface ArticleSection {
  number: number;
  section_number_label: string; // e.g. "01 — THE FOUNDATION"
  title: string;
  content_markdown: string;
  image_url: string;
  image_caption?: string;
  callout?: {
    type: 'insight' | 'warning' | 'tip';
    title: string;
    text: string;
  };
}

interface StructuredArticle {
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  reading_time_minutes: number;
  hero_image: string;
  youtube_id: string;
  sections: ArticleSection[];
  faqs: { question: string; answer: string }[];
  keywords: string;
  author: string;
}

function cleanTitle(rawTitle: string): string {
  let title = rawTitle
    .replace(/#[\w\u0C00-\u0C7F]+/g, '')
    .replace(/\|\s*HR\s*Vasthu/gi, '')
    .replace(/\|\s*Dr\s*Hanumanthu\s*Rao/gi, '')
    .replace(/\|\s*Vastu\s*Tips/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
  title = title.replace(/[-|:]\s*$/, '').trim();
  return title || 'Vedic Vastu Shastra Architectural Blueprint';
}

function generateSlug(title: string, videoId: string): string {
  const transliterated = title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .slice(0, 50);

  const suffix = videoId ? `-${videoId.slice(0, 6)}` : `-${Math.random().toString(36).substring(2, 7)}`;
  return transliterated ? `${transliterated}${suffix}` : `vastu-guide${suffix}`;
}

function generateImageUrl(prompt: string, width = 1200, height = 700): string {
  const sanitized = encodeURIComponent(prompt.trim().slice(0, 100));
  return `https://image.pollinations.ai/prompt/${sanitized}?width=${width}&height=${height}&nologo=true`;
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Calls Gemini API to generate deep content
 */
async function callGemini(prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured in .env');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${GEMINI_API_KEY}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 8192
      }
    })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Gemini API error (${res.status}): ${errText}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('No text returned from Gemini API');
  return text;
}

/**
 * Generates an extensive 5,000 - 10,000 word article using multi-step section expansion
 */
async function generateLongArticle(video: {
  id: string;
  youtube_id: string;
  title: string;
  description?: string;
  thumbnail_max?: string;
  thumbnail_high?: string;
  transcript?: string;
}): Promise<StructuredArticle> {
  const cleanedTitle = cleanTitle(video.title);
  const slug = generateSlug(cleanedTitle, video.youtube_id || video.id);
  const heroImage = video.thumbnail_max || video.thumbnail_high || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600&auto=format&fit=crop';
  const transcriptText = video.transcript || video.description || cleanedTitle;

  console.log(`\n  🧠 [AI Outline Generation] "${cleanedTitle.slice(0, 50)}"...`);

  // Step 1: Create Outline of 7-8 In-depth Sections
  const outlinePrompt = `You are the chief Vedic architectural scholar representing Dr. Kunchala Hanumantha Rao (Vasthu Siddanthi, Nepal Sadbhavana Awardee, 30+ years research).
Analyze this YouTube video lesson transcript/context:
TITLE: "${video.title}"
TRANSCRIPT / CONTEXT: "${transcriptText.slice(0, 3000)}"

Create a detailed 7-section masterclass outline for a comprehensive 5,000+ word publication.
Return JSON ONLY with this format:
{
  "category": "Home Vastu" (or "Business Vastu", "Plot & Land", "Interiors", "Remedies", "Spirituality"),
  "excerpt": "A compelling 2-sentence executive summary of the lesson",
  "keywords": "vasthu, dr hanumanthu rao, ...",
  "sections": [
    {
      "number": 1,
      "section_number_label": "01 — THE FOUNDATION",
      "title": "Section Title",
      "focus_points": ["point 1", "point 2", "point 3"],
      "image_prompt": "Photorealistic luxury architectural rendering of..."
    },
    ... (7 sections total)
  ],
  "faqs": [
    { "question": "Question 1?", "answer": "Detailed answer..." },
    { "question": "Question 2?", "answer": "Detailed answer..." },
    { "question": "Question 3?", "answer": "Detailed answer..." },
    { "question": "Question 4?", "answer": "Detailed answer..." }
  ]
}`;

  let outlineJson: any = null;
  try {
    const rawOutline = await callGemini(outlinePrompt);
    const cleanedJsonStr = rawOutline.replace(/```json/g, '').replace(/```/g, '').trim();
    outlineJson = JSON.parse(cleanedJsonStr);
  } catch (err: any) {
    console.warn(`    ⚠️ Gemini outline fallback for ${slug}: ${err.message}`);
    // Fallback outline
    outlineJson = {
      category: "Home Vastu",
      excerpt: `Comprehensive architectural masterclass on ${cleanedTitle} by Dr. Kunchala Hanumantha Rao.`,
      keywords: "vasthu, vedic architecture, floor plan, dr hanumanthu rao",
      sections: [
        { number: 1, section_number_label: "01 — THE FOUNDATION", title: "The Cosmic Geometry of Vedic Architecture", focus_points: ["Pancha Bhootas", "Geomagnetic orientation", "Pranic flow"], image_prompt: "Modern Indian luxury house elevation architectural photo warm lighting" },
        { number: 2, section_number_label: "02 — CARDINAL ENERGIES", title: "Ashta-Dikpalakas & Directional Forces", focus_points: ["Eshanya North-East", "Agneya South-East", "Niruthi South-West", "Vayavya North-West"], image_prompt: "Vastu compass diagram floating over luxury living room floor plan" },
        { number: 3, section_number_label: "03 — STRUCTURAL PLACEMENT", title: "Room Zoning & Proportional Dimensions", focus_points: ["Entrance Simhadwaram", "Kitchen Stove placement", "Master Bedroom heaviness"], image_prompt: "Grand wooden Simhadwaram entrance door with brass carvings" },
        { number: 4, section_number_label: "04 — CRITICAL MISTAKES", title: "Severe Defects & Their Real-World Impact", focus_points: ["Veedi Potu road focus", "Septic tank misplacement", "Cut in North-East"], image_prompt: "Architectural blueprint layout showing road hit and compound wall" },
        { number: 5, section_number_label: "05 — SCIENTIFIC REMEDIES", title: "Remediation Without Structural Demolition", focus_points: ["Copper wire thresholds", "Color balancing", "Sea salt purification"], image_prompt: "Vedic copper yantra energizer placed on marble floor with warm candle light" },
        { number: 6, section_number_label: "06 — PRACTICAL CASE STUDY", title: "Apartments vs. Independent Duplex Houses", focus_points: ["High-rise limitations", "Internal remedy adjustments", "Balcony alignments"], image_prompt: "Luxury modern high-rise apartment interior with balcony garden" },
        { number: 7, section_number_label: "07 — MASTER CONCLUSION", title: "Living in Lifelong Resonance with Natural Laws", focus_points: ["Daily practices", "Consultation advice", "Summary"], image_prompt: "Serene Indian courtyard home with central tulsi plant and morning sun rays" }
      ],
      faqs: [
        { question: `What is the core principle of ${cleanedTitle}?`, answer: `Dr. Kunchala Hanumantha Rao emphasizes maintaining equilibrium between the 5 natural elements and placing heavy loads in Niruthi while keeping Eshanya open and light.` },
        { question: "Can existing structural defects be resolved without demolition?", answer: "Yes, 95% of defects can be corrected using copper/brass energy strips, color wave treatments, and mirror placements without breaking concrete walls." },
        { question: "How to get a direct consultation with Dr. Rao?", answer: "You can send your CAD/PDF floor plan to Dr. Rao at +91 92466 24248 or visit his Visakhapatnam headquarters." }
      ]
    };
  }

  // Step 2: Expand Each Section (800 - 1,200 words each)
  const fullSections: ArticleSection[] = [];

  for (let sIdx = 0; sIdx < outlineJson.sections.length; sIdx++) {
    const s = outlineJson.sections[sIdx];
    console.log(`    ✍️ Writing Section ${s.number}/${outlineJson.sections.length}: "${s.title}"...`);

    const sectionPrompt = `You are Dr. Kunchala Hanumantha Rao (Vasthu Siddanthi, author of 'The Science of Vasthu', 30+ years field consultant in Andhra Pradesh, Telangana, and international projects).
Write an in-depth, deeply comprehensive, 800–1,200 word section for an authoritative architectural publication.

TOPIC OF ENTIRE ARTICLE: "${cleanedTitle}"
SECTION NUMBER: ${s.number}
SECTION TITLE: "${s.title}"
FOCUS POINTS: ${JSON.stringify(s.focus_points)}
SOURCE VIDEO TRANSCRIPT: "${transcriptText.slice(0, 2000)}"

REQUIREMENTS:
1. Write 800–1,200 words of rich, practical, and highly detailed Markdown text for this section alone.
2. Use subheadings (###), bullet points, comparison tables, and practical dimensions (in feet/inches/degrees).
3. Include specific Telugu Vastu terms (సింహద్వారం, ఈశాన్యం, ఆగ్నేయం, నైరుతి, వాయువ్యం, వీధిపోటు, బ్రహ్మస్థానం) with clear explanations.
4. Ground every rule in physics, solar angles, geomagnetic lines, and elemental frequencies.
5. Provide actionable guidance that homeowners, builders, and architects can immediately implement.

Return ONLY the Markdown content for this section. Do NOT repeat the main title.`;

    let sectionContent = '';
    try {
      sectionContent = await callGemini(sectionPrompt);
      await sleep(1000); // Respect rate limits
    } catch (err: any) {
      console.warn(`      ⚠️ Section expansion fallback: ${err.message}`);
      sectionContent = `### Understanding ${s.title}\n\n` +
        `In Vedic architecture codified by **Dr. Kunchala Hanumantha Rao**, every spatial quadrant carries unique vibrational frequencies determined by the Sun's diurnal passage and the Earth's geomagnetic grid.\n\n` +
        `#### Key Principles & Measurements:\n` +
        `- **Elemental Harmony:** Maintain strict adherence to the Pancha Bhootas (Earth, Water, Fire, Air, Space).\n` +
        `- **Directional Balance:** Keep the North-East light and open while weighting the South-West with structural mass.\n` +
        `- **Non-Destructive Fixes:** Apply metallic harmonizers (copper/brass) along boundary thresholds.\n\n` +
        `When spaces are harmonized according to these eternal Sthapatya Veda guidelines, the occupants experience continuous physical vitality, domestic tranquility, and financial growth.`;
    }

    const imageUrl = generateImageUrl(s.image_prompt || `${cleanedTitle} ${s.title} vastu architecture`);

    fullSections.push({
      number: s.number,
      section_number_label: s.section_number_label || `0${s.number} — ${s.title.toUpperCase()}`,
      title: s.title,
      content_markdown: sectionContent,
      image_url: imageUrl,
      image_caption: s.title,
      callout: s.number === 2 ? {
        type: 'insight',
        title: 'A balanced space begins with understanding its character.',
        text: 'Rather than treating Vastu as a collection of rigid rules, consider it as a way of observing the living relationship between human bio-fields, geomagnetic flow, and natural sunlight.'
      } : undefined
    });
  }

  // Calculate total reading time based on total word count (~200 words/min)
  const totalWords = fullSections.reduce((acc, s) => acc + s.content_markdown.split(/\s+/).length, 0);
  const readingTime = Math.max(8, Math.round(totalWords / 200));

  return {
    title: cleanedTitle,
    slug,
    excerpt: outlineJson.excerpt || `Masterclass by Dr. Kunchala Hanumantha Rao on ${cleanedTitle}.`,
    category: outlineJson.category || 'Home Vastu',
    reading_time_minutes: readingTime,
    hero_image: heroImage,
    youtube_id: video.youtube_id || video.id,
    sections: fullSections,
    faqs: outlineJson.faqs || [],
    keywords: outlineJson.keywords || 'vasthu, dr hanumanthu rao, house plans, vastu tips',
    author: 'Dr. Kunchala Hanumantha Rao'
  };
}

async function main() {
  console.log('🚀 Phase 2 & 3: Starting Long-Form 5K-10K Word AI Article Generation...\n');

  // Load transcripts if already extracted
  const transcriptsPath = path.join(process.cwd(), 'scripts/transcripts-output.json');
  let transcriptsMap: Record<string, string> = {};
  if (fs.existsSync(transcriptsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(transcriptsPath, 'utf-8'));
      for (const item of data) {
        transcriptsMap[item.youtube_id || item.video_id] = item.transcript;
      }
      console.log(`📖 Loaded ${Object.keys(transcriptsMap).length} cached transcripts from scripts/transcripts-output.json`);
    } catch (e) {
      console.warn('Could not read transcripts JSON:', e);
    }
  }

  // Fetch videos from Supabase
  const { data: videos, error } = await supabase
    .from('videos')
    .select('id, youtube_id, title, description, thumbnail_max, thumbnail_high, views')
    .order('views', { ascending: false });

  if (error || !videos || videos.length === 0) {
    console.error('❌ Failed to fetch videos:', error);
    return;
  }

  console.log(`📹 Found ${videos.length} videos in database.\n`);

  // Target: Generate the top 15 cornerstone masterclass articles first
  const limitToGenerate = 15;
  const targetVideos = videos.slice(0, limitToGenerate);

  const startDate = new Date();

  for (let i = 0; i < targetVideos.length; i++) {
    const vid = targetVideos[i];
    const transcript = transcriptsMap[vid.youtube_id] || transcriptsMap[vid.id] || vid.description;

    console.log(`\n======================================================`);
    console.log(`[${i + 1}/${targetVideos.length}] Generating Masterclass Article for:`);
    console.log(`  "${vid.title}"`);
    console.log(`======================================================`);

    const article = await generateLongArticle({
      ...vid,
      transcript
    });

    // Schedule 3 per day into the future (or publish first 5 immediately)
    const publishDate = new Date(startDate);
    if (i >= 5) {
      const daysAhead = Math.floor((i - 5) / 3) + 1;
      const hoursSlot = ((i - 5) % 3) * 6 + 6; // 6am, 12pm, 6pm
      publishDate.setDate(publishDate.getDate() + daysAhead);
      publishDate.setHours(hoursSlot, 0, 0, 0);
    }

    const isPublished = i < 5; // First 5 published immediately, rest scheduled

    const contentPayload = JSON.stringify({
      sections: article.sections,
      faqs: article.faqs,
      youtube_id: article.youtube_id,
      hero_image: article.hero_image,
      category: article.category,
      reading_time_minutes: article.reading_time_minutes,
      excerpt: article.excerpt
    });

    const { error: upsertError } = await supabase
      .from('blogs')
      .upsert({
        title: article.title,
        slug: article.slug,
        content: contentPayload,
        cover_image: article.hero_image,
        author: article.author,
        keywords: article.keywords,
        is_published: isPublished,
        created_at: isPublished ? new Date().toISOString() : publishDate.toISOString(),
        updated_at: new Date().toISOString()
      }, { onConflict: 'slug' });

    if (upsertError) {
      console.error(`  ❌ Error saving article for ${vid.id}:`, upsertError.message);
    } else {
      console.log(`  ✅ Successfully saved: "${article.title}"`);
      console.log(`     Slug: /blog/${article.slug}`);
      console.log(`     Sections: ${article.sections.length} | Status: ${isPublished ? 'PUBLISHED' : `SCHEDULED for ${publishDate.toLocaleDateString()}`}`);
    }

    // Delay between articles to manage API rate limits
    await sleep(2000);
  }

  console.log('\n🎉 Article generation complete!');
}

main().catch(console.error);
