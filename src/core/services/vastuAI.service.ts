// Dedicated Comprehensive Vedic Vastu Knowledge & Inference Engine
// Authored according to authentic principles of Dr. Kunchala Hanumantha Rao

export interface VastuAIResponse {
  success: boolean;
  query: string;
  answer: string;
  directionBadge: string;
  keyPoints: string[];
  recommendedKeywords: string[];
  whatsappCta: {
    number: string;
    url: string;
    label: string;
  };
}

export interface VastuTopic {
  key: string;
  badge: string;
  matchRegex: RegExp;
  answer: string;
  tips: string[];
  recommendedKeywords: string[];
}

export const VASTU_TOPICS: VastuTopic[] = [
  // 1. Plants & Trees (Curry Leaf, Karivepaku, Tulsi, Neem, etc.)
  {
    key: 'plants_trees',
    badge: '🌿 Garden, Plants & Trees (వృక్ష & వృక్షశాస్త్ర వాస్తు)',
    matchRegex: /curry\s*leaf|curry\s*leaves|karivepaku|కరివేపాకు|చెట్టు|చెట్లు|మొక్క|మొక్కలు|plant|plants|tree|trees|garden|tulsi|తులసి|neem|వేప|banana|అరటి|peepal|రావి|banyan|మర్రి|coconut|కొబ్బరి|cactus|ముళ్ల|rose|money\s*plant|flower|flowers|lawn|flora/,
    answer: `### 🌿 Authentic Vastu Shastra for Plants, Trees & Garden (వృక్ష వాస్తు)\n\n` +
      `In Vedic Architecture, every plant and tree carries a specific elemental frequency (Agni, Vayu, Jala, Prithvi, Akasha) and electromagnetic weight:\n\n` +
      `• **Curry Leaf Plant (కరివేపాకు చెట్టు):** Should ideally be planted in the **South, West, or South-West** portion of the open backyard or garden. Keep it trimmed so its branches do not physically touch or lean on the main building wall.\n` +
      `• **Tulsi (Holy Basil / తులసి మొక్క):** Must strictly be placed in the **North-East (Eshanya)**, North, or East. Tulsi in Eshanya attracts divine cosmic energy (Sattva Prana), good health, and peace.\n` +
      `• **Heavy & Tall Trees (Coconut, Neem, Mango, Teak):** Plant heavy, tall trees strictly on the **South and West** boundaries. This blocks harsh solar infrared rays and provides essential grounding weight to the South-West (Niruthi).\n` +
      `• **North & East Openness:** The North and East zones must NEVER have dense, overshadowing trees. Keep this zone lightweight with soft lawns, Tulsi, or flowering medicinal herbs to allow morning sunlight and magnetic flow.\n` +
      `• **Strict Prohibitions:** Never plant **thorny plants, Cactus, or milky sap trees (బ్రహ్మజెముడు/నాగజెముడు)** inside the residential compound, as they generate domestic discord and emotional stress. (Rose plants are the only exception).`,
    tips: [
      'Plant Curry Leaf in the South/West backyard to preserve North-East lightness 🌿',
      'Maintain sacred Tulsi Kota in North-East (Eshanya) with daily watering 🪔',
      'Never allow tree shadows (Vruksha Chaya) to constantly fall on the Simhadwaram between 9 AM and 3 PM ☀️',
      'Large trees like Peepal (రావి) or Banyan (మర్రి) should not be inside residential compounds 🌳'
    ],
    recommendedKeywords: ['plants', 'trees', 'garden', 'environment']
  },

  // 2. Mirrors, Dressing Tables & Glass Placements
  {
    key: 'mirrors',
    badge: '🪞 Mirrors & Reflection Vastu (అద్దాల వాస్తు నియమాలు)',
    matchRegex: /mirror|mirrors|glass|dressing\s*table|reflection|reflect|అద్దం|అద్దాలు|దర్పణం|గ్లాస్/,
    answer: `### 🪞 Sacred Vastu Guidelines for Mirrors & Glass (అద్దాల అమరిక)\n\n` +
      `Mirrors are powerful cosmic energy multipliers (Water element) that double whatever energy they face:\n\n` +
      `• **Auspicious Placement:** Strictly mount mirrors on **North or East walls**. This reflects positive magnetic currents entering from the North (Kubera) and solar currents from the East (Indra).\n` +
      `• **Master Bedroom Rule (Critical):** Mirrors or dressing tables must **NEVER reflect your body while sleeping in bed**. According to Dr. Rao, a mirror reflecting a sleeping person leads to chronic health fatigue, disturbed sleep cycles, and marital stress. If fixed, cover it with a cloth during the night.\n` +
      `• **Opposite Main Entrance:** Never install a mirror directly facing the Simhadwaram (Main Entrance Door). It bounces outgoing prosperity and vital Prana immediately back outside.\n` +
      `• **Dining Room Abundance:** Placing a large mirror on the North or East wall reflecting the dining table doubles abundance, food security, and family wealth.\n` +
      `• **Avoid Strictly:** Never place mirrors on South or West walls, as this reflects negative polarities toward the living areas.`,
    tips: [
      'Mount dressing table mirrors on North or East walls in the bedroom 🪞',
      'Cover bedroom mirrors at night if they are in direct sight of the bed 🛌',
      'Keep mirror surfaces clean, spotless, and without cracks or distortion 💫',
      'Avoid circular or irregular shaped mirrors; prefer square or rectangular frames 📐'
    ],
    recommendedKeywords: ['mirror', 'bedroom', 'reflection', 'interior']
  },

  // 3. Staircase (మెట్లు)
  {
    key: 'staircase',
    badge: '🪜 Staircase Vastu (మెట్ల అమరిక - సోపాన శాస్త్రం)',
    matchRegex: /stair|stairs|staircase|steps|మెట్లు|మెట్ల|సోపానం|steps count|internal stairs|external stairs/,
    answer: `### 🪜 Scientific Staircase Vastu (సోపాన వాస్తు సూత్రాలు)\n\n` +
      `The staircase carries heavy vertical mass (Bhaaram) and governs structural stability:\n\n` +
      `• **Best Location:** Position the staircase in the **South, West, or South-West (Niruthi)** zones. This creates auspicious heaviness where it is most needed.\n` +
      `• **Ascent Direction (Clockwise):** When climbing up, you must always start facing **East or North** and turn **Clockwise (Pradakshina / దక్షిణావర్తం)** towards the South or West.\n` +
      `• **Strict Prohibitions:** Never construct a staircase in the **North-East (Eshanya)** or the exact center (**Brahmasthana**). A staircase in Eshanya severely damages health, progeny, and mental peace.\n` +
      `• **Under Staircase Space:** Never build a Pooja room, Kitchen, or Bedroom underneath a staircase. You may only use this space for clean, enclosed dry storage.`,
    tips: [
      'Always have an odd number of steps (e.g., 15, 17, 19, 21) ending in a positive foot step 🪜',
      'Keep South-West external staircase higher than the rest of the building 🏗️',
      'Ensure stairwells are well lit and painted in light, soothing tones 💡'
    ],
    recommendedKeywords: ['staircase', 'steps', 'construction', 'structure']
  },

  // 4. Septic Tank & Waste Drainage
  {
    key: 'septic_tank',
    badge: '🚽 Septic Tank & Drainage (సెప్టిక్ ట్యాంక్ & మురుగునీటి వాస్తు)',
    matchRegex: /septic|septic\s*tank|drainage|sewage|waste\s*water|సెప్టిక్|సెప్టిక్\s*ట్యాంక్|మురుగు|కాలువ/,
    answer: `### 🚽 Septic Tank & Underground Drainage Guidelines (సెప్టిక్ ట్యాంక్ వాస్తు)\n\n` +
      `A septic tank collects heavy decomposition waste and carries intense negative disposal vibrations:\n\n` +
      `• **Ideal Zone:** Position the septic tank strictly in the **North-West (Vayavya)** corner, specifically in the western portion of the North-West zone.\n` +
      `• **Strict Taboos (Disastrous Defects):**\n` +
      `  - NEVER build a septic tank in the **North-East (Eshanya)** — causes terminal illnesses and financial ruin.\n` +
      `  - NEVER build in the **South-West (Niruthi)** — leads to loss of head of household, instability, and legal battles.\n` +
      `  - NEVER place in the exact center (**Brahmasthana**).\n` +
      `• **Clearance:** Ensure the septic tank is at least 2 to 3 feet away from the main compound wall and main building foundation.`,
    tips: [
      'Align septic tank length along East-West and breadth along North-South 📐',
      'Never allow the septic tank to touch or share a wall with the building foundation 🧱',
      'Ensure water outlet flows smoothly towards the North-West or North direction 💧'
    ],
    recommendedKeywords: ['septic', 'toilet', 'drainage', 'groundwork']
  },

  // 5. Cash Locker, Wealth & Tijori (ధన స్థానం)
  {
    key: 'cash_locker',
    badge: '💰 Wealth, Cash Locker & Tijori (కుబేర ధన స్థానం)',
    matchRegex: /locker|cash|money|wealth|tijori|safe|gold|jewellery|ధనం|డబ్బు|లాకర్|తిజోరి|బంగారం|కుబేర|సంపద/,
    answer: `### 💰 Sacred Vastu for Cash Locker, Safe & Wealth (కుబేర స్థానం)\n\n` +
      `Lord Kubera rules the North direction, governing money flow, financial accumulation, and liquidity:\n\n` +
      `• **Ideal Safe Placement:** Keep your cash locker, safe, or Almira in the **South-West (Niruthi)** or South wall of the master bedroom, with the locker **opening towards the NORTH** (Kubera's direction).\n` +
      `• **Secondary Placement:** On the West wall, opening towards the EAST (Lord Indra's direction).\n` +
      `• **Mirror inside Safe:** Placing a clean small mirror inside the cash box reflecting currency notes visually doubles your wealth energy.\n` +
      `• **Prohibitions:** Never place a cash locker in the North-East (drains wealth through unforeseen expenses), South-East (leads to aggressive expenses), or opening towards the South.`,
    tips: [
      'Ensure the cash locker is placed on a sturdy, level wooden or tiled floor 🔒',
      'Keep South-West locker heavy and grounded for lasting family wealth 🪙',
      'Avoid placing the cash locker directly under overhead concrete beams 🚫'
    ],
    recommendedKeywords: ['locker', 'wealth', 'bedroom', 'prosperity']
  },

  // 6. Wall Clocks & Time Alignment
  {
    key: 'wall_clocks',
    badge: '⏰ Wall Clock Vastu (గడియారాల వాస్తు అమరిక)',
    matchRegex: /clock|clocks|wall\s*clock|watch|time|గడియారం|గడియారాలు|క్లాక్/,
    answer: `### ⏰ Wall Clock Placement According to Vastu (గడియారాల దిశ)\n\n` +
      `Clocks symbolize the continuous vibration and forward flow of life and prosperity:\n\n` +
      `• **Best Directions:** Mount wall clocks on **North or East walls** (or North-East). The North wall brings career progress, while the East wall attracts energetic vitality.\n` +
      `• **Strict Prohibitions:**\n` +
      `  - Never hang a clock on the **South wall** (Yama's direction) — causes stagnation and sluggish progress.\n` +
      `  - Never mount a clock directly **above any door frame** (main door or bedroom door).\n` +
      `• **Maintenance:** Never keep stopped, broken, or cracked clocks inside the house. Always set clocks to the exact accurate time or 1 minute ahead.`,
    tips: [
      'Choose round, oval, or square shaped clocks in white, metallic, or light wood frames 🕰️',
      'Remove dead batteries and repair non-working clocks immediately ⚡',
      'Avoid chime sounds that are harsh or unsettling; prefer gentle melodic chimes 🎵'
    ],
    recommendedKeywords: ['interior', 'clock', 'hall', 'decor']
  },

  // 7. Study Room & Kids Education
  {
    key: 'study_room',
    badge: '📚 Study Room & Children Education (విద్యా వాస్తు)',
    matchRegex: /study|study\s*room|student|students|education|kids|children|exam|చదువు|స్టడీ|పిల్లలు|పుస్తకాలు|విద్య/,
    answer: `### 📚 Study Room & Concentration Vastu (విద్యాభ్యాస వాస్తు)\n\n` +
      `The North-East and East zones resonate with Lord Mercury (Budha) and Goddess Saraswati, governing intellect, memory, and concentration:\n\n` +
      `• **Ideal Study Room:** **North-East (Eshanya), East, or North** are the supreme locations for a study room or library.\n` +
      `• **Study Table Orientation:** The student must **face EAST or NORTH** while studying. This maximizes memory retention and mental sharpness.\n` +
      `• **Table Placement:** Do not push the study desk flush against the wall; leave a 2-3 inch air gap for energy circulation.\n` +
      `• **Lighting & Colors:** Soft green, cream, light yellow, or white on the walls promotes calm focus and analytical thinking.`,
    tips: [
      'Keep a crystal Saraswati Yantra or globe on the North-East corner of the desk 🌐',
      'Ensure the student does not study directly under an exposed ceiling beam 🚫',
      'Keep the study bookshelf on the South or West wall of the study room 📖'
    ],
    recommendedKeywords: ['study', 'education', 'eshanya', 'books']
  },

  // 8. Dining Room & Food Energy
  {
    key: 'dining_room',
    badge: '🍽️ Dining Room & Table Vastu (భోజనశాల వాస్తు)',
    matchRegex: /dining|dining\s*table|food|eat|eating|lunch|dinner|భోజనం|డైనింగ్|తినే/,
    answer: `### 🍽️ Dining Room Placement & Table Vastu (ఆహార వాస్తు)\n\n` +
      `Proper dining orientation nurtures digestive fire (Jatharagni) and strengthens family bond:\n\n` +
      `• **Ideal Room Location:** The **West (Varuna - fulfillment zone)** or the **East** are the best locations for a dining hall.\n` +
      `• **Seating Direction:** While eating, family members should face **East (health and digestion)** or **North (wealth and focus)**. Facing South should be avoided.\n` +
      `• **Dining Table Shape:** Rectangular or square wooden dining tables are auspicious. Avoid circular or irregular asymmetrical tables.\n` +
      `• **Mirror on Wall:** A mirror on the North or East wall reflecting the dining table symbolizes endless food security and prosperity.`,
    tips: [
      'Never place the dining table directly under overhead ceiling beams 🪵',
      'Keep dining area warm, well-ventilated, and free from television distractions 🥗',
      'Do not place the dining table facing directly into an open toilet door 🚫'
    ],
    recommendedKeywords: ['dining', 'food', 'family', 'interior']
  },

  // 9. Road Focus / Veedi Potu (వీధిపోటు)
  {
    key: 'veedi_potu',
    badge: '⚡ Road Focus / Veedi Potu (వీధిపోటు శుభ & అశుభ ఫలితాలు)',
    matchRegex: /veedi\s*potu|vidi\s*potu|street\s*focus|road\s*hit|road\s*focus|వీధి\s*పోటు|రోడ్\s*పోటు|వీధిపోటు/,
    answer: `### ⚡ Scientific Vastu for Road Focus / Veedi Potu (వీధిపోటు విశ్లేషణ)\n\n` +
      `When a straight road aims directly at a plot, it shoots high-velocity kinetic energy into the property. Depending on the exact cardinal quadrant, it is either supremely auspicious or dangerous:\n\n` +
      `• **🌟 Highly Auspicious Veedi Potus (శుభ వీధిపోట్లు):**\n` +
      `  - **East-of-NorthEast (తూర్పు ఈశాన్యం):** Brings tremendous fame, political success, and wealth.\n` +
      `  - **North-of-NorthEast (ఉత్తర ఈశాన్యం):** Generates immense financial liquidity, prosperity, and peace.\n\n` +
      `• **⚠️ Inauspicious & Harmful Veedi Potus (అశుభ వీధిపోట్లు):**\n` +
      `  - **South-of-SouthEast (దక్షిణ ఆగ్నేయం):** Causes fire accidents, health disputes for women.\n` +
      `  - **South-of-SouthWest (దక్షిణ నైరుతి) & West-of-SouthWest (పశ్చిమ నైరుతి):** Destroys financial stability, head of family health, and invites litigations.\n` +
      `  - **North-of-NorthWest (ఉత్తర వాయువ్యం) & East-of-SouthEast (తూర్పు ఆగ్నేయం):** Mental restlessness, thefts, and expenditure.\n\n` +
      `• **Remedies by Dr. Rao:** Thick solid compound wall raised higher, Convex Vastu energy mirror, Brass pyramid strips, and directional tree buffers.`,
    tips: [
      'Send a video/photo of the road junction to Dr. Rao (+91 92466 24248) for accurate degree analysis 📐',
      'Never panic or undergo destructive demolition before consulting a scientific Vastu master 🤝',
      'Install high-density compound wall and dense evergreen plants on negative hit sides 🌳'
    ],
    recommendedKeywords: ['veedi potu', 'road focus', 'plot', 'remedies']
  },

  // 10. Car Parking & Garage
  {
    key: 'car_parking',
    badge: '🚗 Vehicle Parking & Garage (వాహన పార్కింగ్ వాస్తు)',
    matchRegex: /car|parking|garage|vehicle|bike|scooter|driveway|పార్కింగ్|గ్యారేజ్|వాహనం|కారు|బైక్/,
    answer: `### 🚗 Car Parking & Garage Vastu Alignment (వాహన నివాస స్థానం)\n\n` +
      `Vehicles represent dynamic movement (Vayu) and machinery (Agni):\n\n` +
      `• **Best Parking Zones:** The **North-West (Vayavya)** or **South-East (Agneya)** corners are ideal for parking four-wheelers and two-wheelers.\n` +
      `• **Parking Orientation:** Park your vehicle facing **North or East** so you always start journeys facing positive magnetic polarities.\n` +
      `• **Strict Prohibitions:** Never park vehicles in the **North-East (Eshanya)**. Parking heavy cars in Eshanya blocks incoming cosmic vitality and creates financial stagnation.\n` +
      `• **South-West Note:** Do not build an open or temporary light garage in the South-West, as South-West should remain solid and enclosed.`,
    tips: [
      'Ensure the parking floor slope drains towards the North or East 💧',
      'Keep parking area tidy, clean, and free of oil spills or unused scrap 🧰',
      'Leave at least 2 feet clearance from the main house entrance door 🚪'
    ],
    recommendedKeywords: ['parking', 'vehicle', 'exterior', 'layout']
  },

  // 11. Colors as per Vastu (రంగుల వాస్తు)
  {
    key: 'colors_vastu',
    badge: '🎨 Directional Color Schemes (రంగుల వాస్తు శాస్త్రం)',
    matchRegex: /color|colors|colour|colours|paint|painting|wall\s*color|wall\s*paint|రంగు|రంగులు|పెయింట్/,
    answer: `### 🎨 Scientific Vastu Color Codes for Your Home (దిశలను బట్టి రంగులు)\n\n` +
      `Color frequencies directly stimulate the psychological and bio-energetic balance of residents:\n\n` +
      `• **North (Kubera - Water/Wealth):** Light green, mint, pista, white, or soft cream.\n` +
      `• **East (Sun/Indra - Ether/Life):** Pure white, light blue, lavender, or soft yellow.\n` +
      `• **South-East (Agneya - Fire):** Orange, peach, soft pink, coral, or warm beige.\n` +
      `• **South & South-West (Niruthi - Earth/Stability):** Warm terracotta, earthy brown, biscuit, or almond beige.\n` +
      `• **West (Varuna - Air/Metal):** Pure white, pearl gray, silver, or light metallic blue.\n` +
      `• **North-West (Vayu - Air/Movement):** Milk white, cream, or light silver.\n` +
      `• **Ceilings (Universal Rule):** Always paint all ceilings pure **White (or off-white)** to reflect light and expand spatial headroom. Avoid dark black, crimson red, or dark navy on walls.`,
    tips: [
      'Avoid dark blue or black paint in the kitchen (Agneya zone) 🚫',
      'Use matte earthy shades in master bedroom for restful sleep 🛏️',
      'Light soothing colors in the living room maximize light reflection 💡'
    ],
    recommendedKeywords: ['colors', 'interior', 'painting', 'decor']
  },

  // 12. Plot Shapes, Extensions & Elevations
  {
    key: 'plot_shapes',
    badge: '📐 Plot Shapes, Slopes & Extensions (స్థల ఆకారాల వాస్తు)',
    matchRegex: /plot|land|site|shape|slope|extension|cut|gaumukhi|shermukhi|స్థలం|ప్లాట్|భూమి|ఆకారం|వాలు|ఈశాన్యం\s*పెరగడం/,
    answer: `### 📐 Plot Shapes, Geometric Ratios & Slopes (భూమి పరీక్ష & స్థల వాస్తు)\n\n` +
      `The physical geometry of the land dictates how cosmic energy settles into your property:\n\n` +
      `• **Ideal Shapes:** **Square (చతురస్రం)** and **Rectangle (దీర్ఘచతురస్రం)** with length-to-width ratio not exceeding 1:2.\n` +
      `• **Auspicious Extensions (శుభ పెరుగుదల):** An extension strictly in the **North-East (ఈశాన్యం పెరగడం)** is the most auspicious feature in Vastu, bringing exponential wealth, health, and progeny.\n` +
      `• **Harmful Cuts & Extensions:** Cuts in North-East or extensions in South-West (నైరుతి పెరగడం), South-East (ఆగ్నేయం పెరగడం), or North-West (వాయువ్యం పెరగడం) are considered harmful defects requiring boundary correction.\n` +
      `• **Slope & Water Level (వాలు):** The ground level should always slope gently from **South/West down towards North/East**.`,
    tips: [
      'Residential plots are best as Gaumukhi (narrow in front, wider in back) 🐮',
      'Commercial/Showroom plots are best as Shermukhi (wider in front) 🦁',
      'Always correct irregular triangular or hexagonal plots by building rectangular compound walls 🧱'
    ],
    recommendedKeywords: ['plot', 'land', 'drawing', 'site']
  },

  // 13. Pooja Room (North-East Eshanya)
  {
    key: 'pooja',
    badge: '🧭 North-East (Eshanya / ఈశాన్యం) - Water & Ether',
    matchRegex: /pooja|mandir|temple|god|prayer|deity|idol|eshanya|ఈశాన్యం|పూజ|దేవుడి|మందరం|స్వామి/,
    answer: `### 🕉️ Sacred Pooja Room Vastu Guidelines (పూజా మందిరం)\n\n` +
      `The **North-East corner (Eshanya)** is ruled by Lord Shiva and represents the supreme gateway of cosmic energy (Ishanya Prana):\n\n` +
      `• **Ideal Facing:** Face **East or North** while performing worship and chanting.\n` +
      `• **Lightness & Purity:** Keep the North-East zone extremely clean, lightweight, and clutter-free.\n` +
      `• **Strict Prohibitions:** Never locate the Pooja room under a staircase, adjacent to a toilet wall, or directly above/below a bathroom.\n` +
      `• **Mandir Elevation:** Keep the Mandir on a clean wooden or marble pedestal slightly elevated from the floor.\n` +
      `• **Colors:** Use soft white, light yellow, or soothing cream tones.`,
    tips: [
      'Idols should not be pasted directly touching the wall; maintain a 1-inch gap 🪔',
      'Place holy water / copper Kalash in the North-East corner of the Mandir 💧',
      'Light the Akhanda Deepam in the South-East corner of the Pooja room 🔥'
    ],
    recommendedKeywords: ['pooja', 'eshanya', 'mandir', 'prayer']
  },

  // 14. Kitchen & Cooking Stove (South-East Agneya)
  {
    key: 'kitchen',
    badge: '🔥 South-East (Agneya / ఆగ్నేయం) - Fire Element',
    matchRegex: /kitchen|cook|cooking|stove|gas|burner|cylinder|sink|agneya|ఆగ్నేయం|వంట|పొయ్యి|కిచెన్/,
    answer: `### 🍳 Kitchen Vastu Guidelines & Stove Orientation (వంటగది వాస్తు)\n\n` +
      `The kitchen must always be aligned with the **Fire Element (Agni)** in the **South-East (Agneya)** corner:\n\n` +
      `• **Cooking Orientation:** The cook must face **East** while cooking to ensure physical health, longevity, and peaceful domestic life.\n` +
      `• **Water & Fire Separation:** The kitchen sink (Water element) and cooking gas stove (Fire element) must NEVER be placed side-by-side or directly touching. Maintain at least a 2-foot separation.\n` +
      `• **Secondary Alternative:** If South-East is occupied, the **North-West (Vayavya)** is the best secondary kitchen location.\n` +
      `• **Avoid Strictly:** Never build a kitchen in the North-East (Eshanya) or South-West (Niruthi).`,
    tips: [
      'Store drinking water and water purifiers in the North-East corner of the kitchen 💧',
      'Place refrigerators in the North-West or South-West corner 🧊',
      'Avoid dark black or dark blue granite countertops in the Agneya zone; use earthy or orange/maroon shades 🟤'
    ],
    recommendedKeywords: ['kitchen', 'agneya', 'cook', 'stove']
  },

  // 15. Master Bedroom & Sleeping Orientation (South-West Niruthi)
  {
    key: 'bedroom',
    badge: '🛏️ South-West (Niruthi / నైరుతి) - Earth Element',
    matchRegex: /bedroom|bed|sleep|sleeping|master\s*bedroom|cot|niruthi|నైరుతి|పడుకునే|పడకగది|బెడ్\s*రూమ్/,
    answer: `### 🛌 Master Bedroom & Sleeping Direction Vastu (పడకగది వాస్తు)\n\n` +
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
    recommendedKeywords: ['bedroom', 'sleep', 'niruthi', 'master']
  },

  // 16. Toilets & Bathrooms (North-West Vayavya)
  {
    key: 'toilet',
    badge: '🌬️ North-West (Vayavya) - Elimination Zone',
    matchRegex: /toilet|bathroom|bath|commode|latrine|wc|lavatory|vayavya|వాయువ్యం|లెట్రిన్|బాత్రూమ్|టాయిలెట్/,
    answer: `### 🚽 Toilet & Bathroom Vastu Alignment (శౌచాలయ వాస్తు)\n\n` +
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
    recommendedKeywords: ['toilet', 'bathroom', 'vayavya', 'hygiene']
  },

  // 17. Main Entrance (Simhadwaram)
  {
    key: 'entrance',
    badge: '🚪 Main Entrance (Simhadwaram) - Auspicious Padas',
    matchRegex: /entrance|simhadwaram|main\s*door|gate|threshold|gadapa|సింహద్వారం|మెయిన్\s*డోర్|ద్వారం|వాకిలి|గడప/,
    answer: `### 🌟 Main Entrance (Simhadwaram) Vastu Principles (సింహద్వార వాస్తు)\n\n` +
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
    recommendedKeywords: ['entrance', 'simhadwaram', 'door', 'gate']
  },

  // 18. Water Sump & Borewell (North-East Eshanya)
  {
    key: 'water',
    badge: '🌊 Borewell & Water Sump - Eshanya / North-East',
    matchRegex: /bore|borewell|water|sump|well|water\s*tank|overhead\s*tank|బోరు|సంప్|నీరు|నీళ్ళ|ఓవర్\s*హెడ్/,
    answer: `### 💧 Underground Water Sump & Borewell Vastu (జల స్థాన వాస్తు)\n\n` +
      `Water placement determines financial liquidity and health according to Vedic architecture:\n\n` +
      `• **Underground Water:** Borewells, underground sumps, and open wells MUST strictly be located in the **North-East (Eshanya)**.\n` +
      `• **Overhead Water Tanks:** Overhead water storage tanks must be situated in the **South-West (Niruthi)** or **West** on top of the terrace to create the required weight.\n` +
      `• **Heavy Prohibition:** Never dig an underground sump in the South-West, South, or South-East zones.`,
    tips: [
      'Borewell in Eshanya brings wealth, career growth, and domestic happiness 🌊',
      'Overhead tank in Niruthi stabilizes family prosperity and leadership 🏗️',
      'Keep water drainage flowing from South/West towards North/East 💧'
    ],
    recommendedKeywords: ['borewell', 'water', 'sump', 'tank']
  },

  // 19. Contact Dr. Rao
  {
    key: 'contact',
    badge: '📍 Official Contact & Office Location',
    matchRegex: /contact|phone|number|address|office|location|email|vizag|visakhapatnam|call|reach|whatsapp|appointment|కలవాలి|ఫోన్|నెంబర్|చిరునామా|ఎక్కడ|అపాయింట్మెంట్/,
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
    recommendedKeywords: ['consultation', 'contact', 'appointment', 'office']
  },

  // 20. House Plans & Drawings
  {
    key: 'drawings',
    badge: '📐 Architectural Plans & Drawings',
    matchRegex: /plan|drawing|drawings|blueprint|map|cad|plot|house\s*plan|ప్లాన్|డ్రాయింగ్|నక్ష|ఇంటి\s*ప్లాన్|కొలతలు/,
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
    recommendedKeywords: ['drawing', 'plan', 'house', 'blueprint']
  },

  // 21. About Dr. Rao
  {
    key: 'about',
    badge: '🎖️ About Dr. Kunchala Hanumantha Rao',
    matchRegex: /about|who\s*is|credentials|award|sadbhavana|nepal|గురించి|ఎవరు|డాక్టర్\s*రావు/,
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
    recommendedKeywords: ['about', 'books', 'videos', 'founder']
  }
];

export class VastuAIEngine {
  /**
   * Intelligently analyzes any query in English or Telugu and generates
   * authoritative Vedic Vastu advice according to Dr. Kunchala Hanumantha Rao's teachings.
   */
  static processQuery(queryText: string): VastuAIResponse {
    const raw = queryText.trim();
    const lower = raw.toLowerCase();

    // 1. Direct regex match across all 21 Vastu Knowledge Modules
    for (const topic of VASTU_TOPICS) {
      if (topic.matchRegex.test(lower)) {
        return {
          success: true,
          query: raw,
          answer: topic.answer,
          directionBadge: topic.badge,
          keyPoints: topic.tips,
          recommendedKeywords: topic.recommendedKeywords,
          whatsappCta: {
            number: '+91 92466 24248',
            url: `https://wa.me/919246624248?text=${encodeURIComponent(`Hello Dr. Rao, I inquired on HR Vasthu regarding "${raw}". Please guide me.`)}`,
            label: 'Consult Dr. Rao on WhatsApp'
          }
        };
      }
    }

    // 2. Dynamic Semantic Synthesizer for mixed or novel queries
    const detectedDirections: string[] = [];
    if (/north-east|northeast|eshanya|ఈశాన్య/.test(lower)) detectedDirections.push('North-East (ఈశాన్యం - Water/Ether)');
    if (/south-east|southeast|agneya|ఆగ్నేయ/.test(lower)) detectedDirections.push('South-East (ఆగ్నేయం - Fire)');
    if (/south-west|southwest|niruthi|నైరుతి/.test(lower)) detectedDirections.push('South-West (నైరుతి - Earth)');
    if (/north-west|northwest|vayavya|వాయువ్య/.test(lower)) detectedDirections.push('North-West (వాయువ్యం - Air)');
    if (/north|ఉత్తర/.test(lower)) detectedDirections.push('North (ఉత్తరం - Wealth/Kubera)');
    if (/east|తూర్పు/.test(lower)) detectedDirections.push('East (తూర్పు - Solar/Health)');
    if (/south|దక్షిణ/.test(lower)) detectedDirections.push('South (దక్షిణం - Yama/Stability)');
    if (/west|పశ్చిమ/.test(lower)) detectedDirections.push('West (పశ్చిమం - Varuna/Prosperity)');

    const badge = detectedDirections.length > 0
      ? `🧭 ${detectedDirections[0]}`
      : '🧭 Authentic Vedic Architecture Analysis';

    const dynamicAnswer = `### 🧭 Vedic Vastu Guidance for: "${raw}"\n\n` +
      `According to the scientific Vastu Shastra principles taught by **Dr. Kunchala Hanumantha Rao**, every domestic element must honor the sacred balance of the Five Natural Elements (Pancha Bhootas):\n\n` +
      `• **Elemental Balance (పంచభూత సమన్వయం):** Ensure heavy objects settle in the South/South-West (Earth) and lightweight sacred elements reside in the North-East (Water & Ether).\n` +
      `• **Directional Flow:** Maintain unobstructed magnetic flow from North to South and radiant solar flow from East to West.\n` +
      `• **Custom Verification:** For complex questions regarding "${raw}", Dr. Rao recommends verifying your exact room measurements and cardinal degree coordinates.\n\n` +
      `*You can send your house plan or plot photo directly to Dr. Rao on WhatsApp for a personalized assessment.*`;

    return {
      success: true,
      query: raw,
      answer: dynamicAnswer,
      directionBadge: badge,
      keyPoints: [
        'Maintain harmony between Fire, Water, Earth, Air, and Space elements ⚖️',
        'Keep North-East zone clean, open, and lightweight at all times 🌊',
        'Contact Dr. Rao directly at +91 92466 24248 for personalized floor plan review 📞'
      ],
      recommendedKeywords: ['vastu', 'house', 'consultation'],
      whatsappCta: {
        number: '+91 92466 24248',
        url: `https://wa.me/919246624248?text=${encodeURIComponent(`Hello Dr. Rao, I inquired on HR Vasthu AI regarding "${raw}". Please guide me.`)}`,
        label: 'Consult Dr. Rao on WhatsApp'
      }
    };
  }
}
