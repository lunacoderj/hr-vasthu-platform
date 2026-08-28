import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://yqlhcyraiccrrhjfxqky.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

function generateSeoBlogSlug(title: string, videoId: string): string {
  const clean = (title || '')
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .slice(0, 50)
    .replace(/^-+|-+$/g, '');
  return `${clean || 'vastu-architecture-guide'}-${videoId}-blog`;
}

async function updateSlugs() {
  console.log('🏛️ Updating all 491 blog slugs in Supabase to SEO format (*-blog)...');

  const { data: blogs, error } = await supabase
    .from('blogs')
    .select('id, title, content');

  if (error || !blogs) {
    console.error('Error fetching blogs:', error);
    return;
  }

  console.log(`Found ${blogs.length} blogs in Supabase.`);

  let updated = 0;
  for (const b of blogs) {
    let videoId = b.id.slice(0, 8);
    try {
      const parsed = JSON.parse(b.content);
      if (parsed.youtube_id) videoId = parsed.youtube_id;
    } catch {}

    const newSlug = generateSeoBlogSlug(b.title, videoId);
    const { error: upErr } = await supabase
      .from('blogs')
      .update({ slug: newSlug })
      .eq('id', b.id);

    if (upErr) {
      console.error(`Error updating blog ${b.id}:`, upErr.message);
    } else {
      updated++;
    }
  }

  console.log(`✅ Successfully updated ${updated} blog slugs to ending with '-blog'!`);
}

updateSlugs().catch(console.error);
