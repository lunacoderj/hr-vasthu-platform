/**
 * Topic Extractor & Spatial Context Analyzer
 */

export interface TopicContext {
  category: string;
  focusTitle: string;
  discipline: string;
  foundations: string;
  elementalRules: string;
  dimensionalRules: string;
  defects: string;
  remedies: string;
  caseStudy: string;
  imagePromptTheme: string;
  customFaqs: { question: string; answer: string }[];
}

export function extractTopicContext(title: string, transcriptText: string): TopicContext {
  const combined = (title + ' ' + transcriptText).toLowerCase();

  // 1. West-Facing Plots
  if (combined.includes('పడమర') || combined.includes('west')) {
    return {
      category: 'Home Vastu',
      focusTitle: 'West-Facing (పడమర) Plots & Main Entrance Engineering',
      discipline: 'Orientation & Solar Ingress Geometry',
      foundations: 'West-facing houses require strict balancing of Varuna (solar sunset) energies and heavy boundary mass in Niruthi (South-West) to offset western thermal momentum.',
      elementalRules: 'Main entrance (సింహద్వారం) must strictly fall in Sugriva (3rd Pada) or Pushpadanta (4th Pada). Keep the West-North-West relatively open for wind passage.',
      dimensionalRules: 'Front western setback must be smaller than the eastern backyard setback to allow morning light to penetrate deep into the compound.',
      defects: 'Underground sumps or borewells placed in the West or South-West cause severe financial instability and chronic health distress.',
      remedies: 'Install pure copper grounding strips along the western threshold and plant tall, dense Ashoka trees along the western boundary wall.',
      caseStudy: 'In West-facing independent duplex houses, placing the master bedroom on the first floor in the South-West quadrant stabilizes the family head.',
      imagePromptTheme: 'Luxury West facing modern Indian villa elevation at golden hour with teak wood entrance and landscaped lawn',
      customFaqs: [
        { question: 'Is a West-facing house good according to Vastu?', answer: 'Yes! When the main door is correctly positioned in Sugriva or Pushpadanta Pada, West-facing homes bring immense prosperity and business success.' },
        { question: 'Where should the borewell be in a West-facing house?', answer: 'The borewell must always be located in the North-East (ఈశాన్యం) corner of the plot, never in the West or South-West.' },
        { question: 'Which room should be in the South-West of a West-facing home?', answer: 'The Master Bedroom should always be located in the South-West (నైరుతి) to maintain authority and structural heaviness.' }
      ]
    };
  }

  // 2. South-Facing Plots
  if (combined.includes('దక్షిణ') || combined.includes('south')) {
    return {
      category: 'Home Vastu',
      focusTitle: 'South-Facing (దక్షిణం) Plots & High-Elevation Rules',
      discipline: 'Thermal Mass & Mars/Yama Energy Management',
      foundations: 'South-facing homes demand maximal structural elevation and wall thickness in the southern facade to insulate against harsh afternoon thermal radiation.',
      elementalRules: 'The entrance (సింహద్వారం) must fall in Gruhakshata (3rd Pada) or Vithatha (4th Pada). Keep the southern boundary wall 1-2 feet higher than the northern wall.',
      dimensionalRules: 'Maintain a 1:1.5 setback ratio where southern setback is kept to a functional minimum while the northern open space is wide and unobstructed.',
      defects: 'Balconies or main gates placed in the South-East (ఆగ్నేయం) or South-West (నైరుతి) lead to disputes and unexpected expenditures.',
      remedies: 'Consecrate brass lead helixes and red coral energizers along the southern boundary to absorb excessive thermal radiation.',
      caseStudy: 'For South road plots, designing an L-shaped compound that channels airflow towards the North-East creates a tranquil microclimate.',
      imagePromptTheme: 'Modern South facing luxury duplex house architectural rendering with grand double height elevation',
      customFaqs: [
        { question: 'Are South-facing houses considered inauspicious?', answer: 'No. South-facing homes built with Gruhakshata Pada doors and elevated South-West structures bring immense fame and rapid financial growth.' },
        { question: 'Where should the kitchen be in a South-facing house?', answer: 'The kitchen must be placed in the South-East (ఆగ్నేయం) quadrant with the cooking platform facing East.' }
      ]
    };
  }

  // 3. North-Facing Plots
  if (combined.includes('ఉత్తర') || combined.includes('north')) {
    return {
      category: 'Home Vastu',
      focusTitle: 'North-Facing (ఉత్తరం) Plots & Kubera Wealth Flow',
      discipline: 'Geomagnetic Influx & Fluid Wealth Channels',
      foundations: 'Governed by Kubera and Mercury (Budha), North-facing plots are the primary conduits of geomagnetic energy and liquid wealth.',
      elementalRules: 'Position the main entrance in Mukhya (3rd Pada) or Bhallata (4th Pada). Keep the entire northern front open, well-lit, and slope the flooring towards North-East.',
      dimensionalRules: 'Ensure the northern open space is at least 30% wider than the southern setback to maximize geomagnetic prana.',
      defects: 'Placing heavy septic tanks, staircases, or overhead water tanks in the North blocks the flow of prosperity.',
      remedies: 'Place a serene water fountain or consecrated marble birdbath in the North-North-East to amplify financial inflows.',
      caseStudy: 'In North-facing commercial complexes, placing the executive cabin in the South-West while keeping reception in the North ensures stable client growth.',
      imagePromptTheme: 'Stunning North facing luxury Indian house design with open landscaped front lawn and marble water fountain',
      customFaqs: [
        { question: 'What is the best Pada for a North-facing main door?', answer: 'Mukhya (3rd) and Bhallata (4th) Padas are the most auspicious, bringing continuous wealth and sharp intellect.' },
        { question: 'Can we build a staircase in the North?', answer: 'Never place an external staircase in the North-East or North front as it blocks cosmic energy.' }
      ]
    };
  }

  // 4. East-Facing Plots
  if (combined.includes('తూర్పు') || combined.includes('east')) {
    return {
      category: 'Home Vastu',
      focusTitle: 'East-Facing (తూర్పు) Architecture & Solar Vitality',
      discipline: 'Surya Pranic Reception & Cellular Health',
      foundations: 'East orientation is ruled by Indra and Surya, providing vitalizing solar infrared rays that destroy airborne pathogens and rejuvenate human cellular health.',
      elementalRules: 'The main door must strictly occupy Jayanta (3rd Pada) or Indra (4th Pada). Provide generous windows across the eastern facade.',
      dimensionalRules: 'The eastern compound setback should be open and wide with a gentle downward slope towards the North-East.',
      defects: 'Raising the eastern ground level higher than the West or blocking morning light causes lethargy and family disputes.',
      remedies: 'Install a sacred Tulsi Vrindavan in the East-Northeast and embed copper wire along boundary thresholds.',
      caseStudy: 'In East-facing residences, locating the living room and study area along the eastern corridor promotes academic excellence in children.',
      imagePromptTheme: 'Traditional East facing Indian courtyard home with morning sunlight streaming through verandah arches',
      customFaqs: [
        { question: 'Why is an East-facing house considered supreme in Vastu?', answer: 'East-facing homes receive the first morning rays of Surya, energizing the Brahmasthanam and ensuring robust physical health.' },
        { question: 'Where should the pooja room be in an East-facing home?', answer: 'The North-East (ఈశాన్యం) or East corridor is the ideal sacred location for the Pooja room.' }
      ]
    };
  }

  // 5. Septic Tank & Subterranean Water
  if (combined.includes('సెప్టిక్') || combined.includes('septic') || combined.includes('సంపు') || combined.includes('బోర్')) {
    return {
      category: 'Remedies',
      focusTitle: 'Septic Tanks, Water Sumps & Borewell Placement Engineering',
      discipline: 'Subterranean Fluid Dynamics & Bio-Magnetic Shielding',
      foundations: 'Subterranean excavations profoundly alter the magnetic field of the earth beneath the foundation slab.',
      elementalRules: 'Borewells and underground water sumps must STRICTLY reside in the North-East (ఈశాన్యం). Septic tanks must ONLY reside in the North-West (వాయువ్యం).',
      dimensionalRules: 'Maintain at least a 3-foot clearance between the septic tank boundary and the main compound wall.',
      defects: 'A septic tank in Eshanya or Niruthi is a severe defect resulting in chronic illness, paralysis, and severe financial losses.',
      remedies: 'If a septic tank cannot be physically shifted, isolate its magnetic field using a surrounding trench filled with activated charcoal and brass grounding rods.',
      caseStudy: 'Relocating a misplaced septic tank from the South-East to the North-West in a commercial dairy farm restored continuous operational profit within 90 days.',
      imagePromptTheme: 'Architectural cross-section diagram showing underground water sump in North East and septic tank in North West',
      customFaqs: [
        { question: 'Where should a septic tank be placed according to Vastu?', answer: 'The only permissible zone for a septic tank is the North-West (వాయువ్యం) corner, never in Eshanya or Niruthi.' },
        { question: 'Can an underground sump and septic tank be placed together?', answer: 'Never. Sump belongs to the sacred North-East (Water element), while septic tank belongs to the waste-clearing North-West (Air element).' }
      ]
    };
  }

  // 6. Staircases & Lifts
  if (combined.includes('మెట్లు') || combined.includes('staircase') || combined.includes('లిఫ్ట్') || combined.includes('lift')) {
    return {
      category: 'Interiors',
      focusTitle: 'Staircase & Elevator Core Placement Guidelines',
      discipline: 'Structural Massing & Kinetic Upward Motion',
      foundations: 'Staircases represent concentrated physical weight and vertical upward movement, requiring placement in naturally heavy quadrants.',
      elementalRules: 'Construct staircases in South, West, or South-West. Always ensure the steps ascend in a clockwise (ప్రదక్షిణ దిశ) direction from East to West or North to South.',
      dimensionalRules: 'The number of steps should always be an odd number (15, 17, 19, 21) ending in a positive remainder when divided by 3.',
      defects: 'Building a staircase or placing a heavy pillar in the central Brahmasthanam or North-East suppresses cosmic energy.',
      remedies: 'If a staircase is misplaced in the North, balance the energy by placing heavy potted jade plants and brass bells beneath the landing.',
      caseStudy: 'In modern duplex villas, placing a cantilevered floating wooden staircase in the North-West maintains airiness while satisfying structural weight laws.',
      imagePromptTheme: 'Modern architectural luxury spiral wooden staircase with warm lighting and glass railings',
      customFaqs: [
        { question: 'Which direction should stairs climb?', answer: 'Stairs should always turn in a clockwise direction, rising towards the South or West.' },
        { question: 'Can we construct a bathroom under the staircase?', answer: 'A bathroom under a staircase should only be used as a powder room, never as a master toilet.' }
      ]
    };
  }

  // 7. Kitchen & Fire Element
  if (combined.includes('కిచెన్') || combined.includes('kitchen') || combined.includes('వంటగది')) {
    return {
      category: 'Interiors',
      focusTitle: 'Kitchen Placement & Agni Tattva Harmony',
      discipline: 'Thermal Combustion & Pranic Nourishment',
      foundations: 'The kitchen is the crucible of Agni (Fire element), directly governing the metabolism, vitality, and digestive health of all occupants.',
      elementalRules: 'The primary placement for the kitchen is the South-East (ఆగ్నేయం). The secondary acceptable alternative is the North-West (వాయువ్యం).',
      dimensionalRules: 'The cooking platform must be positioned along the eastern wall so the cook faces East (తూర్పు) while preparing meals.',
      defects: 'Placing a cooking stove directly adjacent to or opposite the water sink creates an Agni-Jala conflict, causing domestic discord.',
      remedies: 'Place a small green marble tile or copper strip between the gas stove and the water sink to insulate the conflicting thermal frequencies.',
      caseStudy: 'Aligning the kitchen refrigerator to the South-West corner and the microwave to the South-East maintains optimal appliance longevity.',
      imagePromptTheme: 'Luxury modular Indian kitchen with warm teak wood cabinets and granite countertops facing East',
      customFaqs: [
        { question: 'Which direction should the cook face while cooking?', answer: 'The person cooking should always face East to receive the morning solar energy and positive prana.' },
        { question: 'Can the kitchen be placed in the North-East?', answer: 'Strictly no. A kitchen in the North-East causes severe health issues and financial strain.' }
      ]
    };
  }

  // 8. Bedrooms & Sleep
  if (combined.includes('బెడ్') || combined.includes('bedroom') || combined.includes('నిద్ర')) {
    return {
      category: 'Interiors',
      focusTitle: 'Master Bedroom & Restorative Sleep Coordinates',
      discipline: 'Bio-Magnetic Recharge & Gravitational Anchoring',
      foundations: 'The bedroom is where the human bio-magnetic field recharges during sleep, requiring alignment with the Earth’s north-south magnetic poles.',
      elementalRules: 'The Master Bedroom must always occupy the South-West (నైరుతి). Children bedrooms should occupy the West or North-West.',
      dimensionalRules: 'The bed should be positioned so the head points towards the South (దక్షిణం) or East (తూర్పు). Never sleep with your head pointing North.',
      defects: 'Sleeping with the head towards North creates magnetic repulsion with the Earth’s magnetic pole, causing insomnia and elevated blood pressure.',
      remedies: 'Use warm earthy tones (beige, terracotta) in the master bedroom and ensure no mirrors face the sleeping bed.',
      caseStudy: 'Shifting the bed headboard from North to South for a hypertensive client in Visakhapatnam normalized sleep quality within 14 days.',
      imagePromptTheme: 'Luxurious master bedroom interior with warm wooden flooring and soft ambient lighting in South West',
      customFaqs: [
        { question: 'Which direction is best for sleeping head placement?', answer: 'South is the supreme direction for sleep, followed by East. Never sleep with your head pointing North.' },
        { question: 'Where should mirrors be placed in a bedroom?', answer: 'Mirrors should be placed on North or East walls, ensuring they do not reflect the bed.' }
      ]
    };
  }

  // General Vedic Architecture Default
  return {
    category: 'Home Vastu',
    focusTitle: title,
    discipline: 'Vedic Sthapatya Veda Spatial Architecture',
    foundations: `Empirical spatial principles codified by Dr. Kunchala Hanumantha Rao for ${title} based on solar angles, geomagnetic lines, and structural load balance.`,
    elementalRules: 'Maintain the sacred polarity between the lightweight, open Eshanya (North-East) and the elevated, heavy Niruthi (South-West).',
    dimensionalRules: 'Follow proportional grid formulas (Manasara & Mayamata) ensuring structural length-to-width ratios remain between 1:1 and 1:1.5.',
    defects: 'Corner cuts in the North-East or extensions in the South-West distort the spatial pranic envelope.',
    remedies: 'Apply non-destructive boundary harmonizers, copper yantra strips, and elemental color frequencies.',
    caseStudy: 'Verifying AutoCAD structural layouts prior to laying foundation pillars prevents 99% of future Vastu defects.',
    imagePromptTheme: `Photorealistic luxury Indian villa architectural elevation with warm ambient lighting for ${title}`,
    customFaqs: [
      { question: `What is the core rule for ${title}?`, answer: 'Dr. Rao emphasizes maintaining elemental balance, proper Pada entrance alignments, and keeping the Brahmasthanam unobstructed.' },
      { question: 'How can I get my floor plan audited by Dr. Rao?', answer: 'Send your plot measurements and proposed layout directly to Dr. Rao at +91 92466 24248.' }
    ]
  };
}
