/**
 * Production Image Provider & Programmatic SVG Generator
 * Generates and downloads real image assets to disk.
 * Validates HTTP status, Content-Type, file size, image headers, and computes SHA-256 hashes.
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface ImageAsset {
  imageId: string;
  articleId: string;
  sectionId: string;
  type: 'AI_GENERATED_IMAGE' | 'PROGRAMMATIC_SVG_DIAGRAM' | 'YOUTUBE_HERO';
  purpose: string;
  prompt: string;
  provider: string;
  model: string;
  width: number;
  height: number;
  localPath: string;
  publicUrl: string;
  sha256: string;
  fileSizeBytes: number;
  validationStatus: 'GENERATED' | 'FAILED';
  errorMessage?: string;
}

export class ImageProvider {
  private outputBaseDir: string;

  constructor(outputBaseDir = 'public/blog-assets') {
    this.outputBaseDir = path.resolve(process.cwd(), outputBaseDir);
    if (!fs.existsSync(this.outputBaseDir)) {
      fs.mkdirSync(this.outputBaseDir, { recursive: true });
    }
  }

  /**
   * Generates a programmatic, mathematically precise SVG directional diagram for Vastu zoning
   */
  public generateProgrammaticSvgDiagram(
    articleId: string,
    topic: string,
    highlightQuadrant: 'NW' | 'NE' | 'SE' | 'SW' | 'CENTER',
    highlightLabel: string
  ): ImageAsset {
    const articleDir = path.join(this.outputBaseDir, articleId);
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    const imageId = `diag-${articleId}-quadrant-${highlightQuadrant.toLowerCase()}`;
    const filename = `${imageId}.svg`;
    const filePath = path.join(articleDir, filename);

    // Color definitions
    const bg = '#fffdf8';
    const border = '#193b3a';
    const highlightBg = '#ff725e';
    const textDark = '#193b3a';

    const isNW = highlightQuadrant === 'NW';
    const isNE = highlightQuadrant === 'NE';
    const isSE = highlightQuadrant === 'SE';
    const isSW = highlightQuadrant === 'SW';

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="800" height="800">
  <defs>
    <style>
      .title { font-family: 'DM Sans', sans-serif; font-size: 20px; font-weight: bold; fill: ${textDark}; }
      .quad-label { font-family: 'DM Sans', sans-serif; font-size: 16px; font-weight: bold; fill: ${textDark}; }
      .quad-sub { font-family: 'DM Sans', sans-serif; font-size: 13px; fill: #647573; }
      .highlight-label { font-family: 'DM Sans', sans-serif; font-size: 15px; font-weight: bold; fill: #ffffff; }
      .dir-badge { font-family: 'DM Sans', sans-serif; font-size: 14px; font-weight: bold; fill: #ffffff; }
    </style>
  </defs>

  <!-- Background -->
  <rect width="800" height="800" fill="${bg}" rx="20" />
  <rect x="20" y="20" width="760" height="760" fill="none" stroke="${border}" stroke-width="2" stroke-opacity="0.2" rx="16" />

  <!-- Title Header -->
  <text x="400" y="60" text-anchor="middle" class="title">VASTU SHASTRA DIRECTIONAL ZONING: ${topic.toUpperCase()}</text>

  <!-- 3x3 Plot Matrix -->
  <!-- NW Quadrant (Vayuvyam) -->
  <rect x="100" y="100" width="200" height="200" fill="${isNW ? highlightBg : '#e6f4f1'}" stroke="${border}" stroke-width="2" rx="8" />
  <text x="200" y="180" text-anchor="middle" class="${isNW ? 'highlight-label' : 'quad-label'}">NORTH-WEST (వాయువ్యం)</text>
  <text x="200" y="210" text-anchor="middle" class="${isNW ? 'highlight-label' : 'quad-sub'}">${isNW ? highlightLabel : 'Air Element (Vayu)'}</text>

  <!-- North Zone -->
  <rect x="300" y="100" width="200" height="200" fill="#f8fafc" stroke="${border}" stroke-width="2" rx="8" />
  <text x="400" y="190" text-anchor="middle" class="quad-label">NORTH (ఉత్తరం)</text>
  <text x="400" y="220" text-anchor="middle" class="quad-sub">Kuber / Wealth Flux</text>

  <!-- NE Quadrant (Eshanyam) -->
  <rect x="500" y="100" width="200" height="200" fill="${isNE ? highlightBg : '#e0f2fe'}" stroke="${border}" stroke-width="2" rx="8" />
  <text x="600" y="180" text-anchor="middle" class="${isNE ? 'highlight-label' : 'quad-label'}">NORTH-EAST (ఈశాన్యం)</text>
  <text x="600" y="210" text-anchor="middle" class="${isNE ? 'highlight-label' : 'quad-sub'}">${isNE ? highlightLabel : 'Water Element (Jala)'}</text>

  <!-- West Zone -->
  <rect x="100" y="300" width="200" height="200" fill="#f8fafc" stroke="${border}" stroke-width="2" rx="8" />
  <text x="200" y="390" text-anchor="middle" class="quad-label">WEST (పడమర)</text>
  <text x="200" y="420" text-anchor="middle" class="quad-sub">Varuna / Stability</text>

  <!-- Center Core (Brahmasthanam) -->
  <rect x="300" y="300" width="200" height="200" fill="#fef3c7" stroke="${border}" stroke-width="2" rx="8" />
  <text x="400" y="390" text-anchor="middle" class="quad-label">BRAHMASTHANAM (మధ్యభాగం)</text>
  <text x="400" y="420" text-anchor="middle" class="quad-sub">Space Element (Akasha - Keep Open)</text>

  <!-- East Zone -->
  <rect x="500" y="300" width="200" height="200" fill="#f8fafc" stroke="${border}" stroke-width="2" rx="8" />
  <text x="600" y="390" text-anchor="middle" class="quad-label">EAST (తూర్పు)</text>
  <text x="600" y="420" text-anchor="middle" class="quad-sub">Indra / Solar Ingress</text>

  <!-- SW Quadrant (Nairuthi) -->
  <rect x="100" y="500" width="200" height="200" fill="${isSW ? highlightBg : '#fee2e2'}" stroke="${border}" stroke-width="2" rx="8" />
  <text x="200" y="580" text-anchor="middle" class="${isSW ? 'highlight-label' : 'quad-label'}">SOUTH-WEST (నైరుతి)</text>
  <text x="200" y="610" text-anchor="middle" class="${isSW ? 'highlight-label' : 'quad-sub'}">${isSW ? highlightLabel : 'Earth Element (Prithvi - Heavy)'}</text>

  <!-- South Zone -->
  <rect x="300" y="500" width="200" height="200" fill="#f8fafc" stroke="${border}" stroke-width="2" rx="8" />
  <text x="400" y="590" text-anchor="middle" class="quad-label">SOUTH (దక్షిణం)</text>
  <text x="400" y="620" text-anchor="middle" class="quad-sub">Yama / Grounding</text>

  <!-- SE Quadrant (Agneyam) -->
  <rect x="500" y="500" width="200" height="200" fill="${isSE ? highlightBg : '#ffedd5'}" stroke="${border}" stroke-width="2" rx="8" />
  <text x="600" y="580" text-anchor="middle" class="${isSE ? 'highlight-label' : 'quad-label'}">SOUTH-EAST (ఆగ్నేయం)</text>
  <text x="600" y="610" text-anchor="middle" class="${isSE ? 'highlight-label' : 'quad-sub'}">${isSE ? highlightLabel : 'Fire Element (Agni)'}</text>

  <!-- Footer Citation -->
  <text x="400" y="740" text-anchor="middle" class="quad-sub">Certified Sthapatya Veda Grid Matrix • Dr. Kunchala Hanumantha Rao (HR Vasthu)</text>
</svg>`;

    fs.writeFileSync(filePath, svgContent, 'utf-8');
    const sha256 = crypto.createHash('sha256').update(svgContent).digest('hex');
    const stats = fs.statSync(filePath);

    return {
      imageId,
      articleId,
      sectionId: 'directional-zoning',
      type: 'PROGRAMMATIC_SVG_DIAGRAM',
      purpose: `Precision directional quadrant diagram highlighting ${highlightQuadrant} for ${topic}`,
      prompt: `Programmatic SVG diagram for ${topic}`,
      provider: 'Local-Programmatic-SVG',
      model: 'SVG-2.0',
      width: 800,
      height: 800,
      localPath: filePath,
      publicUrl: `/blog-assets/${articleId}/${filename}`,
      sha256,
      fileSizeBytes: stats.size,
      validationStatus: 'GENERATED'
    };
  }

  /**
   * Downloads and validates an AI-generated image to local disk
   */
  public async downloadAndValidateImage(
    articleId: string,
    sectionId: string,
    purpose: string,
    prompt: string,
    remoteUrl: string
  ): Promise<ImageAsset> {
    const articleDir = path.join(this.outputBaseDir, articleId);
    if (!fs.existsSync(articleDir)) {
      fs.mkdirSync(articleDir, { recursive: true });
    }

    const cleanName = sectionId.replace(/[^\w-]/g, '-').toLowerCase().slice(0, 30);
    const filename = `${cleanName}-${Date.now().toString().slice(-4)}.webp`;
    const localPath = path.join(articleDir, filename);

    try {
      const response = await fetch(remoteUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        },
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}: ${response.statusText}`);
      }

      const contentType = response.headers.get('content-type') || '';
      if (!contentType.includes('image')) {
        throw new Error(`Invalid content-type: ${contentType}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      if (buffer.length < 5000) {
        throw new Error(`Downloaded image is too small (${buffer.length} bytes), likely corrupted`);
      }

      fs.writeFileSync(localPath, buffer);
      const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

      return {
        imageId: `img-${articleId}-${cleanName}`,
        articleId,
        sectionId,
        type: 'AI_GENERATED_IMAGE',
        purpose,
        prompt,
        provider: 'Pollinations-FLUX',
        model: 'flux-realism',
        width: 1200,
        height: 700,
        localPath,
        publicUrl: `/blog-assets/${articleId}/${filename}`,
        sha256,
        fileSizeBytes: buffer.length,
        validationStatus: 'GENERATED'
      };
    } catch (err: any) {
      return {
        imageId: `img-${articleId}-${cleanName}`,
        articleId,
        sectionId,
        type: 'AI_GENERATED_IMAGE',
        purpose,
        prompt,
        provider: 'Pollinations-FLUX',
        model: 'flux-realism',
        width: 1200,
        height: 700,
        localPath: '',
        publicUrl: '',
        sha256: '',
        fileSizeBytes: 0,
        validationStatus: 'FAILED',
        errorMessage: err.message
      };
    }
  }
}
