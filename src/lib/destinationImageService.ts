/**
 * Destination Image Service
 * Automatically synthesizes high-fidelity destination visual states, cover banners,
 * and harmonious accent colors based on trip titles and geographic keywords.
 */

export interface DestinationVisualState {
  coverImage: string;
  heroImage: string;
  accentColor: string;
  themeCategory: string;
  suggestedDestinations: {
    name: string;
    city: string;
    coverImage: string;
    type: 'heritage' | 'temple' | 'experience';
  }[];
}

interface VisualProfile {
  keywords: string[];
  coverImage: string;
  heroImage: string;
  accentColor: string;
  themeCategory: string;
  suggestedDestinations: {
    name: string;
    city: string;
    coverImage: string;
    type: 'heritage' | 'temple' | 'experience';
  }[];
}

const VISUAL_PROFILES: VisualProfile[] = [
  {
    keywords: ['kashmir', 'ladakh', 'himalaya', 'snow', 'mountain', 'valley', 'manali', 'leh'],
    coverImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#059669', // Emerald Alpine
    themeCategory: 'Alpine Expedition',
    suggestedDestinations: [
      { name: 'Dal Lake & Floating Market', city: 'Srinagar', coverImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80', type: 'experience' },
      { name: 'Gulmarg Gondola & Peaks', city: 'Gulmarg', coverImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80', type: 'experience' },
      { name: 'Pahalgam Betaab Valley', city: 'Pahalgam', coverImage: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80', type: 'heritage' },
    ],
  },
  {
    keywords: ['rajasthan', 'jaipur', 'udaipur', 'jodhpur', 'desert', 'fort', 'palace', 'royal'],
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#D97706', // Royal Ochre Amber
    themeCategory: 'Royal Heritage',
    suggestedDestinations: [
      { name: 'Hawa Mahal & City Palace', city: 'Jaipur', coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', type: 'heritage' },
      { name: 'Lake Pichola Palace', city: 'Udaipur', coverImage: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=800&q=80', type: 'heritage' },
      { name: 'Mehrangarh Citadel', city: 'Jodhpur', coverImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80', type: 'heritage' },
    ],
  },
  {
    keywords: ['goa', 'beach', 'kerala', 'coastal', 'backwaters', 'sea', 'ocean', 'island', 'andaman'],
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#0284C7', // Oceanic Cyan
    themeCategory: 'Coastal Sanctuary',
    suggestedDestinations: [
      { name: 'Palolem Beach & Coves', city: 'South Goa', coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80', type: 'experience' },
      { name: 'Alleppey Houseboat Waters', city: 'Alappuzha', coverImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80', type: 'experience' },
      { name: 'Munnar Tea Highlands', city: 'Munnar', coverImage: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80', type: 'heritage' },
    ],
  },
  {
    keywords: ['varanasi', 'spiritual', 'ganges', 'kashi', 'haridwar', 'rishikesh', 'ayodhya'],
    coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#DC2626', // Sacred Crimson
    themeCategory: 'Sacred Pilgrimage',
    suggestedDestinations: [
      { name: 'Dashashwamedh Ghat Aarti', city: 'Varanasi', coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80', type: 'temple' },
      { name: 'Triveni Ghat Evening Vigil', city: 'Rishikesh', coverImage: 'https://images.unsplash.com/photo-1598977123418-454555aa07c8?auto=format&fit=crop&w=800&q=80', type: 'temple' },
    ],
  },
  {
    keywords: ['maharashtra', 'ajanta', 'ellora', 'shirdi', 'nashik', 'pune', 'jyotirling', 'mumbai'],
    coverImage: '/destinations/hero_map.jpg',
    heroImage: '/destinations/hero_map.jpg',
    accentColor: '#2563EB', // Royal Electric Blue
    themeCategory: 'Ancient Sanctuary',
    suggestedDestinations: [
      { name: 'Ellora Kailash Temple', city: 'Chhatrapati Sambhajinagar', coverImage: '/destinations/dest_ellora.jpg', type: 'heritage' },
      { name: 'Ajanta Cave Paintings', city: 'Aurangabad', coverImage: '/destinations/dest_ajanta.jpg', type: 'heritage' },
      { name: 'Shirdi Sai Sansthan', city: 'Shirdi', coverImage: '/destinations/dest_shirdi.jpg', type: 'temple' },
    ],
  },
];

// Default universal fallback
const DEFAULT_VISUAL_PROFILE: DestinationVisualState = {
  coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
  heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
  accentColor: '#2563EB',
  themeCategory: 'Curated Journey',
  suggestedDestinations: [
    { name: 'Historic Old Town & Market', city: 'Central Hub', coverImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80', type: 'heritage' },
    { name: 'Panoramic Viewpoint & Sanctuary', city: 'Highland Point', coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80', type: 'experience' },
  ],
};

/**
 * Resolves destination visuals automatically based on trip title keywords.
 */
export function resolveDestinationVisuals(title: string): DestinationVisualState {
  if (!title) return DEFAULT_VISUAL_PROFILE;

  const normalized = title.toLowerCase();

  for (const profile of VISUAL_PROFILES) {
    if (profile.keywords.some(keyword => normalized.includes(keyword))) {
      return {
        coverImage: profile.coverImage,
        heroImage: profile.heroImage,
        accentColor: profile.accentColor,
        themeCategory: profile.themeCategory,
        suggestedDestinations: profile.suggestedDestinations,
      };
    }
  }

  return DEFAULT_VISUAL_PROFILE;
}
