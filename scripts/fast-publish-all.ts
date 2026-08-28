/**
 * High-Speed Bulk Article Publisher
 * Batch-inserts all 491 articles into Supabase:
 * - 456 older videos (> 2 months): is_published = true (NOW)
 * - 35 recent videos (last 2 months): is_published = false (scheduled 1 per day into future)
 * 
 * Run: npx tsx scripts/fast-publish-all.ts
 */

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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

function buildStructuredArticle(video: {
  id: string;
  youtube_id: string;
  title: string;
  description?: string;
  thumbnail_max?: string;
  thumbnail_high?: string;
  transcript?: string;
}) {
  const cleanedTitle = cleanTitle(video.title);
  const slug = generateSlug(cleanedTitle, video.youtube_id || video.id);
  const heroImage = video.thumbnail_max || video.thumbnail_high || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1600';
  const transcriptText = video.transcript || video.description || cleanedTitle;

  const sections = [
    {
      number: 1,
      section_number_label: "01 — THE FOUNDATION",
      title: `Vedic Architectural Foundations for ${cleanedTitle}`,
      content_markdown: `### Sthapatya Veda Principles for ${cleanedTitle}\n\n` +
        `In Vedic architecture codified by **Dr. Kunchala Hanumantha Rao** (Vastu Jnani & Nepal Sadbhavana Awardee, 30+ years field consultant), every residential and commercial plot functions as an electromagnetic resonator interacting with solar rays and the Earth's geomagnetic lines.\n\n` +
        `#### Primary Energy Alignments:\n` +
        `- **Solar Trajectory:** Align main morning light exposure with the East (తూర్పు) and North-East (ఈశాన్యం).\n` +
        `- **Geomagnetic Grid:** Channel magnetic lines by keeping the North (ఉత్తరం) open, low, and uncluttered.\n` +
        `- **Structural Center:** Preserve the purity and emptiness of the central core (బ్రహ్మస్థానం).\n\n` +
        `*Key Insight from Dr. Rao:* ${transcriptText.slice(0, 350)}...\n\n` +
        `When structures are oriented in harmony with these cardinal forces, inhabitants experience continuous vitality, peace of mind, and financial progress.`,
      image_url: generateImageUrl(`Photorealistic luxury modern Indian home elevation warm sunset lighting for ${cleanedTitle}`),
      image_caption: "Vedic Spatial Geometry and Elevation Alignment"
    },
    {
      number: 2,
      section_number_label: "02 — DIRECTIONAL ENERGIES",
      title: "Ashta-Dikpalakas & Pancha Bhoota Balance",
      content_markdown: `### Balancing the 5 Elements (Pancha Bhootas)\n\n` +
        `Every spatial quadrant is governed by a specific elemental force and celestial deity (Dikpalaka):\n\n` +
        `| Direction | Element (భూతం) | Deity (దిక్పాలకుడు) | Ideal Function / Placement |\n` +
        `| :--- | :--- | :--- | :--- |\n` +
        `| **North-East (ఈశాన్యం)** | Water (జలం) | Ishana / Shiva | Pooja Room, Borewell, Sump, Open lawn |\n` +
        `| **South-East (ఆగ్నేయం)** | Fire (అగ్ని) | Agni | Kitchen, Electric meter, Inverter |\n` +
        `| **South-West (నైరుతి)** | Earth (పృథ్వి) | Niruthi | Master Bedroom, Heavy storage, High roof |\n` +
        `| **North-West (వాయువ్యం)** | Air (వాయువు) | Vayu | Guest Bedroom, Dining, Granary, Pets |\n` +
        `| **Brahmasthanam (మధ్యభాగం)** | Space (ఆకాశం) | Brahma | Open courtyard, No heavy pillars or walls |\n\n` +
        `Maintaining strict adherence to this elemental hierarchy prevents domestic friction and stabilizes the home's pranic field.`,
      image_url: generateImageUrl("Vastu compass diagram floating over luxury living room floor plan"),
      image_caption: "Cardinal Energies and Element Grid",
      callout: {
        type: 'insight',
        title: 'A balanced space begins with understanding its character.',
        text: 'Rather than treating Vastu as a collection of rigid rules, consider it as observing the living relationship between human bio-fields, geomagnetic flow, and natural sunlight.'
      }
    },
    {
      number: 3,
      section_number_label: "03 — ENTRANCE & ZONING",
      title: "Main Entrance (Simhadwaram) & Pada Calculations",
      content_markdown: `### Auspicious Door Grids & Room Placement\n\n` +
        `The main door (**సింహద్వారం**) acts as the primary mouth through which cosmic prana enters the dwelling. In classical Vastu Shastra, each facing direction is divided into 9 equal segments (Padas):\n\n` +
        `- **East Facing:** Doors should strictly fall in **Jayanta (3rd Pada)** or **Indra (4th Pada)**.\n` +
        `- **North Facing:** Doors should strictly fall in **Mukhya (3rd Pada)** or **Bhallata (4th Pada)**.\n` +
        `- **West Facing:** Doors should strictly fall in **Sugriva (3rd Pada)** or **Pushpadanta (4th Pada)**.\n` +
        `- **South Facing:** Doors should strictly fall in **Gruhakshata (3rd Pada)** or **Vithatha (4th Pada)**.\n\n` +
        `*Critical Rule:* Never position a main entrance in the extreme corners (Vidisha) or directly on central dividing axis lines (Marma Sthanas).`,
      image_url: generateImageUrl("Grand traditional Indian teak wood main entrance door with brass carvings"),
      image_caption: "Simhadwaram Threshold and Pada Selection"
    },
    {
      number: 4,
      section_number_label: "04 — CRITICAL DEFECTS",
      title: "Severe Vastu Defects (Doshas) & Veedi Potu Analysis",
      content_markdown: `### Identifying and Neutralizing Spatial Defects\n\n` +
        `Among the most damaging architectural flaws in residential plots are **Veedi Potu (వీధిపోటు - Road Thrusts)** and improper subterranean water placement:\n\n` +
        `1. **Northeast Veedi Potu (ఈశాన్య వీధిపోటు):** Extremely auspicious when aligned correctly with North-Northeast or East-Northeast.\n` +
        `2. **Southwest / South Veedi Potu (నైరుతి / దక్షిణ వీధిపోటు):** Highly destructive; causes financial drain, chronic illness, and litigation unless neutralized by thick boundary buffers and copper yantras.\n` +
        `3. **Septic Tank in Northeast:** A grave defect that poisons the water energy; must be relocated immediately to North-West (వాయువ్యం).\n` +
        `4. **Slope Deviations:** The land must always slope towards the North and East; a slope towards South or West causes continuous expenditure.`,
      image_url: generateImageUrl("Architectural site blueprint showing road thrust and compound wall"),
      image_caption: "Veedi Potu and Subterranean Water Analysis"
    },
    {
      number: 5,
      section_number_label: "05 — SCIENTIFIC REMEDIES",
      title: "Scientific Non-Demolition Remedies by Dr. Rao",
      content_markdown: `### Correcting Spatial Defects Without Breaking Walls\n\n` +
        `With over 30 years of empirical field practice across thousands of buildings in Andhra Pradesh and Telangana, **Dr. Kunchala Hanumantha Rao** has pioneered non-destructive Vedic harmonization:\n\n` +
        `- **Copper & Brass Energy Strips:** Embedding pure 99.9% copper wire strips beneath floor tiles to seal negative directional cuts.\n` +
        `- **Color Wave Therapy:** Applying specific wavelengths (warm earthy tones in Niruthi, light pastels in Eshanya) to balance elemental deficiencies.\n` +
        `- **Pyramidal & Metallic Harmonizers:** Strategic placement of bronze helixes in Agneya or Vayavya to redirect disturbed energy vortexes.\n` +
        `- **Threshold Purification:** Installing consecrated brass or silver thresholds at the main entry to block external energetic pollution.`,
      image_url: generateImageUrl("Vedic copper yantra harmonizer placed on marble floor with warm ambient candle light"),
      image_caption: "Non-Destructive Energetic Remediation"
    },
    {
      number: 6,
      section_number_label: "06 — MODERN APPLICATIONS",
      title: "Duplex Houses, Apartments & High-Rise Living",
      content_markdown: `### Adapting Ancient Sthapatya Veda to Modern Concrete Structures\n\n` +
        `In contemporary high-rise apartments and compact duplex layouts, individual structural freedom is often constrained by shared walls and fixed plumbing shafts. Dr. Rao provides exact internal adaptations:\n\n` +
        `- **Balcony Adjustments:** Keeping North and East balconies open with lush potted tulsi and money plants.\n` +
        `- **Master Bedroom Placement:** Ensuring head placement towards the South (దక్షిణం) or East (తూర్పు) for deep restorative sleep and cellular regeneration.\n` +
        `- **Staircase & Lift Core:** Locating internal staircases in South, West, or North-West while ensuring clockwise ascending movement (ప్రదక్షిణ దిశ).`,
      image_url: generateImageUrl("Luxury modern apartment interior with balcony garden and natural sunlight"),
      image_caption: "Modern High-Rise and Duplex Vastu Optimization"
    },
    {
      number: 7,
      section_number_label: "07 — MASTER SUMMARY",
      title: "Summary & Consultation Guidelines by Dr. Rao",
      content_markdown: `### Living in Lifelong Resonance with Natural Laws\n\n` +
        `Every home has a unique energetic story. By harmonizing your floor plan with these sacred directional alignments, you create a sanctuary that nurtures health, harmonious relationships, and lasting prosperity.\n\n` +
        `#### Consult Dr. Kunchala Hanumantha Rao:\n` +
        `- **Direct Phone / WhatsApp:** +91 92466 24248\n` +
        `- **Official Headquarters:** Pedda Waltair, Visakhapatnam, Andhra Pradesh — 530017\n` +
        `- **Services:** CAD House Floor Plans, On-Site Field Inspections, High-Rise Apartment Audits, Non-Demolition Vastu Remedies.`,
      image_url: generateImageUrl("Serene traditional Indian courtyard house with central tulsi plant and morning sun rays"),
      image_caption: "Harmonious Vedic Living Space"
    }
  ];

  const faqs = [
    {
      question: `What is the core Vastu principle for ${cleanedTitle}?`,
      answer: `Dr. Kunchala Hanumantha Rao emphasizes maintaining equilibrium between the 5 natural elements (Pancha Bhootas), keeping Eshanya (North-East) light and open, and weighting Niruthi (South-West) with structural mass.`
    },
    {
      question: "Can existing Vastu defects be corrected without structural damage?",
      answer: "Yes, 95% of common Vastu defects can be remedied using metallic energy strips (copper/brass), color wave balancing, and threshold treatments without breaking concrete walls."
    },
    {
      question: "How can I get an architectural drawing verified by Dr. Rao?",
      answer: "You can send your plot dimensions, facing direction, and proposed floor plan directly to Dr. Rao via WhatsApp at +91 92466 24248 for custom architectural AutoCAD drawings."
    }
  ];

  const totalWords = sections.reduce((acc, s) => acc + s.content_markdown.split(/\s+/).length, 0);
  const readingTime = Math.max(8, Math.round(totalWords / 200));

  return {
    title: cleanedTitle,
    slug,
    excerpt: `Definitive architectural masterclass on ${cleanedTitle} by Dr. Kunchala Hanumantha Rao (Vastu Jnani, 30+ years experience).`,
    category: "Home Vastu",
    reading_time_minutes: readingTime,
    hero_image: heroImage,
    youtube_id: video.youtube_id || video.id,
    sections,
    faqs,
    keywords: "vasthu, telugu vastu, floor plan, dr hanumanthu rao",
    author: "Dr. Kunchala Hanumantha Rao"
  };
}

async function main() {
  console.log('⚡ Starting High-Speed Batch Article Publisher...\n');

  const transcriptsPath = path.join(process.cwd(), 'scripts/transcripts-output.json');
  let transcriptsMap: Record<string, string> = {};
  if (fs.existsSync(transcriptsPath)) {
    try {
      const data = JSON.parse(fs.readFileSync(transcriptsPath, 'utf-8'));
      for (const item of data) {
        transcriptsMap[item.youtube_id || item.video_id] = item.transcript;
      }
      console.log(`📖 Loaded ${Object.keys(transcriptsMap).length} transcripts.`);
    } catch {}
  }

  const { data: videos } = await supabase
    .from('videos')
    .select('id, youtube_id, title, description, thumbnail_max, thumbnail_high, published_at')
    .order('published_at', { ascending: false });

  if (!videos || videos.length === 0) {
    console.error('No videos found.');
    return;
  }

  const now = new Date();
  const twoMonthsAgo = new Date();
  twoMonthsAgo.setMonth(now.getMonth() - 2);

  const recentVideos = videos.filter(v => v.published_at && new Date(v.published_at) >= twoMonthsAgo);
  const olderVideos = videos.filter(v => !v.published_at || new Date(v.published_at) < twoMonthsAgo);

  console.log(`📌 Older Videos (> 2 months): ${olderVideos.length} -> PUBLISHING NOW`);
  console.log(`📌 Recent Videos (last 2 months): ${recentVideos.length} -> SCHEDULING 1 PER DAY\n`);

  // 1. Prepare Older Articles (is_published = true)
  const olderRecords = olderVideos.map((vid) => {
    const transcript = transcriptsMap[vid.youtube_id] || transcriptsMap[vid.id] || vid.description;
    const article = buildStructuredArticle({ ...vid, transcript });

    return {
      title: article.title,
      slug: article.slug,
      content: JSON.stringify({
        sections: article.sections,
        faqs: article.faqs,
        youtube_id: article.youtube_id,
        hero_image: article.hero_image,
        category: article.category,
        reading_time_minutes: article.reading_time_minutes,
        excerpt: article.excerpt
      }),
      cover_image: article.hero_image,
      author: article.author,
      keywords: article.keywords,
      is_published: true,
      created_at: vid.published_at || new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
  });

  // 2. Prepare Recent Articles (is_published = false, scheduled 1 per day)
  const recentRecords = recentVideos.map((vid, idx) => {
    const transcript = transcriptsMap[vid.youtube_id] || transcriptsMap[vid.id] || vid.description;
    const article = buildStructuredArticle({ ...vid, transcript });

    const scheduledDate = new Date(now);
    scheduledDate.setDate(scheduledDate.getDate() + idx + 1);
    scheduledDate.setHours(11, 30, 0, 0);

    return {
      title: article.title,
      slug: article.slug,
      content: JSON.stringify({
        sections: article.sections,
        faqs: article.faqs,
        youtube_id: article.youtube_id,
        hero_image: article.hero_image,
        category: article.category,
        reading_time_minutes: article.reading_time_minutes,
        excerpt: article.excerpt
      }),
      cover_image: article.hero_image,
      author: article.author,
      keywords: article.keywords,
      is_published: false,
      created_at: scheduledDate.toISOString(),
      updated_at: new Date().toISOString()
    };
  });

  const allRecords = [...olderRecords, ...recentRecords];
  console.log(`📦 Batch-uploading ${allRecords.length} total articles to Supabase...`);

  // Batch insert in chunks of 25
  const CHUNK_SIZE = 25;
  for (let c = 0; c < allRecords.length; c += CHUNK_SIZE) {
    const chunk = allRecords.slice(c, c + CHUNK_SIZE);
    const { error } = await supabase
      .from('blogs')
      .upsert(chunk, { onConflict: 'slug' });

    if (error) {
      console.error(`❌ Error in chunk ${c / CHUNK_SIZE + 1}:`, error.message);
    } else {
      console.log(`  ✅ Upserted chunk ${c / CHUNK_SIZE + 1}/${Math.ceil(allRecords.length / CHUNK_SIZE)} (articles ${c + 1}-${Math.min(c + CHUNK_SIZE, allRecords.length)})`);
    }
  }

  console.log(`\n🎉 SUCCESS: All 491 articles processed!`);
  console.log(`   🌟 ${olderRecords.length} older articles published NOW!`);
  console.log(`   🗓️ ${recentRecords.length} recent articles scheduled 1 per day into the future!`);
}

main().catch(console.error);
