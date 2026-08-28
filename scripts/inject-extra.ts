import fs from 'fs';

const extraParagraphs: Record<number, string> = {
  1: `\n\n#### Systematic Site Audit Protocol by HR Vasthu:
When conducting physical on-site audits, Dr. Rao utilizes a multi-step diagnostic methodology:
1. Precise boundary measurement to verify plot orthogonality and identify diagonal angular skews (Vidisha angles).
2. Soil compaction and groundwater table depth assessments to calculate foundation bearing capacities.
3. Verification of approach road vectors, traffic velocity patterns, and surrounding high-rise shadowing.
4. Alignment of interior living room centers with the 81-pada Vastu Purusha Mandala energy grid to prevent column loads over the central Brahmasthanam core.`,

  2: `\n\n#### Mathematical Pada Sub-Divisions & Dimensional Proportions:
Classical treatises specify that architectural room dimensions should adhere to auspicious Ayadi Shadvarga calculations (Aya, Vya, Rksa, Yoni, Vara, and Tithi). Applying Ayadi mathematics ensures that the physical dimensions of the perimeter boundary and primary room enclosures vibrate in constructive resonance with the planetary frequencies of the homeowner, mitigating cosmic environmental stress.`,

  3: `\n\n#### Engineering Standards for Threshold Construction (Dwarasila):
The entrance wooden threshold must be carved from solid teak or sal wood, firmly anchored into the floor masonry with waterproof cement mortar. It serves two distinct engineering and biophilic purposes:
- Preventing external stormwater and crawling moisture from seeping beneath the entrance door during monsoon deluges.
- Creating a physical and psychological transition zone that demarcates external public chaos from the peaceful, sacred interior sanctuary of the home.`,

  4: `\n\n#### Soil Mechanics & Setback Drainage Gradients:
To prevent subgrade soil saturation along building footings, exterior setbacks must be paved with a minimum 1:50 slope directing surface water away from plinth beams towards peripheral drains. In expansive clay or black cotton soils, civil engineers must install perimeter gravel soak trenches to absorb seasonal soil expansion and prevent foundation upheaval.`,

  5: `\n\n#### Acoustic Comfort & Circadian Lighting Ergonomics:
Internal room allocation directly dictates occupant psychological well-being. Master bedrooms positioned in the quiet South-West sector experience minimal traffic disturbance and maximum thermal shielding. Simultaneously, living areas in the North-East capture dynamic morning daylight, stimulating serotonin production and fostering positive interpersonal communication among family members.`,

  6: `\n\n#### Dual-Chamber Sump Construction & Hydrostatic Protection:
Underground fresh water sumps in the North-East should be constructed as dual-compartment RCC tanks with continuous crystalline waterproofing additives in the concrete mix. This prevents water table hydrostatic pressure from penetrating the chamber during high-water monsoon periods, guaranteeing absolute biological safety for municipal drinking water storage.`,

  7: `\n\n#### Structural Load Distribution & Roof Terrace Thermal Insulation:
Placing the heavy overhead RCC water tank in the South-West adds beneficial dead load that counteracts lateral wind forces on multi-story buildings. To maintain cool indoor temperatures on the floor below, the roof terrace slab should be treated with high-albedo heat-reflective tiles or white mineral waterproofing coatings to reflect up to 85% of solar heat.`,

  8: `\n\n#### Seismic Column Alignment & Structural Shear Safety:
During structural framing, civil engineers must align primary column grids continuously from foundation to roof slab. Offset columns, cantilevered transfer slabs, or irregular beam notches created to bypass Vastu corners compromise seismic shear capacity and must be strictly resolved on the AutoCAD drawing board prior to casting.`,

  9: `\n\n#### Scientific Measurement of Geopathic Stress Fields:
Prior to applying metallic remedies, HR Vasthu measures ambient electromagnetic fields (EMF) and earth radiation grids (Hartmann and Curry lines) using calibrated electronic gaussmeters and bio-resonance lecher antennas. This ensures that metallic copper and lead stabilizers are embedded with surgical precision along exact energetic fault lines.`,

  10: `\n\n#### Comprehensive Renovation & Retrofitting Guidelines:
When retrofitting older homes with pre-existing Vastu defects, structural demolition should always be the last resort. Repurposing rooms (e.g., converting an inauspicious North-East bedroom into a study or prayer sanctuary), shifting bed alignments, and installing non-destructive threshold copper strips resolve over 85% of domestic energy imbalances without breaking walls.`,

  11: `\n\n#### Lifetime Architectural Harmony & Value Preservation:
A 100% Vastu-compliant residence constructed according to Sthapatya Veda principles preserves its financial market value and architectural durability across generations. By harmonizing physical structural engineering with timeless cosmic laws, Dr. Kunchala Hanumantha Rao provides families with enduring peace, robust health, and generational wealth.`
};

// Read build-full-expansion-engine.ts, inject extra paragraphs, and rebuild
const engineCode = fs.readFileSync('scripts/build-full-expansion-engine.ts', 'utf-8');

let updatedEngineCode = engineCode;
for (let i = 1; i <= 11; i++) {
  const targetVar = `const p${i} = \``;
  const extra = extraParagraphs[i];
  updatedEngineCode = updatedEngineCode.replace(
    targetVar,
    `${targetVar}${extra}`
  );
}

fs.writeFileSync('scripts/build-full-expansion-engine.ts', updatedEngineCode, 'utf-8');
console.log('✅ Injected extra paragraphs into build-full-expansion-engine.ts!');
