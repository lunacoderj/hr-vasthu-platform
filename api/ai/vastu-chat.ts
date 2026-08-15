import { createClient } from '@supabase/supabase-js';

// Vastu Directional Knowledge Base Matrix for Instant Sub-second Fallback & Context
const VASTU_KNOWLEDGE_BASE: Record<string, {
  direction: string;
  element: string;
  ruler: string;
  tips: string[];
  recommendation: string;
}> = {
  pooja: {
    direction: 'North-East (Eshanya / ఈశాన్యం)',
    element: 'Water / Ether (జలం / ఆకాశం)',
    ruler: 'Lord Shiva / Ishana',
    tips: [
      'Always face East or North while praying 🕉️',
      'Keep the North-East zone clutter-free and lightweight ☀️',
      'Never place the Pooja room adjacent to or beneath a toilet/bathroom 🚫'
    ],
    recommendation: 'The North-East is the sacred Eshanya corner, the highest source of positive cosmic and solar energy.'
  },
  kitchen: {
    direction: 'South-East (Agneya / ఆగ్నేయం)',
    element: 'Fire (అగ్ని)',
    ruler: 'Lord Agni',
    tips: [
      'Cook facing East for health and domestic harmony 🍳',
      'Sink (Water) and Stove (Fire) should never be placed immediately side by side 💧🔥',
      'North-West (Vayavya) is the best alternative if South-East is occupied 🌬️'
    ],
    recommendation: 'South-East is ruled by Agni Deva. Placing fire elements here brings health, vitality, and wealth.'
  },
  entrance: {
    direction: 'North-East, East, or North (ఉత్తరం / తూర్పు / ఈశాన్యం)',
    element: 'Solar & Magnetic Flow (సౌర & అయస్కాంత శక్తి)',
    ruler: 'Lord Kubera & Indra',
    tips: [
      'Main entrance (Simhadwaram) should be the largest door in the house 🚪',
      'Keep entrance well-lit with auspicious symbols like Swastik or Om 🌟',
      'Avoid shoe racks or heavy obstructions right in front of the main threshold 🧹'
    ],
    recommendation: 'The main door is the mouth of cosmic energy (Prana). East and North entrances attract prosperity and career growth.'
  },
  bedroom: {
    direction: 'South-West (Niruthi / నైరుతి)',
    element: 'Earth (పృథ్వి)',
    ruler: 'Lord Niruthi',
    tips: [
      'Head should point towards South or East while sleeping for restful sleep and longevity 🛌',
      'Master bedroom must always be in the South-West to maintain family stability and authority 👑',
      'Avoid mirrors facing the bed directly 🪞'
    ],
    recommendation: 'The South-West represents stability, heavy earth energy, and leadership. Ideal for the master of the house.'
  },
  toilet: {
    direction: 'North-West (Vayavya) or South of South-West (వాయువ్యం)',
    element: 'Air / Elimination (వాయువు)',
    ruler: 'Lord Vayu',
    tips: [
      'Never locate toilets in North-East (Eshanya) or South-West (Niruthi) ⚠️',
      'Commode should align along North-South axis 🚽',
      'Keep toilet doors closed and use sea salt bowls to absorb negative vibrations 🧂'
    ],
    recommendation: 'Elimination zones must align with Vayavya (North-West) to dispel negative energy without disrupting positive cosmic flows.'
  },
  borewell: {
    direction: 'North-East (Eshanya / ఈశాన్యం)',
    element: 'Water (జలం)',
    ruler: 'Lord Varuna & Shiva',
    tips: [
      'Borewell, underground water sump, and open wells must strictly be in North-East 🌊',
      'Never dig underground water sumps in South-West, South, or South-East 🚫',
      'Overhead water tanks must be placed in South-West (Niruthi) on top of the terrace 🏗️'
    ],
    recommendation: 'Underground water in North-East attracts abundance and peace. Overhead tanks in South-West provide stability.'
  },
  staircase: {
    direction: 'South, West, or South-West (దక్షిణం / పశ్చిమం / నైరుతి)',
    element: 'Earth / Heavy Load (బరువు)',
    ruler: 'Lord Yama / Niruthi',
    tips: [
      'Staircases should always ascend clockwise (turning left to right) 🔄',
      'Keep odd number of steps (e.g. 15, 17, 19, 21) 🔢',
      'Never build a staircase in North-East (Eshanya) or Center (Brahmasthan) 🚫'
    ],
    recommendation: 'Heavy structures like staircases and overhead tanks must sit in South or South-West to anchor the building.'
  }
};

export default async function handler(req: any, res: any) {
  // Set CORS headers
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

  // 1. Initialize Supabase
  const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
  const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
  const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

  // 2. Fetch Relevant YouTube Videos from Supabase
  let searchKeywords = ['vastu'];
  if (lowerQuery.includes('kitchen') || lowerQuery.includes('వంట') || lowerQuery.includes('agneya')) searchKeywords = ['kitchen', 'agneya', 'south east'];
  else if (lowerQuery.includes('pooja') || lowerQuery.includes('పూజ') || lowerQuery.includes('mandir') || lowerQuery.includes('eshanya')) searchKeywords = ['pooja', 'eshanya', 'north east'];
  else if (lowerQuery.includes('entrance') || lowerQuery.includes('door') || lowerQuery.includes('ద్వారం') || lowerQuery.includes('east') || lowerQuery.includes('north')) searchKeywords = ['entrance', 'door', 'east', 'north'];
  else if (lowerQuery.includes('bedroom') || lowerQuery.includes('bed') || lowerQuery.includes('పడుకునే') || lowerQuery.includes('niruthi')) searchKeywords = ['bedroom', 'niruthi', 'south west'];
  else if (lowerQuery.includes('toilet') || lowerQuery.includes('bathroom') || lowerQuery.includes('లెట్రిన్')) searchKeywords = ['toilet', 'bathroom', 'vayavya'];
  else if (lowerQuery.includes('water') || lowerQuery.includes('bore') || lowerQuery.includes('బోరు') || lowerQuery.includes('సంప్')) searchKeywords = ['borewell', 'water', 'sump'];
  else if (lowerQuery.includes('stair') || lowerQuery.includes('మెట్లు')) searchKeywords = ['staircase', 'steps'];

  let matchedVideos: any[] = [];
  try {
    const { data: videos } = await supabase
      .from('videos')
      .select('id, title, thumbnail_medium, views, watch_url, embed_url, youtube_id')
      .order('views', { ascending: false })
      .limit(20);

    if (videos && videos.length > 0) {
      matchedVideos = videos.filter(v => {
        const text = (v.title + ' ' + (v.description || '')).toLowerCase();
        return searchKeywords.some(kw => text.includes(kw));
      }).slice(0, 3);

      if (matchedVideos.length === 0) {
        matchedVideos = videos.slice(0, 3);
      }
    }
  } catch (err) {
    console.error('Error fetching videos:', err);
  }

  // 3. Match Knowledge Base
  let matchedTopic = 'entrance';
  if (lowerQuery.includes('kitchen') || lowerQuery.includes('cook') || lowerQuery.includes('stove') || lowerQuery.includes('వంట')) matchedTopic = 'kitchen';
  else if (lowerQuery.includes('pooja') || lowerQuery.includes('temple') || lowerQuery.includes('god') || lowerQuery.includes('పూజ')) matchedTopic = 'pooja';
  else if (lowerQuery.includes('bedroom') || lowerQuery.includes('sleep') || lowerQuery.includes('bed') || lowerQuery.includes('పడుకునే')) matchedTopic = 'bedroom';
  else if (lowerQuery.includes('toilet') || lowerQuery.includes('bath') || lowerQuery.includes('commode') || lowerQuery.includes('లెట్రిన్')) matchedTopic = 'toilet';
  else if (lowerQuery.includes('bore') || lowerQuery.includes('water') || lowerQuery.includes('sump') || lowerQuery.includes('బోరు')) matchedTopic = 'borewell';
  else if (lowerQuery.includes('stair') || lowerQuery.includes('steps') || lowerQuery.includes('మెట్లు')) matchedTopic = 'staircase';

  const kb = VASTU_KNOWLEDGE_BASE[matchedTopic] || VASTU_KNOWLEDGE_BASE.entrance;

  // 4. Try Google Gemini API if GEMINI_API_KEY is provided, otherwise formulate expert Vedic response
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || process.env.YOUTUBE_API_KEY;
  let aiAnswerText = '';

  if (GEMINI_API_KEY) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const systemPrompt = `You are the Official AI Vastu Consultant representing Dr. Kunchala Hanumantha Rao (Vastu Jnani & Nepal Sadbhavana Awardee) on HR Vasthu (hrvasthu.com).
Provide an authoritative, clear, and inspiring answer to the user's Vastu Shastra query.
Use rich emojis (🧭, 🏠, ☀️, 🌊, 🕉️, 💡, 🚪, 🌿).
Mention the exact Cardinal Direction (e.g. North-East Eshanya, South-East Agneya, South-West Niruthi, North-West Vayavya) and Elemental Balance (Fire, Water, Earth, Air, Space).
If the user asks in Telugu, answer primarily in Telugu with English terms. If in English, answer in English.
Keep it structured:
1. Core Vastu Principle (2-3 sentences)
2. Key Dos & Don'ts (3 bullet points)
3. Remedy / Practical Advice by Dr. Rao.
End with an encouraging invitation to verify their floor plan with Dr. Rao.`;

      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUser Question: "${query}"` }]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 600
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const generated = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (generated) {
          aiAnswerText = generated;
        }
      }
    } catch (apiErr) {
      console.warn('Gemini API call failed, using built-in Vedic engine:', apiErr);
    }
  }

  // Fallback if Gemini not called or empty
  if (!aiAnswerText) {
    aiAnswerText = `### 🧭 Authentic Vastu Guidance for: "${query}"\n\n` +
      `**Optimal Direction:** **${kb.direction}** (Element: *${kb.element}* | Deity: *${kb.ruler}*)\n\n` +
      `${kb.recommendation}\n\n` +
      `#### 💡 Key Guidelines according to Dr. Kunchala Hanumantha Rao:\n` +
      kb.tips.map(t => `• ${t}`).join('\n') +
      `\n\n*Note: For complete layout verification and customized remedies, consult Dr. Kunchala Hanumantha Rao directly.*`;
  }

  return res.status(200).json({
    success: true,
    query,
    answer: aiAnswerText,
    directionBadge: kb.direction,
    keyPoints: kb.tips,
    recommendedVideos: matchedVideos,
    bookDownload: {
      title: 'The Science of Vasthu (Telugu & English Guides)',
      url: '/books',
    },
    whatsappCta: {
      number: '+91 92466 24248',
      url: `https://wa.me/919246624248?text=${encodeURIComponent(`Hello Dr. Rao, I used your website AI Assistant regarding "${query}". Please guide me on my house plan.`)}`,
      label: 'Consult Dr. Rao on WhatsApp'
    }
  });
}
