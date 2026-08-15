-- ==============================================================================
-- HR VASTHU - PRODUCTION DATABASE SCHEMA, RLS POLICIES & INDEXES
-- Safe & Idempotent: Will NOT delete or erase your existing data!
-- ==============================================================================

-- 1. VIDEOS TABLE
CREATE TABLE IF NOT EXISTS public.videos (
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
  category text DEFAULT 'General',
  is_short boolean DEFAULT false,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to videos" ON public.videos;
CREATE POLICY "Allow public read access to videos"
ON public.videos FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to update videos" ON public.videos;
CREATE POLICY "Allow authenticated users to update videos"
ON public.videos FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert videos" ON public.videos;
CREATE POLICY "Allow authenticated users to insert videos"
ON public.videos FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete videos" ON public.videos;
CREATE POLICY "Allow authenticated users to delete videos"
ON public.videos FOR DELETE TO authenticated USING (true);


-- 2. BOOKS TABLE
CREATE TABLE IF NOT EXISTS public.books (
  id text PRIMARY KEY,
  title text NOT NULL,
  description text,
  cover_image text,
  pdf_url text NOT NULL,
  language text DEFAULT 'en',
  pages integer,
  category text DEFAULT 'Vasthu',
  is_free boolean DEFAULT true,
  price numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.books ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to books" ON public.books;
CREATE POLICY "Allow public read access to books"
ON public.books FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert books" ON public.books;
CREATE POLICY "Allow authenticated users to insert books"
ON public.books FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update books" ON public.books;
CREATE POLICY "Allow authenticated users to update books"
ON public.books FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete books" ON public.books;
CREATE POLICY "Allow authenticated users to delete books"
ON public.books FOR DELETE TO authenticated USING (true);


-- 3. BLOGS TABLE
CREATE TABLE IF NOT EXISTS public.blogs (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  content text NOT NULL,
  cover_image text,
  author text DEFAULT 'Dr. Kunchala Hanumantha Rao',
  is_published boolean DEFAULT false,
  keywords text DEFAULT 'vasthu, architecture, directions',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to published blogs" ON public.blogs;
CREATE POLICY "Allow public read access to published blogs"
ON public.blogs FOR SELECT TO public
USING (is_published = true AND created_at <= now());

DROP POLICY IF EXISTS "Allow authenticated users to manage blogs" ON public.blogs;
CREATE POLICY "Allow authenticated users to manage blogs"
ON public.blogs FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- 4. ANALYTICS EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  event_name text NOT NULL,
  path text,
  duration_seconds numeric,
  scroll_percentage numeric,
  device_type text,
  os text,
  browser text,
  city text,
  country text,
  payload jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts to analytics_events" ON public.analytics_events;
CREATE POLICY "Allow public inserts to analytics_events"
ON public.analytics_events FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read analytics_events" ON public.analytics_events;
DROP POLICY IF EXISTS "Allow public read access to analytics_events" ON public.analytics_events;
CREATE POLICY "Allow public read access to analytics_events"
ON public.analytics_events FOR SELECT TO public USING (true);


-- 5. BOOKINGS / CONSULTATIONS TABLE
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  phone text NOT NULL,
  email text,
  consultation_type text DEFAULT 'residential',
  message text,
  status text DEFAULT 'pending',
  source text DEFAULT 'website',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public inserts to bookings" ON public.bookings;
CREATE POLICY "Allow public inserts to bookings"
ON public.bookings FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to manage bookings" ON public.bookings;
DROP POLICY IF EXISTS "Allow public read access to bookings" ON public.bookings;
CREATE POLICY "Allow public read access to bookings"
ON public.bookings FOR SELECT TO public USING (true);


-- 6. VIDEO EVENTS TABLE
CREATE TABLE IF NOT EXISTS public.video_events (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  video_id uuid REFERENCES public.videos(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  watch_time_seconds integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.video_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public to insert video events" ON public.video_events;
CREATE POLICY "Allow public to insert video events"
ON public.video_events FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to read video events" ON public.video_events;
DROP POLICY IF EXISTS "Allow public read access to video events" ON public.video_events;
CREATE POLICY "Allow public read access to video events"
ON public.video_events FOR SELECT TO public USING (true);


-- 7. PERFORMANCE & SEARCH SPEED INDEXES
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_is_featured ON public.videos(is_featured);
CREATE INDEX IF NOT EXISTS idx_videos_is_short ON public.videos(is_short);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON public.bookings(created_at DESC);
