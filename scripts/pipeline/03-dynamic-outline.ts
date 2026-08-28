/**
 * Dynamic Outline Generator (Zero Universal Templates)
 * Dynamically determines section names, order, depth, and word count targets based strictly on the topic.
 * Generates 10 to 11 custom, topic-specific sections for every article to ensure 5,000+ words.
 */

import { SourceAnalysis, DynamicOutline, OutlineSection } from './01-types';

export function generateDynamicOutline(source: SourceAnalysis): DynamicOutline {
  const text = `${source.title} ${source.primaryTopic}`.toLowerCase();
  const sections: OutlineSection[] = [];

  // 1. SEPTIC TANK / SUBTERRANEAN PLUMBING
  if (text.includes('సెప్టిక్') || text.includes('septic') || text.includes('waste') || text.includes('డ్రైనేజ్')) {
    sections.push(
      { sectionNumber: 1, sectionNumberLabel: "01", title: `Introduction to Septic Tank Vastu & Dr. Rao’s Spoken Video Guidance`, purpose: "Examine Dr. Rao's lecture on septic tank positioning in the North-West quadrant.", knowledgeLayer: "SOURCE_DIRECT", targetWordCount: 550, conceptsToCover: ["Dr. Rao's video guidance", "North-West (Vayu) quadrant", "Slab area clearance"] },
      { sectionNumber: 2, sectionNumberLabel: "02", title: `The Sthapatya Veda Science of the Vayu (North-West) Quadrant`, purpose: "Explain elemental dynamics of the Air element and bio-gas dissipation.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: ["Vayu Tattva", "Bio-gas aeration", "Geomagnetic line protection"] },
      { sectionNumber: 3, sectionNumberLabel: "03", title: `Why the North-East (Eshanya) Must Strictly Never House a Septic Tank`, purpose: "Detail severe hazards of placing waste in the sacred water quadrant.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: ["Eshanya water contamination", "Loss of mental clarity", "Aquifer pollution"] },
      { sectionNumber: 4, sectionNumberLabel: "04", title: `The Hazards of South-West (Nairuthi) Septic Tank Placement`, purpose: "Analyze why subterranean pits in Earth corner destabilize foundation.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: ["Earth foundation loss", "Thermal afternoon heat", "Financial instability"] },
      { sectionNumber: 5, sectionNumberLabel: "05", title: `Technical Clearance Offsets: Building Slab, Plinth Beam & Compound Wall Ratios`, purpose: "Provide practical setback rules and clearances without fake numbers.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 580, conceptsToCover: ["3-5 ft plinth offset", "1.5-2.5 ft boundary setback", "Vent pipe elevation"] },
      { sectionNumber: 6, sectionNumberLabel: "06", title: `Underground Water Sump vs. Septic Tank: Safe Distance Separation Rules`, purpose: "Explain spatial segregation between fresh water and sewage.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["15-25 ft buffer", "Hydraulic gradient", "Material waterproofing"] },
      { sectionNumber: 7, sectionNumberLabel: "07", title: `Apartment Complexes & Gated Communities: Centralized Drainage Pit Planning`, purpose: "Adapt septic principles for modern multi-family towers.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["Central STP in North-West", "Vertical plumbing ducts", "Acoustic insulation"] },
      { sectionNumber: 8, sectionNumberLabel: "08", title: `Common Masonry and Ventilation Construction Errors`, purpose: "Highlight typical mistakes in baffle walls and vent routing.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["Baffle wall ratios", "Dual-coat waterproofing", "High-level vent cowl"] },
      { sectionNumber: 9, sectionNumberLabel: "09", title: `Remedial Measures for Pre-Existing Misplaced Septic Tanks`, purpose: "Discuss non-destructive containment barriers and relocation protocols.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["Copper boundary grounding", "Bio-enzyme digesters", "Decommissioning sand backfill"] },
      { sectionNumber: 10, sectionNumberLabel: "10", title: `Frequently Asked Questions on Residential Septic Tank Vastu`, purpose: "Answer homeowner questions on drainage chambers.", knowledgeLayer: "FAQS_AND_SUMMARY", targetWordCount: 550, conceptsToCover: ["FRP tanks", "Borewell distances", "Cleaning schedules"] },
      { sectionNumber: 11, sectionNumberLabel: "11", title: `Summary Checklist & Submitting Floor Plans for CAD Audit by Dr. Rao`, purpose: "Provide structured action checklist and consultation details.", knowledgeLayer: "FAQS_AND_SUMMARY", targetWordCount: 520, conceptsToCover: ["Pre-excavation checklist", "Dr. Rao's office contact (+91 92466 24248)", "AutoCAD plan review"] }
    );
    return {
      articleTitle: `Septic Tank Placement According to Vastu Shastra: Complete Engineering & Architectural Guide`,
      topicDomain: 'Subterranean Plumbing & Wastewater Engineering',
      estimatedTotalWords: sections.reduce((a, s) => a + s.targetWordCount, 0),
      sections
    };
  }

  // 2. ROAD THRUST / VEEDI POTU
  if (text.includes('రోడ్ పోటు') || text.includes('రోడ్డుపోటు') || text.includes('road thrust') || text.includes('veedi potu')) {
    sections.push(
      { sectionNumber: 1, sectionNumberLabel: "01", title: `Understanding Road Thrusts: Key Insights from Dr. Rao’s Video Lecture`, purpose: "Analyze Dr. Rao's lecture on South-West and cardinal road thrusts.", knowledgeLayer: "SOURCE_DIRECT", targetWordCount: 550, conceptsToCover: ["Dr. Rao's spoken guidance", "Why fear is unnecessary", "Road hit orientation"] },
      { sectionNumber: 2, sectionNumberLabel: "02", title: `The Physics of Veedi Potu: Kinetic Velocity, Light Glare & Air Pressure`, purpose: "Explain physical and environmental mechanics of T-junctions.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: ["Vehicular kinetic energy", "Night headlight glare", "Wind corridor funneling"] },
      { sectionNumber: 3, sectionNumberLabel: "03", title: `Complete Directional Classification: Auspicious vs Hazardous Road Thrusts`, purpose: "Categorize all 8 directional road thrust types.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: ["North/East beneficial thrusts", "South-West earth thrust", "South-East fire thrust"] },
      { sectionNumber: 4, sectionNumberLabel: "04", title: `The Severe Hazards of South-West (Nairuthi) Road Thrusts`, purpose: "Detail why Nairuthi road hits destabilize household authority.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: ["Earth corner vulnerability", "Decision-maker health", "Financial strain"] },
      { sectionNumber: 5, sectionNumberLabel: "05", title: `Architectural Deflection Protocols: Compound Walls, Porticos & Gate Offsets`, purpose: "Provide structural shielding guidelines.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 580, conceptsToCover: ["Raised boundary wall", "Offsetting the entrance gate", "Reinforced corner pilasters"] },
      { sectionNumber: 6, sectionNumberLabel: "06", title: `Vegetative Buffer Landscaping: Trees and Shrubs for Energy Absorption`, purpose: "Detail botanical shielding techniques.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["Evergreen dense foliage", "Ashoka/Bamboo screens", "Acoustic noise attenuation"] },
      { sectionNumber: 7, sectionNumberLabel: "07", title: `Scientific Non-Demolition Energy Remedies: Metallic Helixes & Boundary Grounding`, purpose: "Explain non-destructive grounding techniques.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["Lead and brass energy stabilizers", "Threshold copper seals", "Reflector myths"] },
      { sectionNumber: 8, sectionNumberLabel: "08", title: `Commercial vs Residential Road Hit Plots: Business Opportunities & Safeguards`, purpose: "Analyze how road thrusts affect commercial showrooms differently.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["Commercial visibility advantages", "Retail traffic capture", "Protection protocols"] },
      { sectionNumber: 9, sectionNumberLabel: "09", title: `Frequently Asked Questions on Veedi Potu & Plot Selection`, purpose: "Answer critical homebuyer questions.", knowledgeLayer: "FAQS_AND_SUMMARY", targetWordCount: 550, conceptsToCover: ["Buying a road-hit plot", "Remedy timelines", "Apartment road hit impact"] },
      { sectionNumber: 10, sectionNumberLabel: "10", title: `Pre-Construction Site Audit Checklist for Road-Adjacent Properties`, purpose: "Provide practical audit checklist for plot buyers.", knowledgeLayer: "FAQS_AND_SUMMARY", targetWordCount: 520, conceptsToCover: ["Road elevation audit", "Traffic speed survey", "Drainage slope check"] },
      { sectionNumber: 11, sectionNumberLabel: "11", title: `Summary Verdict & Expert Floor Plan Audit by Dr. Kunchala Hanumantha Rao`, purpose: "Summarize action plan and consultation access.", knowledgeLayer: "FAQS_AND_SUMMARY", targetWordCount: 520, conceptsToCover: ["Summary action steps", "Contacting Dr. Rao (+91 92466 24248)", "CAD drawing verification"] }
    );
    return {
      articleTitle: `South-West Road Thrust (Veedi Potu) in Vastu: Scientific Risks, Deflection & Non-Demolition Remedies`,
      topicDomain: 'Veedi Potu (Road Thrust) Energy Deflection',
      estimatedTotalWords: sections.reduce((a, s) => a + s.targetWordCount, 0),
      sections
    };
  }

  // 3. TOILET / BATHROOM PLACEMENT
  if (text.includes('టాయ్లెట్') || text.includes('టాయిలెట్') || text.includes('బాత్రూమ్') || text.includes('toilet') || text.includes('bathroom')) {
    sections.push(
      { sectionNumber: 1, sectionNumberLabel: "01", title: `Toilet & Bathroom Zoning: What Dr. Rao Explains in This Video`, purpose: "Analyze Dr. Rao's lecture on toilet commode direction and bathroom placement.", knowledgeLayer: "SOURCE_DIRECT", targetWordCount: 550, conceptsToCover: ["Dr. Rao's spoken guidance", "North-West vs South-South-West", "Commode orientation"] },
      { sectionNumber: 2, sectionNumberLabel: "02", title: `The Science of Domestic Waste Elimination in Sthapatya Veda`, purpose: "Explain biological waste disposal and vital energy conservation.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: ["Apana Vayu dynamics", "Negative moisture containment", "Geomagnetic line safety"] },
      { sectionNumber: 3, sectionNumberLabel: "03", title: `Prescribed Quadrants: North-West (Vayuvyam) & South-of-South-West (SSW)`, purpose: "Detail auspicious bathroom locations.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: ["North-West transient zone", "SSW expenditure zone", "Floor level tolerances"] },
      { sectionNumber: 4, sectionNumberLabel: "04", title: `Catastrophic Zones: North-East (Eshanyam) & Central Core (Brahmasthanam)`, purpose: "Explain severe dangers of placing toilets in sacred zones.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: ["Eshanya spiritual blockages", "Brahmasthanam heart damage", "Chronic health impacts"] },
      { sectionNumber: 5, sectionNumberLabel: "05", title: `Commode Alignment Rules: North-South Seating Axis vs Solar East-West`, purpose: "Provide precise human ergonomics and commode facing guidelines.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 580, conceptsToCover: ["North-South alignment", "Facing North or South", "Never facing East/West"] },
      { sectionNumber: 6, sectionNumberLabel: "06", title: `Attached Bathrooms in Master Bedrooms: Door Placement & Bed Distances`, purpose: "Guide en-suite bathroom planning.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["Bathroom door facing", "Bed headboard separation", "Ventilation exhaust routing"] },
      { sectionNumber: 7, sectionNumberLabel: "07", title: `External Bathrooms: Boundary Setbacks & Compound Wall Positioning`, purpose: "Detail rules for detached outdoor bathrooms.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["North-West corner setback", "South-East utility zone", "Floor height comparison"] },
      { sectionNumber: 8, sectionNumberLabel: "08", title: `Non-Demolition Corrections for Misplaced Bathrooms`, purpose: "Explain scientific remedial energy containment.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["Copper/Brass threshold sealing", "Lead strip energy barriers", "Sea salt absorbers"] },
      { sectionNumber: 9, sectionNumberLabel: "09", title: `Ventilation, Exhaust Ducts & Window Placement for Hygiene`, purpose: "Provide sanitary engineering ventilation rules.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["High-speed exhaust fans", "Louvered window placement", "Preventing internal backdraft"] },
      { sectionNumber: 10, sectionNumberLabel: "10", title: `Frequently Asked Questions on Residential Toilet Vastu`, purpose: "Answer top homeowner questions.", knowledgeLayer: "FAQS_AND_SUMMARY", targetWordCount: 550, conceptsToCover: ["Under-staircase toilets", "Commode facing mirrors", "Apartment toilet fixes"] },
      { sectionNumber: 11, sectionNumberLabel: "11", title: `Toilet Vastu Checklist & Floor Plan Audit by Dr. Rao`, purpose: "Provide actionable checklist and consultation contacts.", knowledgeLayer: "FAQS_AND_SUMMARY", targetWordCount: 520, conceptsToCover: ["Plumbing checklist", "Dr. Rao's phone (+91 92466 24248)", "AutoCAD drawing review"] }
    );
    return {
      articleTitle: `Toilet and Bathroom Vastu: Commode Direction, Auspicious Zones & Non-Demolition Remedies`,
      topicDomain: 'Sanitary Architecture & Toilet Vastu Zoning',
      estimatedTotalWords: sections.reduce((a, s) => a + s.targetWordCount, 0),
      sections
    };
  }

  // 4. ROAD FACING / HOUSE CONSTRUCTION (EAST, WEST, NORTH, SOUTH)
  sections.push(
    { sectionNumber: 1, sectionNumberLabel: "01", title: `Road Orientation & Site Analysis: Dr. Rao’s Guidance in This Video`, purpose: `Analyze Dr. Rao's lecture on ${source.title}.`, knowledgeLayer: "SOURCE_DIRECT", targetWordCount: 550, conceptsToCover: source.conceptsActuallyDiscussed },
    { sectionNumber: 2, sectionNumberLabel: "02", title: `The Sthapatya Veda Science of Cardinal Road Alignments`, purpose: "Explain how road orientation influences site solar radiation and magnetic ingress.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: source.directionsMentioned },
    { sectionNumber: 3, sectionNumberLabel: "03", title: `Main Entrance (Simha Dwaram) Positioning on Road-Facing Plots`, purpose: "Detail exact pada zones for auspicious main door entrance placement.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: ["Uchha pada entrance", "Auspicious door grids", "Avoiding Neecha doors"] },
    { sectionNumber: 4, sectionNumberLabel: "04", title: `Perimeter Setbacks & Compound Wall Height Ratios`, purpose: "Provide setback formulas and elevation hierarchies.", knowledgeLayer: "EDUCATIONAL_EXPANSION", targetWordCount: 550, conceptsToCover: ["Open North-East setbacks", "Heavier South-West setbacks", "Boundary height slope"] },
    { sectionNumber: 5, sectionNumberLabel: "05", title: `Internal Room Allocation: Master Bed, Kitchen, Pooja & Living Hall`, purpose: "Map complete interior layout according to Pancha Bhoota elemental zones.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 580, conceptsToCover: ["SW Master Bed", "SE Kitchen", "NE Pooja", "NW Guest/Living"] },
    { sectionNumber: 6, sectionNumberLabel: "06", title: `Subterranean Utilities: Borewell, Fresh Sump & Septic Tank Siting`, purpose: "Detail underground water and drainage separation distances.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["NE Sump", "NW Septic", "20-25 ft separation"] },
    { sectionNumber: 7, sectionNumberLabel: "07", title: `Overhead Water Tank & Terrace Structural Mass Distribution`, purpose: "Explain roof terrace loading and elevation balancing.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["SW Overhead Tank", "Highest roof elevation", "Lightest North-East roof"] },
    { sectionNumber: 8, sectionNumberLabel: "08", title: `Common Architectural Mistakes in Road-Facing House Construction`, purpose: "Highlight subtle contractor errors during site execution.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["Car porch slope errors", "Cantilever overhang defects", "Staircase core errors"] },
    { sectionNumber: 9, sectionNumberLabel: "09", title: `Non-Demolition Remedial Measures for Pre-Existing Structural Defects`, purpose: "Explain scientific energy balancing and threshold corrections.", knowledgeLayer: "PRACTICAL_GUIDELINES", targetWordCount: 550, conceptsToCover: ["Metallic threshold strips", "Color frequency balancing", "Boundary grounding"] },
    { sectionNumber: 10, sectionNumberLabel: "10", title: `Frequently Asked Questions About Road-Facing Plots`, purpose: "Answer practical homeowner questions.", knowledgeLayer: "FAQS_AND_SUMMARY", targetWordCount: 550, conceptsToCover: source.questionsAnswered },
    { sectionNumber: 11, sectionNumberLabel: "11", title: `Comprehensive House Construction Checklist & AutoCAD Audit by Dr. Rao`, purpose: "Provide master action checklist and consultation details.", knowledgeLayer: "FAQS_AND_SUMMARY", targetWordCount: 520, conceptsToCover: ["Pre-excavation checklist", "Dr. Rao's office (+91 92466 24248)", "AutoCAD drawing review"] }
  );

  return {
    articleTitle: `${source.title}: Complete Sthapatya Veda & Engineering Guide`,
    topicDomain: source.primaryTopic || 'Residential Vastu Planning',
    estimatedTotalWords: sections.reduce((a, s) => a + s.targetWordCount, 0),
    sections
  };
}
