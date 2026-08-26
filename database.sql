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


-- 7. DRAWINGS TABLE (HR VASTHU DRAWINGS, 3D ELEVATIONS & BLUEPRINTS)
CREATE TABLE IF NOT EXISTS public.drawings (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  image_url text NOT NULL, -- 2D Vastu drawing blueprint / floor plan
  constructed_image_url text, -- AI Generated 3D Constructed building exterior view
  pdf_url text, -- Downloadable high-resolution CAD drawing PDF
  price numeric DEFAULT 99, -- 99/100 INR standard unlocking price
  facing text DEFAULT 'East',
  category text DEFAULT 'Residential Plans',
  dimensions text DEFAULT '30x40 ft (1200 sq.ft)',
  floors text DEFAULT 'Ground Floor',
  bedrooms text DEFAULT '2 BHK',
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Ensure newly added columns exist if table was already created
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drawings' AND column_name='constructed_image_url') THEN
    ALTER TABLE public.drawings ADD COLUMN constructed_image_url text;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='drawings' AND column_name='pdf_url') THEN
    ALTER TABLE public.drawings ADD COLUMN pdf_url text;
  END IF;
END $$;

ALTER TABLE public.drawings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to drawings" ON public.drawings;
CREATE POLICY "Allow public read access to drawings"
ON public.drawings FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to insert drawings" ON public.drawings;
CREATE POLICY "Allow authenticated users to insert drawings"
ON public.drawings FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Allow authenticated users to update drawings" ON public.drawings;
CREATE POLICY "Allow authenticated users to update drawings"
ON public.drawings FOR UPDATE TO authenticated USING (true);

DROP POLICY IF EXISTS "Allow authenticated users to delete drawings" ON public.drawings;
CREATE POLICY "Allow authenticated users to delete drawings"
ON public.drawings FOR DELETE TO authenticated USING (true);

-- Fallback policies for public demo/admin operations if needed
DROP POLICY IF EXISTS "Allow public inserts to drawings" ON public.drawings;
CREATE POLICY "Allow public inserts to drawings"
ON public.drawings FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public updates to drawings" ON public.drawings;
CREATE POLICY "Allow public updates to drawings"
ON public.drawings FOR UPDATE TO public USING (true);

DROP POLICY IF EXISTS "Allow public deletes to drawings" ON public.drawings;
CREATE POLICY "Allow public deletes to drawings"
ON public.drawings FOR DELETE TO public USING (true);


-- 8. DRAWING ORDERS & CASHFREE PAYMENTS TABLE
CREATE TABLE IF NOT EXISTS public.drawing_orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  drawing_id uuid REFERENCES public.drawings(id) ON DELETE SET NULL,
  order_id text UNIQUE NOT NULL,
  payment_session_id text,
  cf_order_id text,
  customer_name text NOT NULL,
  customer_phone text NOT NULL,
  customer_email text,
  amount numeric DEFAULT 99 NOT NULL,
  currency text DEFAULT 'INR',
  payment_status text DEFAULT 'PENDING', -- 'PENDING', 'SUCCESS', 'PAID', 'FAILED'
  payment_method text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.drawing_orders ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public read access to drawing_orders" ON public.drawing_orders;
CREATE POLICY "Allow public read access to drawing_orders"
ON public.drawing_orders FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Allow public inserts to drawing_orders" ON public.drawing_orders;
CREATE POLICY "Allow public inserts to drawing_orders"
ON public.drawing_orders FOR INSERT TO public WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public update access to drawing_orders" ON public.drawing_orders;
CREATE POLICY "Allow public update access to drawing_orders"
ON public.drawing_orders FOR UPDATE TO public USING (true);


-- 9. PERFORMANCE & SEARCH SPEED INDEXES
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_is_featured ON public.videos(is_featured);
CREATE INDEX IF NOT EXISTS idx_videos_is_short ON public.videos(is_short);
CREATE INDEX IF NOT EXISTS idx_blogs_slug ON public.blogs(slug);
CREATE INDEX IF NOT EXISTS idx_blogs_published ON public.blogs(is_published, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_analytics_created ON public.analytics_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_created ON public.bookings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drawings_created ON public.drawings(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_drawings_facing ON public.drawings(facing);
CREATE INDEX IF NOT EXISTS idx_drawings_category ON public.drawings(category);
CREATE INDEX IF NOT EXISTS idx_drawing_orders_order_id ON public.drawing_orders(order_id);
CREATE INDEX IF NOT EXISTS idx_drawing_orders_created ON public.drawing_orders(created_at DESC);


