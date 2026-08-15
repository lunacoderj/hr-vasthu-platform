import { createClient } from '@supabase/supabase-js';

// Comprehensive Vastu Knowledge & Intent Knowledge Base
const INTENT_KNOWLEDGE_BASE: Record<string, {
  badge: string;
  answer: string;
  tips: string[];
  recommendedKeywords: string[];
}> = {
  contact: {
    badge: '📍 Official Contact & Office Location',
    answer: `### 📞 Dr. Kunchala Hanumantha Rao — Contact & Office Details\n\n` +
      `You can consult **Dr. Kunchala Hanumantha Rao** (Vastu Jnani & Nepal Sadbhavana Awardee) directly for residential, commercial, and architectural Vastu guidance:\n\n` +
      `• **Direct Phone / Call:** [+91 92466 24248](tel:+919246624248)\n` +
      `• **WhatsApp Consultation:** [+91 92466 24248](https://wa.me/919246624248)\n` +
      `• **Official Email:** [hrvasthu9@gmail.com](mailto:hrvasthu9@gmail.com)\n` +
      `• **Headquarters Office Address:** Opposite Rama Lakshmi Apartments, Pedda Waltair, Visakhapatnam, Andhra Pradesh, India — 530017\n` +
      `• **Consultation Hours:** 09:00 AM – 08:00 PM (Monday to Sunday)\n\n` +
      `*You can send your house floor plans or plot drawings directly on WhatsApp for review.*`,
    tips: [
      'Call +91 92466 24248 for immediate telephonic consultation 📞',
      'Share PDF/CAD house drawings on WhatsApp for floor plan verification 📐',
      'Direct on-site visits available across India & abroad on prior appointment ✈️'
    ],
    recommendedKeywords: ['consultation', 'contact', 'appointment']
  },
  drawings: {
    badge: '📐 Architectural Plans & Drawings',
    answer: `### 🏛️ 100% Vastu-Compliant House Plans & Architectural Drawings\n\n` +
      `Dr. Kunchala Hanumantha Rao provides complete scientific architectural drawing services customized to your plot dimensions:\n\n` +
      `• **Custom Floor Plans:** Ground & multi-floor layouts designed with perfect cardinal alignments.\n` +
      `• **Simhadwaram (Main Entrance) Coordinates:** Precision degree calculations for auspicious door placements.\n` +
      `• **Pancha Bhoota Layouts:** Kitchen (Fire), Pooja (Water/Ether), Master Bedroom (Earth), and Toilets (Air) positioned according to Vedic Shastra.\n` +
      `• **Corrections without Demolition:** Customized plan modifications for existing constructions.`,
    tips: [
      'Send your plot length, width, and road facing direction for a custom plan 📝',
      'All drawings include structural coordinates, room dimensions, and door/window placements 🚪',
      'Consultation available for residential homes, apartments, factories, and commercial complexes 🏢'
    ],
    recommendedKeywords: ['drawing', 'plan', 'house']
  },
  about: {
    badge: '🎖️ About Dr. Kunchala Hanumantha Rao',
    answer: `### 🕉️ Dr. Kunchala Hanumantha Rao — Vastu Jnani\n\n` +
      `**Dr. Kunchala Hanumantha Rao** is an internationally acclaimed Vedic Architecture and Vastu Shastra master with over 30+ years of dedicated research.\n\n` +
      `• **Honors:** Recipient of the prestigious **Nepal Sadbhavana Award** for outstanding contributions to traditional spatial science.\n` +
      `• **Author:** Author of foundational books including *"The Science of Vasthu"* in Telugu and English.\n` +
      `• **Media & Research:** Over 500+ video lessons and case studies analyzing road focus (Veedi Potu), commercial prosperity, and residential harmony.\n` +
      `• **Philosophy:** Practical, scientific Vedic solutions focused on energy flow without destructive demolitions.`,
    tips: [
      'Read his free digital books in the Books section 📚',
      'Watch 500+ verified video lectures on his YouTube channel 🎥',
      'Get personalized guidance directly from Dr. Rao 🤝'
    ],
    recommendedKeywords: ['about', 'books', 'videos']
  },
  pooja: {
    badge: '🧭 North-East (Eshanya / ఈశాన్యం) - Water & Ether',
    answer: `### 🕉️ Sacred Pooja Room Vastu Guidelines\n\n` +
      `The **North-East corner (Eshanya)** is ruled by Lord Shiva and represents the inflow of supreme cosmic energy (Ishanya Prana).\n\n` +
      `• **Ideal Facing:** Face **East** or **North** while performing worship and meditation.\n` +
      `• **Lightness & Purity:** Keep the North-East zone extremely clean, lightweight, and clutter-free.\n` +
      `• **Strict Prohibitions:** Never locate the Pooja room under a staircase, adjacent to a toilet wall, or above/below a bathroom.\n` +
      `• **Colors:** Use soft white, light yellow, or soothing cream tones.`,
    tips: [
      'Idols should not be pasted directly touching the wall; maintain a 1-inch gap 🪔',
      'Place holy water / copper Kalash in the North-East corner of the Mandir 💧',
      'Keep the Mandir elevated slightly on a wooden or marble platform 🪵'
    ],
    recommendedKeywords: ['pooja', 'eshanya', 'mandir']
  },
  kitchen: {
    badge: '🔥 South-East (Agneya / ఆగ్నేయం) - Fire Element',
    answer: `### 🍳 Kitchen Vastu Guidelines & Stove Orientation\n\n` +
      `The kitchen must always be aligned with the **Fire Element (Agni)** in the **South-East (Agneya)** corner:\n\n` +
      `• **Cooking Orientation:** The cook should face **East** while cooking to ensure health, longevity, and prosperity.\n` +
      `• **Water & Fire Separation:** The kitchen sink (Water) and cooking stove (Fire) should never be placed side-by-side or directly facing each other.\n` +
      `• **Secondary Alternative:** If South-East is unavailable, the **North-West (Vayavya)** is the best secondary location.\n` +
      `• **Avoid Strictly:** Never build a kitchen in the North-East (Eshanya) or South-West (Niruthi).`,
    tips: [
      'Store drinking water, water purifiers in the North-East side of the kitchen 💧',
      'Place refrigerators in the North-West or South-West zone 🧊',
      'Avoid dark black or blue granite countertops in the Agneya zone; use earthy or brown/maroon shades 🟤'
    ],
    recommendedKeywords: ['kitchen', 'agneya', 'cook']
  },
  entrance: {
    badge: '🚪 Main Entrance (Simhadwaram) - Auspicious Padas',
    answer: `### 🌟 Main Entrance (Simhadwaram) Vastu Principles\n\n` +
      `The main door is the primary gateway through which cosmic vitality (Prana) and wealth enter your residence:\n\n` +
      `• **Auspicious Directions:** **East (Jayanta / Indra Padas)** and **North (Kubera / Mukhya Padas)** are the most auspicious entrance orientations.\n` +
      `• **Proportions:** The Simhadwaram must be the largest, most majestic door in the entire house with two shutters opening clockwise inwards.\n` +
      `• **Threshold (Gadapa):** Maintain a proper auspicious wooden threshold to prevent positive energy from leaking out.\n` +
      `• **Avoid:** Never have a straight road focus (Veedi Potu) pointing into the entrance without remedies, and avoid shoe racks directly blocking the threshold.`,
    tips: [
      'Adorn the entrance with auspicious symbols like Swastik, Om, or Toranam 🌿',
      'Ensure the main door threshold is clean and well illuminated with warm light 💡',
      'The main door should never make squeaking or screeching sounds when opening 🚪'
    ],
    recommendedKeywords: ['entrance', 'simhadwaram', 'door']
  },
  bedroom: {
    badge: '🛏️ South-West (Niruthi / నైరుతి) - Earth Element',
    answer: `### 🛌 Master Bedroom & Sleeping Direction Vastu\n\n` +
      `The **South-West (Niruthi)** corner represents the Earth element (Prithvi), providing heavy stability, leadership, and emotional harmony:\n\n` +
      `• **Master Bedroom Location:** The head of the family should always occupy the South-West master bedroom to maintain family control and stability.\n` +
      `• **Sleeping Direction:** Sleep with your head pointing towards the **South** (highest geomagnetic harmony) or **East** (intellect & memory). Never sleep with head towards the North.\n` +
      `• **Bed Alignment:** Do not align the bed directly under an exposed concrete ceiling beam.\n` +
      `• **Mirrors:** Ensure mirrors or dressing tables do not reflect your body while sleeping in bed.`,
    tips: [
      'South head orientation enhances deep sleep, blood circulation, and longevity 💤',
      'Keep South-West walls heavy with sturdy wooden wardrobes and lockers 🚪',
      'Children and students should study in East or North-East bedrooms 📚'
    ],
    recommendedKeywords: ['bedroom', 'sleep', 'niruthi']
  },
  toilet: {
    badge: '🌬️ North-West (Vayavya) - Elimination Zone',
    answer: `### 🚽 Toilet & Bathroom Vastu Alignment\n\n` +
      `Sanitary and elimination zones carry heavy negative disposal energies and must be positioned with extreme care:\n\n` +
      `• **Best Location:** The **North-West (Vayavya)** corner or the **South-of-South-West** zone are the most suitable locations.\n` +
      `• **Strict Taboos:** Never place a toilet in the **North-East (Eshanya)** or **South-West (Niruthi)** — this leads to severe health and financial problems.\n` +
      `• **Commode Direction:** The commode should be aligned along the North-South axis so the user faces North or South.\n` +
      `• **Remedy for Existing Defects:** If a toilet cannot be relocated, keep toilet doors tightly closed and place a bowl of raw sea salt in the corner to absorb negative vibrations.`,
    tips: [
      'Never share a common wall between your Mandir and a toilet 🚫',
      'Place geysers and heaters in the South-East corner of the bathroom 🔥',
      'Ensure proper ventilation windows on the North or West walls 🪟'
    ],
    recommendedKeywords: ['toilet', 'bathroom', 'vayavya']
  },
  water: {
    badge: '🌊 Borewell & Water Sump - Eshanya / North-East',
    answer: `### 💧 Underground Water Sump & Borewell Vastu\n\n` +
      `Water placement determines financial liquidity and health according to Vedic architecture:\n\n` +
      `• **Underground Water:** Borewells, underground sumps, and open wells MUST strictly be located in the **North-East (Eshanya)**.\n` +
      `• **Overhead Water Tanks:** Overhead water storage tanks must be situated in the **South-West (Niruthi)** or **West** on top of the terrace to create the required weight.\n` +
      `• **Heavy Prohibition:** Never dig an underground sump in the South-West, South, or South-East zones.`,
    tips: [
      'Borewell in Eshanya brings wealth, career growth, and domestic happiness 🌊',
      'Overhead tank in Niruthi stabilizes family prosperity and leadership 🏗️',
      'Keep water drainage flowing from South/West towards North/East 💧'
    ],
    recommendedKeywords: ['borewell', 'water', 'sump']
  }
};

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { query, language = 'en' } = req.body || {};
  if (!query || typeof query !== 'string') {
    return res.status(400).json({ error: 'Query string is required' });
  }

  const lowerQuery = query.toLowerCase();

  // 1. Identify Intent / Topic with high precision
  let matchedKey = 'entrance';
  if (lowerQuery.match(/contact|phone|number|address|office|location|email|vizag|visakhapatnam|call|reach|whatsapp|కలవాలి|ఫోన్|నెంబర్|చిరునామా|ఎక్కడ/)) {
    matchedKey = 'contact';
  } else if (lowerQuery.match(/plan|drawing|blueprint|map|cad|plot|house plan|ప్లాన్|డ్రాయింగ్|నక్ష|ఇంటి ప్లాన్/)) {
    matchedKey = 'drawings';
  } else if (lowerQuery.match(/about|who is|rao|hanumantha|author|credentials|award|sadbhavana|nepal|గురించి|ఎవరు/)) {
    matchedKey = 'about';
  } else if (lowerQuery.match(/pooja|mandir|temple|god|prayer|eshanya|ఈశాన్యం|పూజ|దేవుడి/)) {
    matchedKey = 'pooja';
  } else if (lowerQuery.match(/kitchen|cook|stove|agneya|gas|cylinder|sink|ఆగ్నేయం|వంట|పొయ్యి/)) {
    matchedKey = 'kitchen';
  } else if (lowerQuery.match(/bedroom|bed|sleep|master|niruthi|నైరుతి|పడుకునే|పడకగది/)) {
    matchedKey = 'bedroom';
  } else if (lowerQuery.match(/toilet|bath|commode|latrine|septic|vayavya|వాయువ్యం|లెట్రిన్|బాత్రూమ్/)) {
    matchedKey = 'toilet';
  } else if (lowerQuery.match(/bore|water|sump|well|tank|overhead|బోరు|సంప్|నీరు|నీళ్ళ/)) {
    matchedKey = 'water';
  }

  const kb = INTENT_KNOWLEDGE_BASE[matchedKey] || INTENT_KNOWLEDGE_BASE.entrance;

  // 2. Fetch Relevant YouTube Videos from Supabase
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  let matchedVideos: any[] = [];
  try {
    const { data: videos } = await supabase
      .from('videos')
      .select('id, title, thumbnail_max, thumbnail_medium, views, watch_url, embed_url, youtube_id')
      .order('views', { ascending: false })
      .limit(25);

    if (videos && videos.length > 0) {
      const searchTerms = kb.recommendedKeywords;
      matchedVideos = videos.filter(v => {
        const text = (v.title + ' ' + (v.description || '')).toLowerCase();
        return searchTerms.some(term => text.includes(term));
      }).slice(0, 3);

      if (matchedVideos.length === 0) {
        matchedVideos = videos.slice(0, 3);
      }
    }
  } catch (err) {
    console.error('Error fetching videos in AI chat:', err);
  }

  // 3. Call Gemini 1.5 Flash API if configured
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.YOUTUBE_API_KEY;
  let aiAnswerText = '';

  if (GEMINI_API_KEY && matchedKey !== 'contact') {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const systemPrompt = `You are the Official AI Vastu Consultant representing Dr. Kunchala Hanumantha Rao (Vastu Jnani & Nepal Sadbhavana Awardee) on HR Vasthu (hrvasthu.com).
Provide an authoritative, clear, and comprehensive answer to the user's Vastu Shastra query.
Use rich markdown headings, bold terms, and descriptive emojis (🧭, 🏠, ☀️, 🌊, 🕉️, 💡, 🚪, 🌿).
If asked about contact or office, provide Dr. Rao's official phone +91 92466 24248, email hrvasthu9@gmail.com, Visakhapatnam headquarters.
Mention the exact Cardinal Direction (North-East Eshanya, South-East Agneya, South-West Niruthi, North-West Vayavya) and Elemental Balance (Fire, Water, Earth, Air, Space).
If asked in Telugu, answer primarily in Telugu with English terms. If in English, answer in English.
Structure:
1. Core Vastu Principle (2-3 sentences)
2. Crucial Dos and Don'ts Checklist (3-4 bullet points)
3. Remedy / Practical Advice by Dr. Rao.`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\nUser Question: "${query}"` }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 700 }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const generated = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generated) {
          aiAnswerText = generated;
        }
      }
    } catch (e: any) {
      console.warn('Gemini API call warning, using built-in knowledge base:', e.message);
    }
  }

  // Fallback to our curated Vedic Knowledge Engine
  if (!aiAnswerText) {
    aiAnswerText = kb.answer;
  }

  return res.status(200).json({
    success: true,
    query,
    answer: aiAnswerText,
    directionBadge: kb.badge,
    keyPoints: kb.tips,
    recommendedVideos: matchedVideos,
    whatsappCta: {
      number: '+91 92466 24248',
      url: `https://wa.me/919246624248?text=${encodeURIComponent(`Hello Dr. Rao, I used your website AI Assistant regarding "${query}". Please guide me.`)}`,
      label: 'Consult Dr. Rao on WhatsApp'
    }
  });
}
