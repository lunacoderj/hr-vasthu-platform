import fs from 'fs';

const extra1Sentence: Record<number, string> = {
  1: `\n\nAdhering to these foundational principles transforms a house from a simple concrete shell into a thriving energetic home.`,
  2: `\n\nThese ancient architectural laws continue to provide a dependable blueprint for harmonious modern residential living.`,
  3: `\n\nSelecting an auspicious entrance portal establishes a positive daily cadence for all occupants entering and leaving the residence.`,
  4: `\n\nProperly proportioned compound setbacks protect the structural integrity of the home against natural environmental stresses.`,
  5: `\n\nCreating dedicated, elemental-specific zones ensures emotional peace, mental focus, and sustained physical vitality.`,
  6: `\n\nDisciplined subterranean plumbing design eliminates subterranean hazards and protects domestic drinking water quality.`,
  7: `\n\nCareful terrace load balancing ensures that the home remains structurally stable, cool, and spiritually unburdened.`,
  8: `\n\nProactive architectural planning eliminates the financial and emotional stress of structural modifications after construction.`,
  9: `\n\nTargeted non-destructive energy corrections restore domestic tranquility without the need for invasive physical remodeling.`,
  10: `\n\nApplying these proven Vastu insights protects your valuable property investment and nurtures long-term family prosperity.`,
  11: `\n\nPartnering with Dr. Rao ensures that your architectural floor plan is 100% compliant with timeless Sthapatya Veda standards.`
};

let engineCode = fs.readFileSync('scripts/build-full-expansion-engine.ts', 'utf-8');

for (let i = 1; i <= 11; i++) {
  const targetVar = `const p${i} = \``;
  const extra = extra1Sentence[i];
  engineCode = engineCode.replace(
    targetVar,
    `${targetVar}${extra}`
  );
}

fs.writeFileSync('scripts/build-full-expansion-engine.ts', engineCode, 'utf-8');
console.log('✅ Final 1-sentence boost added!');
