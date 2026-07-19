export interface Video {
  id: string;
  youtube_id?: string;
  title: string;
  description: string;
  embed_url?: string;
  watch_url?: string;
  url?: string; // YouTube or Supabase Storage URL
  thumbnail?: string;
  thumbnail_medium?: string;
  thumbnail_default?: string;
  duration: string; // e.g., '10:30'
  category: string; // e.g., 'Residential', 'Commercial', 'Astrology'
  language: string; // 'en', 'hi', 'te', etc.
  views?: number;
  likes?: number;
  comments?: number;
  tags?: string[];
  hashtags?: string[];
  is_short?: boolean;
  published_at?: string;
  created_at: string;
}

export interface VideoFilterOptions {
  category?: string;
  language?: string;
  searchQuery?: string;
}
