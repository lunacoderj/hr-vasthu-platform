import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlxbGhjeXJhaWNjcnJoamZ4cWt5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQwOTc4NzIsImV4cCI6MjA5OTY3Mzg3Mn0.wqemSrMZkuoN0LD_zIWCXzgxL41D6QK75Ur82X3X_fU';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const BASE_URL = 'https://www.hrvasthu.com';

interface PageMeta {
  title: string;
  description: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  keywords?: string;
  jsonLd: any;
  status?: number;
}

function escapeHtml(str: string = ''): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function markdownToSimpleHtml(md: string = ''): string {
  if (!md) return '';
  return md
    .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-2 text-stone-800">$1</h3>')
    .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-3 text-stone-900 font-serif">$1</h2>')
    .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4 text-stone-900 font-serif">$1</h1>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/gim, '<figure class="my-6"><img src="$2" alt="$1" class="w-full max-w-2xl rounded-lg shadow-md mx-auto" /><figcaption class="text-center text-xs text-stone-500 mt-2">$1</figcaption></figure>')
    .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-amber-700 underline font-medium">$1</a>')
    .replace(/\n\n+/g, '</p><p class="mb-4 text-stone-700 leading-relaxed text-base">')
    .replace(/^(.+)$/gim, (match) => {
      if (match.startsWith('<h') || match.startsWith('<figure') || match.startsWith('<p') || match.startsWith('</p')) {
        return match;
      }
      return `<p class="mb-4 text-stone-700 leading-relaxed text-base">${match}</p>`;
    });
}

function renderHtml(meta: PageMeta, contentHtml: string): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <link rel="icon" type="image/webp" href="/logo.webp" />
  <link rel="alternate icon" type="image/png" href="/logo.png" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <title>${escapeHtml(meta.title)}</title>
  <meta name="title" content="${escapeHtml(meta.title)}" />
  <meta name="description" content="${escapeHtml(meta.description)}" />
  ${meta.keywords ? `<meta name="keywords" content="${escapeHtml(meta.keywords)}" />` : ''}
  <meta name="author" content="Vasthu Siddanthi Dr. Kunchala Hanumantha Rao" />
  <meta name="robots" content="index, follow" />
  <link rel="canonical" href="${meta.canonicalUrl}" />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="${meta.ogType || 'website'}" />
  <meta property="og:url" content="${meta.canonicalUrl}" />
  <meta property="og:title" content="${escapeHtml(meta.title)}" />
  <meta property="og:description" content="${escapeHtml(meta.description)}" />
  <meta property="og:image" content="${meta.ogImage || `${BASE_URL}/hero.webp`}" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:url" content="${meta.canonicalUrl}" />
  <meta name="twitter:title" content="${escapeHtml(meta.title)}" />
  <meta name="twitter:description" content="${escapeHtml(meta.description)}" />
  <meta name="twitter:image" content="${meta.ogImage || `${BASE_URL}/hero.webp`}" />

  <!-- Preconnect & Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Source+Serif+Pro:wght@400;600;700&display=swap" />

  <!-- Structured Data JSON-LD -->
  <script type="application/ld+json">
${JSON.stringify(meta.jsonLd, null, 2)}
  </script>

  <style>
    :root { color-scheme: light dark; }
    html { box-sizing: border-box; }
    *, *:before, *:after { box-sizing: inherit; }
    body { margin: 0; padding: 0; font-family: 'Inter', system-ui, -apple-system, sans-serif; line-height: 1.6; color: #1c1917; background-color: #fafaf9; }
    .container { max-width: 1100px; margin: 0 auto; padding: 32px 20px; }
    h1 { font-family: 'Lora', serif; font-size: 2.25rem; line-height: 1.3; color: #1c1917; margin-bottom: 1rem; }
    h2 { font-family: 'Lora', serif; font-size: 1.6rem; color: #292524; margin-top: 2rem; margin-bottom: 0.75rem; }
    p { margin-bottom: 1.25rem; font-size: 1.05rem; color: #44403c; }
    a { color: #d4720a; text-decoration: underline; }
    .badge { display: inline-block; background: #fef3c7; color: #92400e; padding: 4px 12px; border-radius: 9999px; font-size: 12px; font-weight: 700; text-transform: uppercase; margin-bottom: 12px; letter-spacing: 0.05em; }
    .meta-bar { font-size: 0.875rem; color: #78716c; margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #e7e5e4; }
    .faq-item { background: #ffffff; border: 1px solid #e7e5e4; border-radius: 8px; padding: 16px 20px; margin-bottom: 16px; }
    .faq-q { font-weight: 700; font-size: 1.1rem; color: #1c1917; margin-bottom: 8px; }
    .faq-a { color: #57534e; margin: 0; }
    .nav-bar { background: #1c1917; color: #ffffff; padding: 16px 24px; }
    .nav-bar a { color: #fed7aa; text-decoration: none; margin-right: 18px; font-size: 0.9rem; font-weight: 600; }
    .nav-bar a:hover { text-decoration: underline; }
    .footer { background: #1c1917; color: #a8a29e; padding: 32px 20px; text-align: center; font-size: 0.875rem; margin-top: 60px; }
    .footer a { color: #fde68a; }
  </style>
</head>
<body>
  <header class="nav-bar">
    <div style="max-width: 1100px; margin: 0 auto; display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: 12px;">
      <a href="${BASE_URL}/" style="font-size: 1.1rem; font-weight: 800; color: #ffffff;">🔱 HR VASTHU</a>
      <nav>
        <a href="${BASE_URL}/">Home</a>
        <a href="${BASE_URL}/about">About</a>
        <a href="${BASE_URL}/videos">Videos</a>
        <a href="${BASE_URL}/blog">Articles</a>
        <a href="${BASE_URL}/drawings">House Plans</a>
        <a href="${BASE_URL}/books">Books</a>
        <a href="${BASE_URL}/contact">Contact</a>
        <a href="${BASE_URL}/appointment">Appointment</a>
      </nav>
    </div>
  </header>

  <div id="root">
    ${contentHtml}
  </div>

  <footer class="footer">
    <p><strong>HR Vasthu — Dr. Kunchala Hanumantha Rao (Vasthu Siddanthi)</strong></p>
    <p>Opp. Rama Lakshmi Apartments, Pedda Waltair, Visakhapatnam, Andhra Pradesh — 530017 | Phone: <a href="tel:+919246624248">+91 92466 24248</a></p>
    <p style="margin-top: 12px;">
      <a href="${BASE_URL}/drawings">Vastu Drawings</a> • 
      <a href="${BASE_URL}/videos">Video Masterclasses</a> • 
      <a href="${BASE_URL}/blog">Vastu Knowledge Base</a> • 
      <a href="${BASE_URL}/privacy">Privacy Policy</a> • 
      <a href="${BASE_URL}/terms">Terms</a> • 
      <a href="${BASE_URL}/disclaimer">Disclaimer</a>
    </p>
  </footer>

  <script type="module" src="/src/main.tsx"></script>
</body>
</html>`;
}

export default async function handler(req: any, res: any) {
  const rawPath = (req.query.path as string) || req.url || '/';
  const cleanPath = rawPath.split('?')[0].replace(/\/+/g, '/');
  const path = cleanPath === '' || cleanPath === '/index.html' ? '/' : cleanPath;

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=86400, stale-while-revalidate=604800');

  try {
    // -------------------------------------------------------------
    // 1. ROUTE: Blog Post Detail (/blog/:slug)
    // -------------------------------------------------------------
    if (path.startsWith('/blog/') && path !== '/blog/' && path !== '/blog') {
      const rawSlug = decodeURIComponent(path.replace(/^\/blog\//, '').trim());
      const altSlug = rawSlug.endsWith('-blog') ? rawSlug.replace(/-blog$/, '') : `${rawSlug}-blog`;

      const { data: blogs, error } = await supabase
        .from('blogs')
        .select('*')
        .eq('is_published', true)
        .or(`slug.eq.${rawSlug},slug.eq.${altSlug}`)
        .limit(1);

      const blog = blogs && blogs.length > 0 ? blogs[0] : null;

      if (!blog) {
        // Fallback search with partial keyword or ID
        const ytMatch = rawSlug.match(/([a-zA-Z0-9_-]{11})(?:-blog)?$/);
        let fallbackBlog: any = null;
        if (ytMatch && ytMatch[1]) {
          const { data: byYt } = await supabase.from('blogs').select('*').eq('is_published', true).ilike('slug', `%${ytMatch[1]}%`).limit(1);
          if (byYt && byYt.length > 0) fallbackBlog = byYt[0];
        }

        if (!fallbackBlog) {
          res.status(404);
          return res.send(renderHtml({
            title: 'Article Not Found — HR Vasthu',
            description: 'The requested Vastu research article could not be found. Browse our complete library of authentic Vedic Vastu guides.',
            canonicalUrl: `${BASE_URL}/blog`,
            jsonLd: {
              '@context': 'https://schema.org',
              '@type': 'WebPage',
              name: 'Article Not Found',
              url: `${BASE_URL}/blog`
            }
          }, `
            <main class="container">
              <h1>Article Not Found</h1>
              <p>We could not locate the specific Vastu research guide you requested. It may have been renamed or updated.</p>
              <p><a href="${BASE_URL}/blog">Browse All Vastu Articles &rarr;</a></p>
            </main>
          `));
        }

        return serveBlogPost(res, fallbackBlog);
      }

      return serveBlogPost(res, blog);
    }

    // -------------------------------------------------------------
    // 2. ROUTE: Video Detail (/videos/:id)
    // -------------------------------------------------------------
    if (path.startsWith('/videos/') && path !== '/videos/' && path !== '/videos') {
      const rawId = decodeURIComponent(path.replace(/^\/videos\//, '').trim());
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawId);
      
      let query = supabase.from('videos').select('*');
      if (isUUID) {
        query = query.or(`youtube_id.eq.${rawId},id.eq.${rawId}`);
      } else {
        query = query.eq('youtube_id', rawId);
      }

      const { data: videos } = await query.limit(1);
      const video = videos && videos.length > 0 ? videos[0] : null;

      if (!video) {
        res.status(404);
        return res.send(renderHtml({
          title: 'Video Not Found — HR Vasthu',
          description: 'The requested Vastu video masterclass could not be found.',
          canonicalUrl: `${BASE_URL}/videos`,
          jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Video Not Found', url: `${BASE_URL}/videos` }
        }, `
          <main class="container">
            <h1>Video Masterclass Not Found</h1>
            <p>The requested video lesson may have been updated or moved.</p>
            <p><a href="${BASE_URL}/videos">Explore 490+ Vastu Video Lessons &rarr;</a></p>
          </main>
        `));
      }

      const canonicalUrl = `${BASE_URL}/videos/${video.youtube_id || video.id}`;
      const thumb = video.thumbnail_max || video.thumbnail_high || video.thumbnail_medium || `${BASE_URL}/hero.webp`;
      const cleanDesc = (video.description || '').replace(/\s+/g, ' ').trim();
      const metaDesc = cleanDesc.slice(0, 160) || `Watch authentic Vedic Vastu video analysis by Dr. Kunchala Hanumantha Rao on ${video.title}.`;

      const videoSchema: any = {
        '@context': 'https://schema.org',
        '@type': 'VideoObject',
        name: video.title,
        description: cleanDesc.slice(0, 500) || metaDesc,
        thumbnailUrl: [thumb],
        uploadDate: video.published_at || new Date().toISOString(),
        contentUrl: `https://www.youtube.com/watch?v=${video.youtube_id}`,
        embedUrl: `https://www.youtube-nocookie.com/embed/${video.youtube_id}`,
        publisher: {
          '@type': 'Organization',
          name: 'HR Vasthu',
          logo: { '@type': 'ImageObject', url: `${BASE_URL}/logo.png` }
        }
      };

      const bodyHtml = `
        <main class="container">
          <div class="breadcrumbs">
            <a href="${BASE_URL}/">Home</a> &gt; <a href="${BASE_URL}/videos">Videos</a> &gt; <span>${escapeHtml(video.title)}</span>
          </div>

          <span class="badge">Vedic Vastu Masterclass</span>
          <h1>${escapeHtml(video.title)}</h1>

          <div class="meta-bar">
            <span>By <strong>Dr. Kunchala Hanumantha Rao</strong> (Vasthu Siddanthi)</span> • 
            <span>Published: ${video.published_at ? new Date(video.published_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Recent'}</span> • 
            <span>Views: ${video.views ? Number(video.views).toLocaleString() : '1,000+'}</span>
          </div>

          <div style="margin: 24px 0; text-align: center;">
            <iframe 
              src="https://www.youtube-nocookie.com/embed/${video.youtube_id}" 
              title="${escapeHtml(video.title)}" 
              style="width: 100%; max-width: 800px; aspect-ratio: 16/9; border: 0; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowfullscreen>
            </iframe>
          </div>

          <article style="max-width: 800px; margin: 32px auto 0;">
            <h2>Video Overview & Architectural Analysis</h2>
            <p>${escapeHtml(cleanDesc)}</p>

            <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin-top: 32px;">
              <h3 style="margin-top: 0; color: #92400e;">Need Personal Consultation with Dr. Hanumantha Rao?</h3>
              <p style="margin-bottom: 12px; color: #78350f;">Get professional Vedic architectural guidance without demolition for your home, plot, or commercial establishment.</p>
              <p style="margin: 0;">
                <a href="${BASE_URL}/appointment" style="font-weight: 700; color: #b45309; text-decoration: underline;">Schedule In-Person or Online Consultation &rarr;</a>
              </p>
            </div>
          </article>
        </main>
      `;

      return res.status(200).send(renderHtml({
        title: `${video.title} | HR Vasthu Dr. Hanumantha Rao`,
        description: metaDesc,
        canonicalUrl,
        ogImage: thumb,
        ogType: 'video.other',
        jsonLd: videoSchema
      }, bodyHtml));
    }

    // -------------------------------------------------------------
    // 3. ROUTE: Drawing Detail (/drawings/:slug)
    // -------------------------------------------------------------
    if (path.startsWith('/drawings/') && path !== '/drawings/' && path !== '/drawings') {
      const rawSlug = decodeURIComponent(path.replace(/^\/drawings\//, '').trim());

      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(rawSlug);
      let query = supabase.from('drawings').select('*');
      if (isUUID) {
        query = query.or(`slug.eq.${rawSlug},id.eq.${rawSlug}`);
      } else {
        query = query.eq('slug', rawSlug);
      }

      const { data: drawings } = await query.limit(1);
      const drawing = drawings && drawings.length > 0 ? drawings[0] : null;

      if (!drawing) {
        res.status(404);
        return res.send(renderHtml({
          title: 'Drawing Plan Not Found — HR Vasthu',
          description: 'The requested Vastu CAD house plan blueprint could not be found.',
          canonicalUrl: `${BASE_URL}/drawings`,
          jsonLd: { '@context': 'https://schema.org', '@type': 'WebPage', name: 'Drawing Not Found', url: `${BASE_URL}/drawings` }
        }, `
          <main class="container">
            <h1>Vastu Blueprint Not Found</h1>
            <p>The requested CAD architectural blueprint could not be found.</p>
            <p><a href="${BASE_URL}/drawings">Explore 38+ Vastu CAD House Plans &rarr;</a></p>
          </main>
        `));
      }

      const canonicalUrl = `${BASE_URL}/drawings/${drawing.slug || drawing.id}`;
      const title = `${drawing.title || 'Vastu House Plan'} | CAD Blueprint | HR Vasthu`;
      const metaDesc = (drawing.description || `Download authentic 100% Vedic Vastu house plan designed by Dr. Kunchala Hanumantha Rao. Direction: ${drawing.facing_direction || 'North/East'}.`).slice(0, 160);

      const drawingSchema: any = {
        '@context': 'https://schema.org',
        '@type': 'Product',
        name: drawing.title,
        description: drawing.description || metaDesc,
        image: drawing.cover_image_url || `${BASE_URL}/hero.webp`,
        offers: {
          '@type': 'Offer',
          price: drawing.price || '499',
          priceCurrency: 'INR',
          availability: 'https://schema.org/InStock'
        },
        brand: {
          '@type': 'Brand',
          name: 'HR Vasthu'
        }
      };

      const bodyHtml = `
        <main class="container">
          <div class="breadcrumbs">
            <a href="${BASE_URL}/">Home</a> &gt; <a href="${BASE_URL}/drawings">House Plans</a> &gt; <span>${escapeHtml(drawing.title)}</span>
          </div>

          <span class="badge">Vedic Architecture CAD Blueprint</span>
          <h1>${escapeHtml(drawing.title)}</h1>

          <div class="meta-bar">
            <span>Facing: <strong>${escapeHtml(drawing.facing_direction || 'Vedic Directional')}</strong></span> • 
            <span>Dimensions: <strong>${escapeHtml(drawing.plot_dimensions || 'Standard Vedic Dimension')}</strong></span> • 
            <span>Designed by: <strong>Dr. Kunchala Hanumantha Rao</strong></span>
          </div>

          ${drawing.cover_image_url ? `
            <div style="text-align: center; margin: 24px 0;">
              <img src="${drawing.cover_image_url}" alt="${escapeHtml(drawing.title)}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
            </div>
          ` : ''}

          <article style="max-width: 800px; margin: 0 auto;">
            <h2>Plan Specifications & Vastu Compliance</h2>
            <p>${escapeHtml(drawing.description || '100% Vedic compliant architectural drawing designed according to Sthapatya Veda principles.')}</p>
            
            <p style="margin-top: 24px;">
              <a href="${BASE_URL}/appointment" style="font-weight: 700; color: #b45309;">Book Custom House Plan Consultation with Dr. Hanumantha Rao &rarr;</a>
            </p>
          </article>
        </main>
      `;

      return res.status(200).send(renderHtml({
        title,
        description: metaDesc,
        canonicalUrl,
        ogImage: drawing.cover_image_url || `${BASE_URL}/hero.webp`,
        jsonLd: drawingSchema
      }, bodyHtml));
    }

    // -------------------------------------------------------------
    // 4. ROUTE: About Page (/about)
    // -------------------------------------------------------------
    if (path === '/about') {
      const canonicalUrl = `${BASE_URL}/about`;
      const title = 'About Dr. Kunchala Hanumantha Rao | Best Vasthu Siddanthi in AP & Telangana';
      const description = 'Learn about Dr. Kunchala Hanumantha Rao, Master of Vedic Architecture with 30+ years empirical research, 10,000+ consultations, and recipient of the International Nepal Sadbhavana Award.';

      const aboutSchema = {
        '@context': 'https://schema.org',
        '@type': 'AboutPage',
        name: title,
        url: canonicalUrl,
        mainEntity: {
          '@type': 'Person',
          name: 'Dr. Kunchala Hanumantha Rao',
          jobTitle: 'Vasthu Siddanthi & Vedic Architect',
          award: 'International Nepal Sadbhavana Award',
          telephone: '+919246624248',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Opposite Rama Lakshmi Apartments, Pedda Waltair',
            addressLocality: 'Visakhapatnam',
            addressRegion: 'Andhra Pradesh',
            postalCode: '530017',
            addressCountry: 'IN'
          }
        }
      };

      const bodyHtml = `
        <main class="container">
          <div class="breadcrumbs">
            <a href="${BASE_URL}/">Home</a> &gt; <span>About</span>
          </div>

          <span class="badge">Master of Vedic Architecture</span>
          <h1>About Dr. Kunchala Hanumantha Rao (Vasthu Siddanthi)</h1>

          <div class="meta-bar">
            <span>30+ Years Empirical Experience</span> • 
            <span>10,000+ Happy Families</span> • 
            <span>Recipient of International Nepal Sadbhavana Award</span>
          </div>

          <article>
            <p>With more than three decades of rigorous research and practical application of Sthapatya Veda principles, <strong>Dr. Kunchala Hanumantha Rao</strong> is recognized across Andhra Pradesh, Telangana, Karnataka, and internationally as a preeminent Vasthu Siddanthi.</p>

            <h2>Scientific Vedic Philosophy & Non-Demolition Remedies</h2>
            <p>Unlike traditional approaches that mandate costly, destructive structural demolitions, Dr. Hanumantha Rao champions micro-degree directional alignment, energy balancing, five-element harmonization (Pancha Bhuta), and non-invasive remedies that transform spatial energy without breaking walls.</p>

            <h2>Core Areas of Expertise</h2>
            <ul>
              <li><strong>Residential Vastu:</strong> North-East (Eshanya) water balance, South-East (Agneya) kitchen alignment, South-West (Niruthi) master bedroom positioning, and open Brahmasthanam preservation.</li>
              <li><strong>Commercial & Industrial Vastu:</strong> Manufacturing unit layout, factory entrance positioning, machinery weight balancing, executive office alignments, and cash counter orientation for consistent business prosperity.</li>
              <li><strong>Apartments & Multi-Story Buildings:</strong> Common-wall defect neutralizations, lift and staircase location remedies, and flat entrance corrections.</li>
              <li><strong>Vastu Architectural CAD Drawings:</strong> 2D and 3D Vedic floor plans customized to millimeter accuracy before ground-breaking ceremonies.</li>
            </ul>

            <h2>Global Recognition & Headquarters</h2>
            <p>Dr. Rao was awarded the prestigious <em>International Nepal Sadbhavana Award</em> for outstanding contributions to Vedic architecture and universal harmony. Consultations are available both in-person at our Visakhapatnam headquarters and through digital blueprint audits worldwide.</p>

            <div style="background: #f5f5f4; border-radius: 8px; padding: 24px; margin-top: 32px;">
              <h3>Consultation Headquarters</h3>
              <p>Opposite Rama Lakshmi Apartments, Pedda Waltair, Visakhapatnam, Andhra Pradesh — 530017<br />
              Direct Contact: <a href="tel:+919246624248">+91 92466 24248</a> | Email: <a href="mailto:hrvasthu9@gmail.com">hrvasthu9@gmail.com</a></p>
              <p style="margin: 0;"><a href="${BASE_URL}/appointment" style="font-weight: 700;">Schedule a Consultation Now &rarr;</a></p>
            </div>
          </article>
        </main>
      `;

      return res.status(200).send(renderHtml({ title, description, canonicalUrl, jsonLd: aboutSchema }, bodyHtml));
    }

    // -------------------------------------------------------------
    // 5. ROUTE: Contact Page (/contact)
    // -------------------------------------------------------------
    if (path === '/contact') {
      const canonicalUrl = `${BASE_URL}/contact`;
      const title = 'Contact Best Vasthu Siddanthi in Vizag | Dr. Hanumantha Rao';
      const description = 'Contact Dr. Kunchala Hanumantha Rao for authentic Vedic Vastu consultations in Visakhapatnam, Hyderabad, Vijayawada, and worldwide. Phone: +91 92466 24248.';

      const contactSchema = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: 'HR Vasthu — Dr. Kunchala Hanumantha Rao',
        image: `${BASE_URL}/hero.webp`,
        telephone: '+919246624248',
        email: 'hrvasthu9@gmail.com',
        url: canonicalUrl,
        address: {
          '@type': 'PostalAddress',
          streetAddress: 'Opposite Rama Lakshmi Apartments, Pedda Waltair',
          addressLocality: 'Visakhapatnam',
          addressRegion: 'Andhra Pradesh',
          postalCode: '530017',
          addressCountry: 'IN'
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '17.7289',
          longitude: '83.3326'
        },
        openingHoursSpecification: {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
          opens: '09:00',
          closes: '20:00'
        }
      };

      const bodyHtml = `
        <main class="container">
          <div class="breadcrumbs">
            <a href="${BASE_URL}/">Home</a> &gt; <span>Contact</span>
          </div>

          <span class="badge">Official Consultation Headquarters</span>
          <h1>Contact Dr. Kunchala Hanumantha Rao (Vasthu Siddanthi)</h1>

          <div class="meta-bar">
            <span>Direct Phone: <a href="tel:+919246624248">+91 92466 24248</a></span> • 
            <span>Location: Visakhapatnam, Andhra Pradesh</span> • 
            <span>Open 7 Days (9:00 AM – 8:00 PM IST)</span>
          </div>

          <article>
            <p>Whether you are planning to build a new dream home, facing unexpected difficulties in an existing residence, or optimizing a commercial factory, direct consultations with Dr. Kunchala Hanumantha Rao are available via in-person visits and remote blueprint consultations.</p>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin: 32px 0;">
              <div class="faq-item">
                <h3 style="margin-top: 0;">📍 Head Office</h3>
                <p>Opposite Rama Lakshmi Apartments,<br />Pedda Waltair, Visakhapatnam,<br />Andhra Pradesh — 530017, India</p>
              </div>

              <div class="faq-item">
                <h3 style="margin-top: 0;">📞 Direct Phone & WhatsApp</h3>
                <p>Phone: <a href="tel:+919246624248">+91 92466 24248</a><br />
                WhatsApp: <a href="https://wa.me/919246624248">+91 92466 24248</a><br />
                Email: <a href="mailto:hrvasthu9@gmail.com">hrvasthu9@gmail.com</a></p>
              </div>

              <div class="faq-item">
                <h3 style="margin-top: 0;">⏰ Consultation Timings</h3>
                <p>Monday to Sunday: 9:00 AM – 8:00 PM IST<br />Prior appointment booking is highly recommended.</p>
              </div>
            </div>

            <h2>Available Consultation Services</h2>
            <ul>
              <li><strong>On-Site Property Inspection:</strong> In-person physical visit across Visakhapatnam, Hyderabad, Vijayawada, Guntur, Tirupati, and all major South Indian cities.</li>
              <li><strong>Remote Online Blueprint Audit:</strong> Send your CAD blueprint or hand-drawn plan via WhatsApp for a comprehensive 16-zone directional analysis.</li>
              <li><strong>House Plan Drawing Creation:</strong> Complete 2D architectural Vastu plans drafted to millimeter precision.</li>
            </ul>

            <p style="margin-top: 24px;">
              <a href="${BASE_URL}/appointment" style="font-size: 1.1rem; font-weight: 700;">Click Here to Book an Appointment &rarr;</a>
            </p>
          </article>
        </main>
      `;

      return res.status(200).send(renderHtml({ title, description, canonicalUrl, jsonLd: contactSchema }, bodyHtml));
    }

    // -------------------------------------------------------------
    // 6. ROUTE: Videos Archive (/videos)
    // -------------------------------------------------------------
    if (path === '/videos') {
      const canonicalUrl = `${BASE_URL}/videos`;
      const title = 'Vastu Video Masterclasses | Dr. Kunchala Hanumantha Rao | HR Vasthu';
      const description = 'Watch 490+ comprehensive Vedic Vastu video lessons, site audits, and house construction guides by Dr. Kunchala Hanumantha Rao.';

      const { data: topVideos } = await supabase
        .from('videos')
        .select('id, youtube_id, title, published_at')
        .order('views', { ascending: false })
        .limit(30);

      const listSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: title,
        description,
        url: canonicalUrl,
        numberOfItems: topVideos ? topVideos.length : 0,
        itemListElement: (topVideos || []).map((v: any, idx: number) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${BASE_URL}/videos/${v.youtube_id || v.id}`,
          name: v.title
        }))
      };

      const videoListHtml = (topVideos || []).map((v: any) => `
        <li style="margin-bottom: 16px;">
          <a href="${BASE_URL}/videos/${v.youtube_id || v.id}" style="font-weight: 600; font-size: 1.05rem;">${escapeHtml(v.title)}</a>
        </li>
      `).join('');

      const bodyHtml = `
        <main class="container">
          <div class="breadcrumbs"><a href="${BASE_URL}/">Home</a> &gt; <span>Videos</span></div>
          <span class="badge">Master Video Library</span>
          <h1>Vedic Vastu Video Lessons & Case Studies</h1>
          <p class="meta-bar">490+ Scientific Video Guides by Dr. Kunchala Hanumantha Rao</p>
          <ul style="list-style-type: none; padding: 0;">
            ${videoListHtml}
          </ul>
        </main>
      `;

      return res.status(200).send(renderHtml({ title, description, canonicalUrl, jsonLd: listSchema }, bodyHtml));
    }

    // -------------------------------------------------------------
    // 7. ROUTE: Blog Archive (/blog)
    // -------------------------------------------------------------
    if (path === '/blog') {
      const canonicalUrl = `${BASE_URL}/blog`;
      const title = 'Vedic Vastu Research Articles & Architecture Guides | HR Vasthu';
      const description = 'Explore 490+ comprehensive Vastu research articles, Vedic house planning guides, and non-demolition remedy solutions by Dr. Kunchala Hanumantha Rao.';

      const { data: topBlogs } = await supabase
        .from('blogs')
        .select('id, slug, title, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false })
        .limit(30);

      const listSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: title,
        description,
        url: canonicalUrl,
        numberOfItems: topBlogs ? topBlogs.length : 0,
        itemListElement: (topBlogs || []).map((b: any, idx: number) => ({
          '@type': 'ListItem',
          position: idx + 1,
          url: `${BASE_URL}/blog/${b.slug || b.id}`,
          name: b.title
        }))
      };

      const blogListHtml = (topBlogs || []).map((b: any) => `
        <li style="margin-bottom: 16px;">
          <a href="${BASE_URL}/blog/${b.slug || b.id}" style="font-weight: 600; font-size: 1.05rem;">${escapeHtml(b.title)}</a>
        </li>
      `).join('');

      const bodyHtml = `
        <main class="container">
          <div class="breadcrumbs"><a href="${BASE_URL}/">Home</a> &gt; <span>Blog</span></div>
          <span class="badge">Vedic Architecture Knowledge Base</span>
          <h1>Vastu Shastra Insights & Architectural Research</h1>
          <p class="meta-bar">490+ Published Research Articles by Dr. Kunchala Hanumantha Rao</p>
          <ul style="list-style-type: none; padding: 0;">
            ${blogListHtml}
          </ul>
        </main>
      `;

      return res.status(200).send(renderHtml({ title, description, canonicalUrl, jsonLd: listSchema }, bodyHtml));
    }

    // -------------------------------------------------------------
    // 8. ROUTE: Drawings Archive (/drawings)
    // -------------------------------------------------------------
    if (path === '/drawings') {
      const canonicalUrl = `${BASE_URL}/drawings`;
      const title = 'Vastu House Plan CAD Blueprints | 2D & 3D Drawings | HR Vasthu';
      const description = 'Browse authentic 2D and 3D Vastu house plans, duplex layouts, and apartment CAD drawings engineered according to Sthapatya Veda.';

      const { data: drawings } = await supabase
        .from('drawings')
        .select('id, slug, title, facing_direction, plot_dimensions')
        .order('created_at', { ascending: false })
        .limit(40);

      const drawingListHtml = (drawings || []).map((d: any) => `
        <li style="margin-bottom: 16px;">
          <a href="${BASE_URL}/drawings/${d.slug || d.id}" style="font-weight: 600; font-size: 1.05rem;">${escapeHtml(d.title)}</a>
          <span style="color: #78716c; font-size: 0.875rem;"> — Facing: ${escapeHtml(d.facing_direction || 'Vedic')}, Size: ${escapeHtml(d.plot_dimensions || 'Standard')}</span>
        </li>
      `).join('');

      const bodyHtml = `
        <main class="container">
          <div class="breadcrumbs"><a href="${BASE_URL}/">Home</a> &gt; <span>House Plans</span></div>
          <span class="badge">Sthapatya Veda Blueprint Catalog</span>
          <h1>100% Vedic Vastu CAD House Plans</h1>
          <p class="meta-bar">Engineered Floor Plans & Structural Blueprints</p>
          <ul style="list-style-type: none; padding: 0;">
            ${drawingListHtml}
          </ul>
        </main>
      `;

      return res.status(200).send(renderHtml({
        title,
        description,
        canonicalUrl,
        jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, url: canonicalUrl }
      }, bodyHtml));
    }

    // -------------------------------------------------------------
    // 9. ROUTE: Books Archive (/books)
    // -------------------------------------------------------------
    if (path === '/books' || path.startsWith('/books/')) {
      const canonicalUrl = `${BASE_URL}/books`;
      const title = 'Vastu Shastra Books Library | Dr. Kunchala Hanumantha Rao';
      const description = 'Official publications and Vedic Vastu literature written by Dr. Kunchala Hanumantha Rao on ancient Indian architecture and non-demolition remedies.';

      const bodyHtml = `
        <main class="container">
          <div class="breadcrumbs"><a href="${BASE_URL}/">Home</a> &gt; <span>Books</span></div>
          <span class="badge">Vedic Literature Library</span>
          <h1>Official Vastu Shastra Books</h1>
          <p class="meta-bar">By Dr. Kunchala Hanumantha Rao (Vasthu Siddanthi)</p>

          <article>
            <div class="faq-item">
              <h2>1. Sthapatya Veda Architecture & Modern Living</h2>
              <p>An authoritative guide translating classical Vedic texts (Manasara, Mayamata, Vishwakarma Prakash) into actionable architectural blueprints for contemporary homes and businesses.</p>
              <p><strong>Highlights:</strong> 16-zone directional analysis, non-demolition energy corrections, Brahmasthanam harmony.</p>
            </div>

            <div class="faq-item">
              <h2>2. Telugu Vastu Shastra Handbook (గృహ వాస్తు శాస్త్ర దర్శిని)</h2>
              <p>Practical Vastu guidance written in lucid Telugu detailing plot selection, foundation rituals, room orientations, and water placement remedies.</p>
            </div>

            <p style="margin-top: 24px;">
              <a href="${BASE_URL}/appointment" style="font-weight: 700;">Consult with Author Dr. Hanumantha Rao &rarr;</a>
            </p>
          </article>
        </main>
      `;

      return res.status(200).send(renderHtml({
        title,
        description,
        canonicalUrl,
        jsonLd: { '@context': 'https://schema.org', '@type': 'CollectionPage', name: title, url: canonicalUrl }
      }, bodyHtml));
    }

    // -------------------------------------------------------------
    // 10. ROUTE: Home Page (/) or default fallback
    // -------------------------------------------------------------
    const homeMeta: PageMeta = {
      title: 'Best Vasthu Siddanthi in Vizag & AP | Dr. Hanumantha Rao',
      description: 'Consult Dr. Kunchala Hanumantha Rao, leading Vasthu Siddanthi in Vizag & Andhra Pradesh. 30+ years experience, 100% Vedic house plans & non-demolition remedies.',
      canonicalUrl: `${BASE_URL}/`,
      keywords: 'Best Vasthu Siddanthi in Vizag, Best Vasthu Siddanthi in Visakhapatnam, Most Experienced Vasthu Siddanthi in Andhra Pradesh, Top Vastu Consultant AP, Best Vasthu Siddanthi in Hyderabad',
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Organization',
          name: 'HR Vasthu',
          url: `${BASE_URL}/`,
          logo: `${BASE_URL}/logo.png`,
          telephone: '+919246624248',
          address: {
            '@type': 'PostalAddress',
            streetAddress: 'Opposite Rama Lakshmi Apartments, Pedda Waltair',
            addressLocality: 'Visakhapatnam',
            addressRegion: 'Andhra Pradesh',
            postalCode: '530017',
            addressCountry: 'IN'
          }
        },
        {
          '@context': 'https://schema.org',
          '@type': 'WebSite',
          name: 'HR Vasthu',
          url: `${BASE_URL}/`,
          potentialAction: {
            '@type': 'SearchAction',
            target: `${BASE_URL}/videos?search={search_term_string}`,
            'query-input': 'required name=search_term_string'
          }
        },
        {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: [
            {
              '@type': 'Question',
              name: 'Who is the best Vasthu Siddanthi in Visakhapatnam and Andhra Pradesh?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Dr. Kunchala Hanumantha Rao is widely acclaimed as the premier Vasthu Siddanthi in Visakhapatnam and Andhra Pradesh, with over 30 years of empirical research, 10,000+ structural transformations, and the International Nepal Sadbhavana Award.'
              }
            },
            {
              '@type': 'Question',
              name: 'Can Vastu defects be corrected without structural demolition?',
              acceptedAnswer: {
                '@type': 'Answer',
                text: 'Yes. Dr. Kunchala Hanumantha Rao specializes in 100% authentic non-demolition remedies, utilizing elemental balancing, directional energy redirection, and classical Vedic alignment techniques.'
              }
            }
          ]
        }
      ]
    };

    const homeHtml = `
      <main class="container">
        <span class="badge">Vedic Architecture & Sthapatya Veda</span>
        <h1>HR Vasthu — Dr. Kunchala Hanumantha Rao (Vasthu Siddanthi)</h1>
        
        <div class="meta-bar">
          <span>Headquarters: Visakhapatnam, Andhra Pradesh</span> • 
          <span>Direct Phone: <a href="tel:+919246624248">+91 92466 24248</a></span> • 
          <span>30+ Years Experience</span>
        </div>

        <article>
          <p>Welcome to <strong>HR Vasthu</strong>, the official digital platform of <strong>Dr. Kunchala Hanumantha Rao</strong>, master of Vedic architecture and recipient of the International Nepal Sadbhavana Award. We provide 100% authentic Sthapatya Veda consultations, CAD blueprints, and non-demolition remedies for homes, luxury apartments, and commercial complexes across India and internationally.</p>

          <h2>Core Vedic Vastu Principles</h2>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin: 24px 0;">
            <div class="faq-item">
              <h3 style="margin-top: 0; color: #1e3a8a;">North-East (Eshanya)</h3>
              <p>Water and Ether element. Ideal for Pooja Mandir, underground water sump, and open light zones for spiritual clarity and peace.</p>
            </div>
            <div class="faq-item">
              <h3 style="margin-top: 0; color: #991b1b;">South-East (Agneya)</h3>
              <p>Fire (Agni) element. Ideal zone for the kitchen cooking stove, electrical setups, and heat sources to drive vitality.</p>
            </div>
            <div class="faq-item">
              <h3 style="margin-top: 0; color: #854d0e;">South-West (Niruthi)</h3>
              <p>Earth element. Prime location for Master Bedroom, heavy wardrobes, and structural stability ensuring family prosperity.</p>
            </div>
            <div class="faq-item">
              <h3 style="margin-top: 0; color: #065f46;">North-West (Vayavya)</h3>
              <p>Air (Vayu) element. Optimal for guest bedrooms, finished goods storage, vehicle parking, and proper drainage.</p>
            </div>
          </div>

          <h2>Explore Our Platform</h2>
          <ul>
            <li><a href="${BASE_URL}/drawings"><strong>Vastu CAD House Plans:</strong></a> 38+ downloadable 2D & 3D blueprints tailored to millimeter Vedic accuracy.</li>
            <li><a href="${BASE_URL}/videos"><strong>Video Masterclasses:</strong></a> 490+ in-depth video analyses explaining house directions, remedies, and room designs.</li>
            <li><a href="${BASE_URL}/blog"><strong>Research Articles:</strong></a> 490+ comprehensive guides on Vedic architecture principles.</li>
            <li><a href="${BASE_URL}/appointment"><strong>Consultation Booking:</strong></a> Schedule in-person or remote video consultations with Dr. Hanumantha Rao.</li>
          </ul>

          <h2>Frequently Asked Questions</h2>
          <div class="faq-item">
            <div class="faq-q">Who is the best Vasthu Siddanthi in Visakhapatnam & Andhra Pradesh?</div>
            <p class="faq-a">Dr. Kunchala Hanumantha Rao is widely acclaimed as the leading Vasthu Siddanthi in Visakhapatnam and Andhra Pradesh, with over 30+ years of empirical field experience, thousands of consultations, and international recognition.</p>
          </div>

          <div class="faq-item">
            <div class="faq-q">Can Vastu defects be corrected without demolition?</div>
            <p class="faq-a">Yes. Dr. Hanumantha Rao specializes in non-demolition remedies using elemental realignment, directional adjustments, and Vedic corrections that restore positive flow without dismantling walls.</p>
          </div>
        </article>
      </main>
    `;

    return res.status(200).send(renderHtml(homeMeta, homeHtml));

  } catch (err: any) {
    console.error('Prerender error:', err);
    res.status(500);
    return res.send(renderHtml({
      title: 'HR Vasthu — Vedic Architecture',
      description: 'Consult Dr. Kunchala Hanumantha Rao, leading Vasthu Siddanthi.',
      canonicalUrl: BASE_URL,
      jsonLd: { '@context': 'https://schema.org', '@type': 'WebSite', name: 'HR Vasthu', url: BASE_URL }
    }, `
      <main class="container">
        <h1>HR Vasthu</h1>
        <p>Consult Dr. Kunchala Hanumantha Rao for authentic Vedic Vastu consultations.</p>
        <p><a href="${BASE_URL}/">Visit Homepage &rarr;</a></p>
      </main>
    `));
  }
}

function serveBlogPost(res: any, blog: any) {
  let parsed: any = {};
  try {
    parsed = typeof blog.content === 'string' ? JSON.parse(blog.content) : (blog.content || {});
  } catch {
    parsed = { body_markdown: String(blog.content || '') };
  }

  const canonicalUrl = `${BASE_URL}/blog/${blog.slug || blog.id}`;
  const excerpt = parsed.excerpt || (blog.content && typeof blog.content === 'string' ? blog.content.slice(0, 160) : 'Comprehensive Vedic Vastu guidance by Dr. Kunchala Hanumantha Rao.');
  const metaDesc = excerpt.replace(/\s+/g, ' ').slice(0, 160);
  const coverImage = blog.cover_image || `${BASE_URL}/hero.webp`;
  const sections = parsed.sections || (parsed.cards ? parsed.cards.map((c: any, i: number) => ({ title: c.subtitle || `Section ${i+1}`, content_markdown: c.text })) : []);
  const faqs = parsed.faqs || [];

  const blogSchema: any = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl
    },
    headline: blog.title,
    description: metaDesc,
    image: [coverImage],
    datePublished: blog.created_at || new Date().toISOString(),
    dateModified: blog.updated_at || blog.created_at || new Date().toISOString(),
    author: {
      '@type': 'Person',
      name: 'Dr. Kunchala Hanumantha Rao',
      jobTitle: 'Vasthu Siddanthi & Vedic Architecture Researcher',
      url: `${BASE_URL}/about`
    },
    publisher: {
      '@type': 'Organization',
      name: 'HR Vasthu',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/logo.png`
      }
    }
  };

  if (faqs && faqs.length > 0) {
    blogSchema.hasPart = {
      '@type': 'FAQPage',
      mainEntity: faqs.map((f: any) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: f.answer
        }
      }))
    };
  }

  const sectionsHtml = sections.map((s: any, idx: number) => `
    <section style="margin-bottom: 32px;">
      <h2>${idx + 1}. ${escapeHtml(s.title || `Vedic Guideline ${idx + 1}`)}</h2>
      ${s.image_url ? `<div style="text-align: center; margin: 16px 0;"><img src="${s.image_url}" alt="${escapeHtml(s.title)}" style="max-width: 100%; border-radius: 8px;" /></div>` : ''}
      <div>${markdownToSimpleHtml(s.content_markdown || s.contentMarkdown || '')}</div>
    </section>
  `).join('');

  const faqsHtml = faqs && faqs.length > 0 ? `
    <div style="margin-top: 48px; border-top: 2px solid #e7e5e4; padding-top: 32px;">
      <h2>Frequently Asked Questions</h2>
      ${faqs.map((f: any) => `
        <div class="faq-item">
          <div class="faq-q">${escapeHtml(f.question)}</div>
          <p class="faq-a">${escapeHtml(f.answer)}</p>
        </div>
      `).join('')}
    </div>
  ` : '';

  const bodyHtml = `
    <main class="container">
      <div class="breadcrumbs">
        <a href="${BASE_URL}/">Home</a> &gt; <a href="${BASE_URL}/blog">Articles</a> &gt; <span>${escapeHtml(blog.title)}</span>
      </div>

      <span class="badge">Sthapatya Veda Research</span>
      <h1>${escapeHtml(blog.title)}</h1>

      <div class="meta-bar">
        <span>Author: <strong>Dr. Kunchala Hanumantha Rao</strong> (Vasthu Siddanthi)</span> • 
        <span>Published: ${new Date(blog.created_at || Date.now()).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span> • 
        <span>${parsed.reading_time_minutes || 10} Min Read • Non-Demolition Remedies</span>
      </div>

      ${blog.cover_image ? `
        <div style="text-align: center; margin: 24px 0;">
          <img src="${blog.cover_image}" alt="${escapeHtml(blog.title)}" style="max-width: 100%; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);" />
        </div>
      ` : ''}

      <article style="max-width: 850px; margin: 0 auto;">
        ${parsed.body_markdown ? `<div>${markdownToSimpleHtml(parsed.body_markdown)}</div>` : ''}
        ${sectionsHtml}
        ${faqsHtml}

        <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 8px; padding: 24px; margin-top: 40px;">
          <h3 style="margin-top: 0; color: #92400e;">Consult Dr. Kunchala Hanumantha Rao</h3>
          <p style="color: #78350f;">Get professional Vedic architectural guidance without structural demolition for your house, flat, or commercial plot.</p>
          <p style="margin: 0;">
            <a href="${BASE_URL}/appointment" style="font-weight: 700; color: #b45309; text-decoration: underline;">Schedule In-Person or Online Consultation &rarr;</a>
          </p>
        </div>
      </article>
    </main>
  `;

  return res.status(200).send(renderHtml({
    title: `${blog.title} — Sthapatya Veda Architecture Guide`,
    description: metaDesc,
    canonicalUrl,
    ogImage: coverImage,
    ogType: 'article',
    keywords: blog.keywords || '',
    jsonLd: blogSchema
  }, bodyHtml));
}
