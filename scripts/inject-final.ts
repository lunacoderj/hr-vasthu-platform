import fs from 'fs';

const finalParagraphs: Record<number, string> = {
  1: `\n\n#### Integrating Ancient Wisdom with Contemporary Urban Bye-Laws:
In modern urban planning, municipal master plans and building bye-laws often mandate specific front, rear, and side setback dimensions that may appear at odds with classical Sthapatya Veda orientations. Dr. Rao's extensive field experience bridges this gap by demonstrating how architectural floor plans can achieve 100% statutory municipal compliance while simultaneously maintaining flawless directional and energetic alignment. By fine-tuning internal wall placements, door swings, and window apertures within the legally mandated building envelope, homeowners achieve complete structural compliance without sacrificing energetic harmony.`,

  2: `\n\n#### The Electromagnetic Grid & Bio-Field Resonance:
The interaction between Earth's telluric currents and human physiology has been recognized in Indian temple architecture for millennia. When structural load-bearing elements are aligned with the natural North-South geomagnetic lines of induction, the structural masonry acts as a passive electromagnetic stabilizer. Occupants residing within such harmonized spaces report enhanced vitality, lower psychological fatigue, and improved restorative sleep, corroborating the classical principle that proper spatial orientation sustains the human bio-energetic field.`,

  3: `\n\n#### Auspicious Threshold Materials and Frame Fastening Protocols:
When securing the main entrance frame to the surrounding brick masonry, only non-ferrous anchors, brass screws, or seasoned wooden wedges should be used directly within the door frame. Direct metal ties cutting across the wooden threshold interrupt the natural vibrational dampening properties of the hardwood. In addition, treating the bottom of the wooden frame with natural neem oil and herbal anti-termite emulsions protects the entrance structure against subterranean insect infestation for decades.`,

  4: `\n\n#### Compound Wall Drainage Weep Holes and Retaining Stability:
In plots with sloping topography or elevated road levels, compound retaining walls must be equipped with 3-inch PVC weep holes placed at 4-foot intervals along the lowest boundary sections (predominantly in the North and East). These weep holes prevent hydrostatic water pressure from accumulating behind the masonry during torrential rainfall, ensuring the structural stability of the compound wall while allowing clean surface drainage towards public stormwater conduits.`,

  5: `\n\n#### False Ceiling Layouts and Structural Beam Concealment:
In modern RCC framed residential construction, deep structural tie beams and transfer girders often cross living and bedroom spaces. Classical Vastu strictly advises against sitting, sleeping, or working directly beneath exposed downward structural load vectors. Installing smooth plaster of Paris or gypsum board false ceilings completely conceals structural beams, creating a uniform, level ceiling profile that diffuses ambient room lighting and eliminates oppressive gravitational compression over living spaces.`,

  6: `\n\n#### Dual-Chamber Sump Waterproofing & Contamination Prevention:
Underground potable water reservoirs must be treated with food-grade crystalline waterproofing compounds applied in two cross-hatched coats over the internal plaster. All municipal inlet supply pipes, domestic delivery pipes, and overflow drainage lines must be sealed with polyurethane expansion gaskets where they penetrate the RCC sump walls, preventing exterior soil moisture or groundwater contaminants from breaching the clean water chamber under high groundwater tables.`,

  7: `\n\n#### Roof Terrace Parapet Railings and Wind Pressure Aerodynamics:
On high-rise residential buildings and multi-story bungalows, wind forces exert significant aerodynamic pressure against rooftop structures. Constructing solid masonry parapet walls on the South and West sides deflects turbulent wind gusts, while installing open stainless steel railings on the North and East perimeters allows unobstructed air circulation and natural lighting to wash over the roof slab without creating negative air turbulence.`,

  8: `\n\n#### Column Grid Continuity and Cantilever Balcony Reinforcement:
Cantilevered balconies extending from upper residential floors require careful structural detailing. Structural engineers must extend the main floor slab reinforcement continuously back into the interior slab with an anchorage length of at least 1.5 times the cantilever projection. Balancing cantilever projections on the Northern and Eastern elevations ensures maximum biophilic comfort and structural safety without inducing foundation rotation.`,

  9: `\n\n#### High-Purity Metallic Strips for Threshold Energy Grounding:
When installing copper or brass energy containment strips across room thresholds, the metal strip must measure a minimum of 0.5 mm in thickness and 25 mm in width. The strip is embedded into a 10 mm deep grooved chase cut into the screed floor, sealed with inert epoxy resin, and covered by the finished floor tile. This creates a permanent, invisible energetic barrier that neutralizes negative emissions from misplaced utilities without causing any aesthetic disturbance to the interior decor.`,

  10: `\n\n#### Real-World Case Studies and Empirical Evidence:
Across hundreds of documented residential case studies audited by HR Vasthu, implementing non-demolition scientific remedies has produced measurable improvements in household harmony, business cash flow, and occupant health within 45 to 90 days. Homeowners who previously experienced persistent domestic friction, unexplained financial drainage, or sleep disturbances reported noticeable relief following the correct alignment of beds, threshold grounding of misplaced bathrooms, and balancing of directional setbacks.`,

  11: `\n\n#### Step-by-Step Blueprint Submission Protocol for Dr. Rao:
To initiate a comprehensive AutoCAD blueprint review with Dr. Kunchala Hanumantha Rao, property owners should submit:
1. Complete digital CAD (.dwg) or clear PDF architectural floor plans showing all room dimensions, door swings, and window locations.
2. Verified site plot dimensions including all four boundary lengths, diagonal cross-measurements, and approach road widths.
3. High-precision compass orientation measured at the center of the plot using a digital or prismatic compass.
4. Proposed locations of subterranean utilities (sump, borewell, septic tank) and rooftop installations (overhead tank, staircase headroom).
Dr. Rao's office will provide a customized, point-by-point Vastu compliance audit report with exact dimensional corrections.`
};

const engineCode = fs.readFileSync('scripts/build-full-expansion-engine.ts', 'utf-8');

let updatedEngineCode = engineCode;
for (let i = 1; i <= 11; i++) {
  const targetVar = `const p${i} = \``;
  const extra = finalParagraphs[i];
  updatedEngineCode = updatedEngineCode.replace(
    targetVar,
    `${targetVar}${extra}`
  );
}

fs.writeFileSync('scripts/build-full-expansion-engine.ts', updatedEngineCode, 'utf-8');
console.log('✅ Final paragraphs injected into build-full-expansion-engine.ts!');
