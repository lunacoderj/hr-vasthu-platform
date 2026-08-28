import fs from 'fs';

const boostParagraphs: Record<number, string> = {
  1: `\n\nEvery architectural recommendation provided by Dr. Rao is backed by rigorous empirical site validation, ensuring maximum protection and prosperity for the property owner.`,
  2: `\n\nBy harmonizing structural dimensions with classical planetary frequencies, the dwelling functions as an enduring energetic shield for all residents across changing astrological cycles.`,
  3: `\n\nProperly aligning the main doorway ensures that positive pranic currents circulate freely throughout the internal living spaces, fostering peace, good health, and professional advancement.`,
  4: `\n\nAdhering to perimeter setback ratios and compound wall height hierarchies establishes an optimal micro-climate that reduces ambient heat gain and protects structural foundations.`,
  5: `\n\nProper internal room placement according to Pancha Bhoota elemental zones ensures physical vitality, emotional harmony, and uninterrupted restorative sleep for the entire family.`,
  6: `\n\nMaintaining strict physical separation between clean water reservoirs and subterranean drainage pits prevents cross-contamination and preserves the pure bio-energetic vibration of the site.`,
  7: `\n\nElevating the overhead water storage tank in the South-West sector stabilizes the building's gravitational mass while keeping the sacred North-East quadrant unburdened and open to cosmic light.`,
  8: `\n\nEliminating structural defects on the drawing board before construction begins saves significant financial expenditure and prevents the need for invasive physical remodeling later.`,
  9: `\n\nImplementing non-demolition scientific remedies restores energetic balance to the property without compromising structural integrity or disrupting the daily life of the residents.`,
  10: `\n\nUnderstanding these core Vastu principles empowers homeowners to make informed architectural decisions that protect their family's long-term well-being and prosperity.`,
  11: `\n\nInvesting in professional AutoCAD Vastu plan verification with HR Vasthu guarantees complete peace of mind and enduring architectural harmony for generations to come.`
};

let engineCode = fs.readFileSync('scripts/build-full-expansion-engine.ts', 'utf-8');

for (let i = 1; i <= 11; i++) {
  const targetVar = `const p${i} = \``;
  const extra = boostParagraphs[i];
  engineCode = engineCode.replace(
    targetVar,
    `${targetVar}${extra}`
  );
}

fs.writeFileSync('scripts/build-full-expansion-engine.ts', engineCode, 'utf-8');
console.log('✅ Boosted paragraphs injected!');
