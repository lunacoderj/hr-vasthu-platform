import fs from 'fs';
import path from 'path';

const DRAWINGS_DIR = path.resolve('public/Drawing Multicolor HR Vasthu');
const OUTPUT_DIR = path.resolve('generated-data');

interface DrawingFileEntry {
  filename: string;
  relativePath: string;
  sizeBytes: number;
  extension: string;
  detectedType: 'ground_floor' | 'first_floor' | 'second_floor' | 'terrace' | 'site_plan' | 'alternate' | 'master_plan';
  detectedLabel: string;
}

interface DrawingBundle {
  bundleKey: string;
  plotSize: number;
  unit: string;
  title: string;
  shortDescription: string;
  tags: string[];
  files: DrawingFileEntry[];
  drawingCount: number;
}

function detectFloorType(filename: string): { type: DrawingFileEntry['detectedType']; label: string } {
  const lower = filename.toLowerCase();

  if (lower.includes('ground') || lower.includes('gf')) {
    return { type: 'ground_floor', label: 'Ground Floor Plan' };
  }
  if (lower.includes('first') || lower.includes('ff') || lower.includes('1st')) {
    return { type: 'first_floor', label: 'First Floor Plan' };
  }
  if (lower.includes('second') || lower.includes('2nd')) {
    return { type: 'second_floor', label: 'Second Floor Plan' };
  }
  if (lower.includes('top') || lower.includes('terrace') || lower.includes('roof')) {
    return { type: 'terrace', label: 'Terrace / Roof Plan' };
  }
  if (lower.includes('site')) {
    return { type: 'site_plan', label: 'Site Layout Plan' };
  }
  if (lower.includes('copy') || lower.includes('alternate') || lower.includes('model') || lower.includes('photoshop')) {
    return { type: 'alternate', label: 'Alternative / Custom Layout' };
  }
  return { type: 'master_plan', label: 'Master Architectural Plan' };
}

function generateSmartTitle(plotSize: number, count: number): string {
  const styles = [
    'Modern Compact Vastu Home',
    'Executive Independent Vastu Residence',
    'Harmonious Family Vastu House',
    'Contemporary Vedic Living Plan',
    'Smart Spatial Vastu Villa',
    'Premium Architectural Vastu Home'
  ];
  const style = styles[plotSize % styles.length];
  return `${plotSize} Sq Yards ${style}`;
}

const NAME_TO_BUNDLE_MAP: { [key: string]: number } = {
  'bandari ravi kumar': 175,
  'nageswararao': 105,
  'm v rama lingeswararao': 205,
  'mutyalarao': 208,
  'prasanna kumar': 166,
  'ramesh': 271,
  'ranjith reddy': 195,
  'santhi srikakulam': 215,
  'uday bhaskar': 126,
  'ayyappanaidu': 153,
  'v ayyappanaidu': 153,
  'midhilapuri': 160
};

async function runIngestion() {
  if (!fs.existsSync(DRAWINGS_DIR)) {
    console.error(`Drawings directory not found at: ${DRAWINGS_DIR}`);
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  const allFiles = fs.readdirSync(DRAWINGS_DIR);
  console.log(`Found ${allFiles.length} total files in ${DRAWINGS_DIR}`);

  const bundleMap: { [key: string]: DrawingFileEntry[] } = {};
  const unmatchedFiles: string[] = [];

  for (const filename of allFiles) {
    const ext = path.extname(filename).toLowerCase();
    if (!['.jpg', '.jpeg', '.png', '.webp', '.tif', '.tiff'].includes(ext)) {
      continue;
    }

    const stat = fs.statSync(path.join(DRAWINGS_DIR, filename));
    const lower = filename.toLowerCase();

    let plotNum: number | null = null;

    // 1. Match known client name mapping first
    for (const [nameKey, mappedPlot] of Object.entries(NAME_TO_BUNDLE_MAP)) {
      if (lower.includes(nameKey)) {
        plotNum = mappedPlot;
        break;
      }
    }

    // 2. Direct leading number match (e.g. "098.png" -> 98, "87 Ground.jpg" -> 87)
    if (!plotNum) {
      const leadingMatch = filename.match(/^0*(\d+)/);
      if (leadingMatch) {
        plotNum = parseInt(leadingMatch[1], 10);
      } else {
        const embeddedMatch = filename.match(/\s(\d{2,3})\s/);
        if (embeddedMatch) {
          plotNum = parseInt(embeddedMatch[1], 10);
        }
      }
    }

    if (plotNum) {
      const bundleKey = String(plotNum);
      const { type, label } = detectFloorType(filename);

      if (!bundleMap[bundleKey]) {
        bundleMap[bundleKey] = [];
      }

      bundleMap[bundleKey].push({
        filename,
        relativePath: `Drawing Multicolor HR Vasthu/${filename}`,
        sizeBytes: stat.size,
        extension: ext,
        detectedType: type,
        detectedLabel: label
      });
    } else {
      unmatchedFiles.push(filename);
    }
  }

  // Create structured bundles
  const bundles: DrawingBundle[] = Object.keys(bundleMap)
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    .map(key => {
      const plotSize = parseInt(key, 10);
      const files = bundleMap[key];
      const title = generateSmartTitle(plotSize, files.length);

      return {
        bundleKey: key,
        plotSize,
        unit: 'Sq Yards',
        title,
        shortDescription: `Authoritative ${plotSize} Sq Yards architectural floor plan pack with ${files.length} technical drawings, designed according to Sthapatya Veda principles by Dr. Kunchala Hanumantha Rao.`,
        tags: [`${plotSize} Sq Yards`, 'Vastu Plan', 'Residential', 'Sthapatya Veda'],
        files,
        drawingCount: files.length
      };
    });

  const manifest = {
    generatedAt: new Date().toISOString(),
    totalFilesScanned: allFiles.length,
    totalGroupedFiles: bundles.reduce((acc, b) => acc + b.drawingCount, 0),
    totalBundlesCreated: bundles.length,
    unmatchedFilesCount: unmatchedFiles.length,
    unmatchedFiles,
    bundles
  };

  const manifestPath = path.join(OUTPUT_DIR, 'drawing-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf-8');

  console.log('\n================ INGESTION REPORT ================');
  console.log(`Total Files Scanned: ${manifest.totalFilesScanned}`);
  console.log(`Total Bundles Created: ${manifest.totalBundlesCreated}`);
  console.log(`Total Grouped Files: ${manifest.totalGroupedFiles}`);
  console.log(`Unmatched / Review Needed: ${manifest.unmatchedFilesCount}`);
  console.log(`Manifest written to: ${manifestPath}`);
  console.log('==================================================\n');

  bundles.forEach(b => {
    console.log(`• Bundle [${b.plotSize} Sq Yds]: ${b.title} (${b.drawingCount} drawings)`);
  });
}

runIngestion().catch(console.error);
