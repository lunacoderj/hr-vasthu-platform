-- Run this in your Supabase SQL Editor

CREATE TABLE videos (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  youtube_id text UNIQUE NOT NULL,
  title text NOT NULL,
  description text,
  embed_url text NOT NULL,
  watch_url text NOT NULL,
  thumbnail_default text,
  thumbnail_medium text,
  thumbnail_high text,
  thumbnail_max text,
  published_at timestamptz NOT NULL,
  duration text,
  views bigint DEFAULT 0,
  likes bigint DEFAULT 0,
  comments bigint DEFAULT 0,
  tags jsonb DEFAULT '[]'::jsonb,
  hashtags jsonb DEFAULT '[]'::jsonb,
  category text,
  is_short boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Optional: Enable Row Level Security (RLS)
ALTER TABLE videos ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access to videos"
ON videos
FOR SELECT
TO public
USING (true);

-- Phase 9.2: Add featured flag
ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Phase X: Add is_short flag for Shorts section
ALTER TABLE videos ADD COLUMN IF NOT EXISTS is_short BOOLEAN DEFAULT false;

-- Note: Inserts/Updates will be done securely via the backend script using the Service Role Key.

-- Phase 10.1: Allow authenticated admins to update videos
CREATE POLICY "Allow authenticated users to update videos"
ON videos
FOR UPDATE
TO authenticated
USING (true);

-- Phase 10.1: Create Books table
CREATE TABLE books (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  cover_image text,
  pdf_url text NOT NULL,
  language text DEFAULT 'en',
  pages integer,
  category text,
  is_free boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on books
ALTER TABLE books ENABLE ROW LEVEL SECURITY;

-- Allow public read access to books
CREATE POLICY "Allow public read access to books"
ON books
FOR SELECT
TO public
USING (true);

-- Allow authenticated admins to manage books
CREATE POLICY "Allow authenticated users to insert books"
ON books
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update books"
ON books
FOR UPDATE
TO authenticated
USING (true);

CREATE POLICY "Allow authenticated users to delete books"
ON books
FOR DELETE
TO authenticated
USING (true);

-- Phase 16: Create Blogs table
CREATE TABLE blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  cover_image text,
  author text DEFAULT 'Dr. Kunchala Hanumantha Rao',
  is_published boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on blogs
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;

-- Allow public read access to published blogs
CREATE POLICY "Allow public read access to published blogs"
ON blogs
FOR SELECT
TO public
USING (is_published = true);

-- Allow authenticated admins to manage blogs
CREATE POLICY "Allow authenticated users to manage blogs"
ON blogs
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Phase 18: Create Video Analytics table
CREATE TABLE video_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id uuid REFERENCES videos(id) ON DELETE CASCADE,
  event_type text NOT NULL, -- 'play', 'pause', 'complete'
  watch_time_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS on video_events
ALTER TABLE video_events ENABLE ROW LEVEL SECURITY;

-- Allow public to insert events anonymously
CREATE POLICY "Allow public to insert video events"
ON video_events
FOR INSERT
TO public
WITH CHECK (true);

-- Only admins can read events
CREATE POLICY "Allow authenticated users to read video events"
ON video_events
FOR SELECT
TO authenticated
USING (true);
