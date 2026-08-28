import fs from 'fs';
import path from 'path';

interface ManifestBundle {
  bundleKey: string;
  plotSize: number;
  unit: string;
  title: string;
  shortDescription: string;
  tags: string[];
  files: {
    filename: string;
    relativePath: string;
    sizeBytes: number;
    extension: string;
    detectedType: string;
    detectedLabel: string;
  }[];
  drawingCount: number;
}

const FACING_ROTATION = ['East', 'North', 'West', 'South', 'North-East', 'North-West', 'South-East', 'South-West'];

const COVER_TIERS: { [key: number]: string } = {
  87: '/drawings/covers/cover-87.jpg',
  96: '/drawings/covers/cover-96.jpg',
  98: '/drawings/covers/cover-98.jpg',
  99: '/drawings/covers/cover-99.jpg',
  105: '/drawings/covers/cover-105.jpg',
  116: '/drawings/covers/cover-116.jpg',
  126: '/drawings/covers/cover-126.jpg',
  130: '/drawings/covers/cover-130.jpg',
  157: '/drawings/covers/cover-157.jpg',
  175: '/drawings/covers/cover-175.jpg',
  248: '/drawings/covers/cover-248.jpg',
};

function getCoverForPlot(plotSize: number): string {
  if (COVER_TIERS[plotSize]) return COVER_TIERS[plotSize];
  if (plotSize <= 90) return COVER_TIERS[87];
  if (plotSize <= 97) return COVER_TIERS[96];
  if (plotSize <= 98) return COVER_TIERS[98];
  if (plotSize <= 100) return COVER_TIERS[99];
  if (plotSize <= 110) return COVER_TIERS[105];
  if (plotSize <= 120) return COVER_TIERS[116];
  if (plotSize <= 128) return COVER_TIERS[126];
  if (plotSize <= 135) return COVER_TIERS[130];
  if (plotSize <= 160) return COVER_TIERS[157];
  if (plotSize <= 200) return COVER_TIERS[175];
  return COVER_TIERS[248];
}

function buildBundlesTs() {
  const manifestPath = path.resolve('generated-data/drawing-manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const bundles: ManifestBundle[] = manifest.bundles || [];

  const processedBundles = bundles.map((b, i) => {
    const slug = `${b.plotSize}-sq-yards-${b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`;
    const facing = FACING_ROTATION[i % FACING_ROTATION.length];
    const primaryFile = b.files[0];
    const primaryDrawingUrl = `/Drawing Multicolor HR Vasthu/${encodeURIComponent(primaryFile.filename)}`;
    const aiCoverUrl = getCoverForPlot(b.plotSize);

    const hasG2 = b.files.some(f => f.detectedType === 'second_floor');
    const hasG1 = b.files.some(f => f.detectedType === 'first_floor');
    const floors = hasG2 ? 'G + 2 Floors' : hasG1 ? 'G + 1 Duplex' : 'Ground Floor Independent';
    const category = b.plotSize >= 200 ? 'Villa Plans' : hasG1 ? 'Duplex House' : 'Residential Plans';
    const bedrooms = b.plotSize >= 200 ? '3-4 BHK' : b.plotSize >= 130 ? '3 BHK' : '2 BHK';
    const bathrooms = b.plotSize >= 150 ? '3 Baths' : '2 Baths';

    const files = b.files.map((f, idx) => ({
      filename: f.filename,
      label: f.detectedLabel,
      type: f.detectedType,
      previewUrl: `/Drawing Multicolor HR Vasthu/${encodeURIComponent(f.filename)}`,
      isLocked: idx > 0
    }));

    return {
      id: `bundle-${b.plotSize}`,
      title: `${b.plotSize} Sq Yards ${b.title}`,
      slug,
      description: b.shortDescription,
      plotSize: b.plotSize,
      plotWidth: Math.round(Math.sqrt(b.plotSize * 9) * 0.75),
      plotLength: Math.round(Math.sqrt(b.plotSize * 9) * 1.33),
      plotUnit: 'sq_yds',
      facing,
      category,
      dimensions: `${Math.round(Math.sqrt(b.plotSize * 9) * 0.75)} x ${Math.round(Math.sqrt(b.plotSize * 9) * 1.33)} ft`,
      floors,
      bedrooms,
      bathrooms,
      drawingCount: b.drawingCount,
      vastuFeatures: [
        '100% Sthapatya Veda Alignment',
        'Ishanya (NE) Sacred Pooja Quadrant',
        'Agneya (SE) Fire Kitchen Placement',
        'Nairuthi (SW) Heavy Master Zone',
        'Non-Demolition Architectural Energy'
      ],
      aiPreviewPath: aiCoverUrl,
      blurredPreviewPath: primaryDrawingUrl,
      price: 99,
      currency: 'INR',
      status: 'published',
      files,
      createdAt: '2026-08-28T00:00:00.000Z'
    };
  });

  const code = `// AUTO-GENERATED DRAWING BUNDLES DATA (FLAT ₹99 PRICING & UNIQUE 3D AI COVERS)
// Sthapatya Veda Technical Plans by Dr. Kunchala Hanumantha Rao

export interface DrawingFileItem {
  filename: string;
  label: string;
  type: string;
  previewUrl: string;
  isLocked: boolean;
}

export interface DrawingBundleItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  plotSize: number;
  plotWidth: number;
  plotLength: number;
  plotUnit: string;
  facing: string;
  category: string;
  dimensions: string;
  floors: string;
  bedrooms: string;
  bathrooms: string;
  drawingCount: number;
  vastuFeatures: string[];
  aiPreviewPath: string;
  blurredPreviewPath: string;
  price: number; // Flat ₹99 only
  currency: string;
  status: string;
  files: DrawingFileItem[];
  createdAt: string;
}

export const DRAWING_BUNDLES: DrawingBundleItem[] = ${JSON.stringify(processedBundles, null, 2)};
`;

  const targetPlatform = path.resolve('src/core/data/drawing-bundles.ts');
  const targetAdmin = path.resolve('../hr-vasthu-admin/src/core/data/drawing-bundles.ts');

  fs.mkdirSync(path.dirname(targetPlatform), { recursive: true });
  fs.writeFileSync(targetPlatform, code, 'utf-8');
  console.log('✓ Written bundles with unique 3D covers to:', targetPlatform);

  if (fs.existsSync(path.dirname(targetAdmin))) {
    fs.writeFileSync(targetAdmin, code, 'utf-8');
    console.log('✓ Written bundles with unique 3D covers to:', targetAdmin);
  }
}

buildBundlesTs();
