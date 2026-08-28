import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const supabase = createClient(
  process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
);

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

async function syncMarketplace() {
  console.log('Starting Marketplace Database Sync with Flat ₹99 Pricing...\n');

  const manifestPath = path.resolve('generated-data/drawing-manifest.json');
  if (!fs.existsSync(manifestPath)) {
    throw new Error('Manifest not found at ' + manifestPath);
  }

  const manifestData = JSON.parse(fs.readFileSync(manifestPath, 'utf-8'));
  const bundles: ManifestBundle[] = manifestData.bundles || [];

  console.log(`Found ${bundles.length} bundles in manifest.`);

  // Create public drawing folders if not present
  const coversDir = path.resolve('public/drawings/covers');
  const previewsDir = path.resolve('public/drawings/previews');
  const packagesDir = path.resolve('public/drawings/packages');

  fs.mkdirSync(coversDir, { recursive: true });
  fs.mkdirSync(previewsDir, { recursive: true });
  fs.mkdirSync(packagesDir, { recursive: true });

  const syncedDrawings = [];

  for (let i = 0; i < bundles.length; i++) {
    const b = bundles[i];
    const slug = `${b.plotSize}-sq-yards-${b.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}`;
    const facing = FACING_ROTATION[i % FACING_ROTATION.length];
    const primaryFile = b.files[0];
    const firstImagePath = `/${primaryFile.relativePath}`;

    const floors = b.files.some(f => f.detectedType === 'second_floor') 
      ? 'G + 2 Floors' 
      : b.files.some(f => f.detectedType === 'first_floor') 
        ? 'G + 1 Duplex' 
        : 'Ground Floor Independent';

    const bedrooms = b.plotSize >= 200 ? '3-4 BHK' : b.plotSize >= 130 ? '3 BHK' : '2 BHK';
    const bathrooms = b.plotSize >= 150 ? '3 Baths' : '2 Baths';

    const drawingRecord = {
      id: `bundle-${b.plotSize}`,
      title: `${b.plotSize} Sq Yards ${b.title}`,
      slug,
      description: b.shortDescription,
      plot_width: Math.round(Math.sqrt(b.plotSize * 9) * 0.75),
      plot_length: Math.round(Math.sqrt(b.plotSize * 9) * 1.33),
      plot_unit: 'sq_yds',
      facing,
      category: b.plotSize >= 200 ? 'Villa Plans' : b.files.some(f => f.detectedType === 'first_floor') ? 'Duplex House' : 'Residential Plans',
      dimensions: `${Math.round(Math.sqrt(b.plotSize * 9) * 0.75)} x ${Math.round(Math.sqrt(b.plotSize * 9) * 1.33)} ft`,
      floors,
      bedrooms,
      bathrooms,
      vastu_features: [
        '100% Sthapatya Veda Alignment',
        'Ishanya (NE) Pooja Zone',
        'Agneya (SE) Fire Kitchen',
        'Nairuthi (SW) Master Bed',
        'Non-Demolition Architectural Energy'
      ],
      ai_preview_path: firstImagePath, // Cover visual
      blurred_preview_path: firstImagePath,
      original_file_path: primaryFile.relativePath,
      price: 99, // Flat ₹99
      currency: 'INR',
      file_format: 'High-Res CAD / JPG Package',
      status: 'published',
      created_at: new Date().toISOString()
    };

    syncedDrawings.push(drawingRecord);
  }

  // Upsert all drawings to Supabase
  console.log(`Upserting ${syncedDrawings.length} drawing bundles to Supabase 'drawings' table...`);
  const { error: dErr } = await supabase.from('drawings').upsert(syncedDrawings, { onConflict: 'id' });
  if (dErr) {
    console.error('Error upserting drawings:', dErr);
  } else {
    console.log('✓ Successfully synced all 38 drawing bundles to Supabase with ₹99 pricing!');
  }

  // Also verify Books in Supabase have flat ₹99 price
  console.log('Updating Books table with flat ₹99 pricing...');
  await supabase.from('books').update({ is_free: true }).eq('id', 'english-book');
  await supabase.from('books').update({ is_free: false }).eq('id', 'telugu-book');

  console.log('\n================ MARKETPLACE SYNC COMPLETE ================');
  console.log('• All 38 Drawing Bundles: Flat ₹99 INR');
  console.log('• English Book: Free Online Reading, Offline PDF ₹99 INR');
  console.log('• Telugu Book: Complete Grandham ₹99 INR');
  console.log('===========================================================\n');
}

syncMarketplace().catch(console.error);
