import { supabase } from "./supabase";

export interface CategoryItem {
  id?: string;
  slug: string;
  title: string;
  description: string;
  cover_image: string;
  is_featured?: boolean;
}

export interface CategoryPhoto {
  id?: string;
  category_slug: string;
  image_url: string;
  title?: string;
  description?: string;
}

// Default rich categories fallback
export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    slug: "residential",
    title: "Residential",
    description: "End-to-end luxury living rooms, master bedroom suites, and tranquil sanctuaries designed to elevate daily living.",
    cover_image: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    is_featured: true,
  },
  {
    slug: "pantry-section",
    title: "Pantry Section",
    description: "Bespoke butler's pantries, artisanal spice vaults, and wine lounges with custom temperature-controlled cabinetry.",
    cover_image: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop",
    is_featured: true,
  },
  {
    slug: "modular-kitchen",
    title: "Modular Kitchen",
    description: "Sleek handleless drawers, monolithic quartz islands, and integrated smart appliances for gourmet culinary experiences.",
    cover_image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
    is_featured: true,
  },
  {
    slug: "gym",
    title: "Gym",
    description: "State-of-the-art private home fitness studios and wellness spaces featuring acoustic wood slats and ambient lighting.",
    cover_image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    is_featured: true,
  },
  {
    slug: "unisex-salon",
    title: "Unisex Salon",
    description: "Luxury unisex salon suites and grooming lounges featuring illuminated vanity arches and bespoke stations.",
    cover_image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop",
    is_featured: true,
  },
];

// Default photos for category gallery fallbacks
export const DEFAULT_CATEGORY_PHOTOS: Record<string, CategoryPhoto[]> = {
  residential: [
    {
      category_slug: "residential",
      title: "Neoclassical Living Suite",
      description: "Rich wood accents, warm ambient lighting, and velvet seating.",
      image_url: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1200&auto=format&fit=crop",
    },
    {
      category_slug: "residential",
      title: "Minimalist Japandi Bedroom",
      description: "Low-profile bed with custom fluted wood panels.",
      image_url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?q=80&w=1200&auto=format&fit=crop",
    },
    {
      category_slug: "residential",
      title: "Sun-Drenched Velvet Lounge",
      description: "Double-height windows illuminating curated brass ornaments.",
      image_url: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200&auto=format&fit=crop",
    },
    {
      category_slug: "residential",
      title: "Bohemian Master Retreat",
      description: "Warm oak finishes, linen curtains, and layered cozy textures.",
      image_url: "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=1200&auto=format&fit=crop",
    },
    {
      category_slug: "residential",
      title: "Contemporary Art-Deco Salon",
      description: "Curved velvet sofas surrounding an asymmetric copper fireplace.",
      image_url: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  "pantry-section": [
    {
      category_slug: "pantry-section",
      title: "Bespoke Butler's Pantry",
      description: "Custom oak cabinetry with concealed storage and marble splashback.",
      image_url: "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1200&auto=format&fit=crop",
    },
    {
      category_slug: "pantry-section",
      title: "Travertine Coffee & Pantry Vault",
      description: "Soft directional lighting accentuating raw travertine counters.",
      image_url: "https://images.unsplash.com/photo-1617806118233-18e1db207f62?q=80&w=1200&auto=format&fit=crop",
    },
    {
      category_slug: "pantry-section",
      title: "Artisanal Spice & Storage Pantry",
      description: "Glass-front cabinetry with brass inlays and culinary storage.",
      image_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  "modular-kitchen": [
    {
      category_slug: "modular-kitchen",
      title: "Urban Emerald Culinary Hub",
      description: "Deep forest green cabinetry paired with gold handles.",
      image_url: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=1200&auto=format&fit=crop",
    },
    {
      category_slug: "modular-kitchen",
      title: "Matte Charcoal & Oak Kitchen",
      description: "Sleek handleless drawers and integrated smart appliances.",
      image_url: "https://images.unsplash.com/photo-1556909212-d5b604d7c99d?q=80&w=1200&auto=format&fit=crop",
    },
    {
      category_slug: "modular-kitchen",
      title: "Monolithic Quartz Island Suite",
      description: "Massive statement island piece serving as the center hub.",
      image_url: "https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  gym: [
    {
      category_slug: "gym",
      title: "Private Luxury Fitness Studio",
      description: "Acoustic wood slatting, mirror walls, and ambient LED lights.",
      image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    },
    {
      category_slug: "gym",
      title: "High-Performance Athletic Studio",
      description: "Custom rubberized flooring, integrated cardio stations, and cove lighting.",
      image_url: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  "unisex-salon": [
    {
      category_slug: "unisex-salon",
      title: "High-End Unisex Styling Salon",
      description: "Custom vanity stations with illuminated arch mirrors.",
      image_url: "https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=1200&auto=format&fit=crop",
    },
    {
      category_slug: "unisex-salon",
      title: "Bespoke Grooming & Wellness Lounge",
      description: "Marble wash stations and fluted glass partitions.",
      image_url: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?q=80&w=1200&auto=format&fit=crop",
    },
  ],
  "gym-unisex-salon": [
    {
      category_slug: "gym-unisex-salon",
      title: "Private Luxury Fitness Studio",
      description: "Acoustic wood slatting, mirror walls, and ambient LED lights.",
      image_url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1200&auto=format&fit=crop",
    },
  ],
};

/**
 * Fetch all categories from Supabase (with fallback)
 */
export async function getCategories(): Promise<CategoryItem[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("created_at", { ascending: true });

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("[Categories] Supabase fetch error, using fallback:", err);
  }
  return DEFAULT_CATEGORIES;
}

/**
 * Fetch featured categories for homepage
 */
export async function getFeaturedCategories(): Promise<CategoryItem[]> {
  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_featured", true);

    if (!error && data && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn("[Categories] Supabase featured fetch error:", err);
  }
  const all = await getCategories();
  return all.slice(0, 6);
}
