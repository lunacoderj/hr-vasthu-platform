import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load env vars
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing Supabase credentials in .env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const BASE_URL = 'https://hrvasthu.com';

async function generateSitemap() {
  console.log('Generating sitemap...');
  
  const urls = [
    { loc: `${BASE_URL}/`, priority: 1.0, changefreq: 'daily' },
    { loc: `${BASE_URL}/about`, priority: 0.8, changefreq: 'monthly' },
    { loc: `${BASE_URL}/videos`, priority: 0.9, changefreq: 'daily' },
    { loc: `${BASE_URL}/shorts`, priority: 0.9, changefreq: 'daily' },
    { loc: `${BASE_URL}/books`, priority: 0.8, changefreq: 'weekly' },
    { loc: `${BASE_URL}/blog`, priority: 0.9, changefreq: 'daily' },
    { loc: `${BASE_URL}/contact`, priority: 0.7, changefreq: 'monthly' },
  ];

  try {
    // Fetch Videos
    const { data: videos } = await supabase.from('videos').select('id, published_at').order('published_at', { ascending: false });
    if (videos) {
      videos.forEach(v => {
        urls.push({
          loc: `${BASE_URL}/videos/${v.id}`,
          priority: 0.8,
          changefreq: 'weekly'
        });
      });
    }

    // Fetch Blogs
    const { data: blogs } = await supabase.from('blogs').select('slug, created_at').eq('is_published', true).order('created_at', { ascending: false });
    if (blogs) {
      blogs.forEach(b => {
        urls.push({
          loc: `${BASE_URL}/blog/${b.slug}`,
          priority: 0.8,
          changefreq: 'weekly'
        });
      });
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(url => `
  <url>
    <loc>${url.loc}</loc>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`).join('')}
</urlset>`;

    const publicDir = path.resolve(process.cwd(), 'public');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir);
    }

    fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemap);
    console.log('Sitemap successfully generated at public/sitemap.xml');
    
  } catch (err) {
    console.error('Error generating sitemap:', err);
  }
}

generateSitemap();
