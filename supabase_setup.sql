-- ==============================================================================
-- THE URBANO - COMPLETE SUPABASE SETUP SCRIPT (FRESH / UPDATED)
-- Separated Categories: Residential, Pantry Section, Modular Kitchen, Gym, Unisex Salon
-- Run this in your Supabase SQL Editor if you want to initialize or reset tables.
-- ==============================================================================

-- 1. Drop existing tables if they exist to start fresh
DROP TABLE IF EXISTS public.gallery CASCADE;
DROP TABLE IF EXISTS public.category_images CASCADE;
DROP TABLE IF EXISTS public.reviews CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;

-- 2. Create categories table
CREATE TABLE public.categories (
    id BIGSERIAL PRIMARY KEY,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    cover_image TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create category_images table (for category specific detail galleries)
CREATE TABLE public.category_images (
    id BIGSERIAL PRIMARY KEY,
    category_slug TEXT REFERENCES public.categories(slug) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    title TEXT,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create site_settings table (for dynamic hero, materials, footer settings)
CREATE TABLE public.site_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create reviews table
CREATE TABLE public.reviews (
    id BIGSERIAL PRIMARY KEY,
    quote TEXT NOT NULL,
    author TEXT NOT NULL,
    location TEXT,
    loc TEXT,
    initial TEXT,
    rating INTEGER DEFAULT 5,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Create gallery table (for home page masterpieces gallery)
CREATE TABLE public.gallery (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    category_label TEXT NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    aspect TEXT DEFAULT 'aspect-[4/3]',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. Enable Row Level Security (RLS)
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.category_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS Policies for public reading
CREATE POLICY "Allow public select on categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Allow public select on category_images" ON public.category_images FOR SELECT USING (true);
CREATE POLICY "Allow public select on site_settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public select on reviews" ON public.reviews FOR SELECT USING (true);
CREATE POLICY "Allow public select on gallery" ON public.gallery FOR SELECT USING (true);

-- 9. Create RLS Policies for full write access (admin and public testing)
CREATE POLICY "Allow all on categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on category_images" ON public.category_images FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on site_settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all on gallery" ON public.gallery FOR ALL USING (true) WITH CHECK (true);

-- 10. Insert seed data for categories (Gym & Unisex Salon separated)
INSERT INTO public.categories (slug, title, description, cover_image, is_featured)
VALUES 
('residential', 'Residential', 'End-to-end luxury living rooms, master bedroom suites, and tranquil sanctuaries designed to elevate daily living.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop', true),
('pantry-section', 'Pantry Section', 'Bespoke butler''s pantries, artisanal spice vaults, and wine lounges with custom temperature-controlled cabinetry.', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop', true),
('modular-kitchen', 'Modular Kitchen', 'Sleek handleless drawers, monolithic quartz islands, and integrated smart appliances for gourmet culinary experiences.', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop', true),
('gym', 'Gym', 'State-of-the-art private home fitness studios and wellness spaces featuring acoustic wood slats and ambient lighting.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop', true),
('unisex-salon', 'Unisex Salon', 'Luxury unisex salon suites and grooming lounges featuring illuminated vanity arches and bespoke stations.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop', true);

-- 11. Insert seed data for site_settings
INSERT INTO public.site_settings (key, value)
VALUES 
('hero_bg_image', 'https://images.unsplash.com/photo-1464938050520-ef2270bb8ce8?w=1800&q=90&auto=format&fit=crop'),
('hero_overlay_image', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1800&q=90&auto=format&fit=crop'),
('materials_img_1', 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=900&q=85&auto=format&fit=crop'),
('materials_img_2', 'https://images.unsplash.com/photo-1631679706909-1844bbd07221?w=600&q=85&auto=format&fit=crop'),
('materials_img_3', 'https://images.unsplash.com/photo-1615529151169-7b1ff50dc7f2?w=600&q=85&auto=format&fit=crop'),
('materials_img_4', 'https://images.unsplash.com/photo-1513161455079-7dc1de15ef3e?w=600&q=85&auto=format&fit=crop'),
('materials_img_5', 'https://images.unsplash.com/photo-1532372576444-dda954194ad0?w=600&q=85&auto=format&fit=crop'),
('footer_address', 'The Urbano, 4th Floor, Premium Block, Sector V, Salt Lake, Kolkata, WB 700091'),
('footer_phone', '+91 9583529847 / +91 9123787492'),
('footer_email', 'theurbano.interior@gmail.com');

-- 12. Insert seed data for reviews
INSERT INTO public.reviews (quote, author, location, loc, initial, rating)
VALUES 
('The Urbano transformed our penthouse into a luxurious haven. Their attention to detail, material selection, and execution were absolutely flawless.', 'Aarav Mehta', 'Alipore, Kolkata', 'Alipore, Kolkata', 'A', 5),
('Exceptional design sensibility. They turned our modular kitchen and living room into a functional work of art. Highly recommended for turnkey luxury interiors.', 'Priya Sen', 'Salt Lake, Kolkata', 'Salt Lake, Kolkata', 'P', 5),
('From first render to final delivery, the team was professional, creative, and extremely precise. The material palette selection is truly world-class.', 'Rajesh Singhania', 'Ballygunge, Kolkata', 'Ballygunge, Kolkata', 'R', 5);

-- 13. Insert seed data for gallery (Gym and Unisex Salon separated)
INSERT INTO public.gallery (title, category, category_label, description, image_url, aspect)
VALUES 
('Neoclassical Living Suite', 'residential', 'Residential', 'A spacious lounge balancing rich wood accents, warm ambient lighting, and luxurious velvet seating.', 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80&auto=format&fit=crop', 'aspect-[4/3]'),
('Minimalist Japandi Sanctuary', 'residential', 'Residential', 'A low-profile bed accented by custom fluted wood panels and serene, earthy lighting.', 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&q=80&auto=format&fit=crop', 'aspect-[3/4]'),
('Bespoke Butler''s Pantry', 'pantry', 'Pantry Section', 'Custom dark oak cabinets, integrated strip lighting, and a concealed espresso bar station.', 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&q=80&auto=format&fit=crop', 'aspect-[4/3]'),
('Urban Emerald Culinary Hub', 'kitchen', 'Modular Kitchen', 'Deep forest green slab cabinets paired with custom brass fixtures and a monolithic quartz waterfall island.', 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80&auto=format&fit=crop', 'aspect-[4/3]'),
('Private Luxury Fitness Studio', 'gym', 'Gym', 'State-of-the-art fitness space with acoustic wood slatting, mirror walls, and ambient LED lights.', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&q=80&auto=format&fit=crop', 'aspect-[4/5]'),
('High-End Unisex Styling Salon', 'salon', 'Unisex Salon', 'Custom vanity stations with illuminated arch mirrors, gold metallic accents, and plush hydraulic chairs.', 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80&auto=format&fit=crop', 'aspect-[3/4]');
