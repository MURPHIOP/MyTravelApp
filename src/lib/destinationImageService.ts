/**
 * Destination Image Discovery Broker
 * Automatically discovers, matches, and synthesizes high-fidelity photography,
 * cover banners, harmonious color palettes, and bento visual suites
 * based on destination titles, cities, landmarks, and trip themes.
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

export interface BentoVisualSuite {
  hero: string;
  itinerary: string;
  destinations: string;
  trains: string;
  hotels: string;
  ledger: string;
}

interface VisualProfile {
  keywords: string[];
  coverImage: string;
  heroImage: string;
  accentColor: string;
  themeCategory: string;
  bentoSuite: BentoVisualSuite;
  suggestedDestinations: {
    name: string;
    city: string;
    coverImage: string;
    type: 'heritage' | 'temple' | 'experience';
  }[];
}

const VISUAL_PROFILES: VisualProfile[] = [
  {
    keywords: ['kashmir', 'ladakh', 'himalaya', 'snow', 'mountain', 'valley', 'manali', 'leh', 'gulmarg', 'pahalgam', 'srinagar'],
    coverImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#059669', // Emerald Alpine
    themeCategory: 'Alpine Expedition',
    bentoSuite: {
      hero: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80',
      itinerary: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=1200&q=80',
      destinations: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80',
      trains: 'https://images.unsplash.com/photo-1532103054090-a3392330152a?auto=format&fit=crop&w=800&q=80',
      hotels: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      ledger: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    },
    suggestedDestinations: [
      { name: 'Dal Lake & Floating Market', city: 'Srinagar', coverImage: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80', type: 'experience' },
      { name: 'Gulmarg Gondola & Peaks', city: 'Gulmarg', coverImage: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80', type: 'experience' },
      { name: 'Pahalgam Betaab Valley', city: 'Pahalgam', coverImage: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80', type: 'heritage' },
    ],
  },
  {
    keywords: ['rajasthan', 'jaipur', 'udaipur', 'jodhpur', 'desert', 'fort', 'palace', 'royal', 'jaisalmer'],
    coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#D97706', // Royal Ochre Amber
    themeCategory: 'Royal Heritage',
    bentoSuite: {
      hero: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
      itinerary: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80',
      destinations: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=800&q=80',
      trains: 'https://images.unsplash.com/photo-1517649763962-0c623266ddc0?auto=format&fit=crop&w=800&q=80',
      hotels: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80',
      ledger: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=1200&q=80',
    },
    suggestedDestinations: [
      { name: 'Hawa Mahal & City Palace', city: 'Jaipur', coverImage: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80', type: 'heritage' },
      { name: 'Lake Pichola Palace', city: 'Udaipur', coverImage: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=800&q=80', type: 'heritage' },
      { name: 'Mehrangarh Citadel', city: 'Jodhpur', coverImage: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80', type: 'heritage' },
    ],
  },
  {
    keywords: ['goa', 'beach', 'kerala', 'coastal', 'backwaters', 'sea', 'ocean', 'island', 'andaman', 'munnar', 'alleppey'],
    coverImage: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
    heroImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
    accentColor: '#0284C7', // Oceanic Cyan
    themeCategory: 'Coastal Sanctuary',
    bentoSuite: {
      hero: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80',
      itinerary: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
      destinations: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80',
      trains: '/destinations/dest_train.jpg',
      hotels: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      ledger: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    },
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
    bentoSuite: {
      hero: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=1200&q=80',
      itinerary: 'https://images.unsplash.com/photo-1598977123418-454555aa07c8?auto=format&fit=crop&w=1200&q=80',
      destinations: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80',
      trains: '/destinations/dest_train.jpg',
      hotels: '/destinations/dest_hotel.jpg',
      ledger: 'https://images.unsplash.com/photo-1598977123418-454555aa07c8?auto=format&fit=crop&w=1200&q=80',
    },
    suggestedDestinations: [
      { name: 'Dashashwamedh Ghat Aarti', city: 'Varanasi', coverImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80', type: 'temple' },
      { name: 'Triveni Ghat Evening Vigil', city: 'Rishikesh', coverImage: 'https://images.unsplash.com/photo-1598977123418-454555aa07c8?auto=format&fit=crop&w=800&q=80', type: 'temple' },
    ],
  },
  {
    keywords: ['maharashtra', 'ajanta', 'ellora', 'shirdi', 'nashik', 'pune', 'jyotirling', 'mumbai', 'ancient maharashtra'],
    coverImage: '/destinations/hero_map.jpg',
    heroImage: '/destinations/hero_map.jpg',
    accentColor: '#2563EB', // Royal Electric Blue
    themeCategory: 'Ancient Sanctuary',
    bentoSuite: {
      hero: '/destinations/dest_ellora.jpg',
      itinerary: '/destinations/dest_ajanta.jpg',
      destinations: '/destinations/dest_ellora.jpg',
      trains: '/destinations/dest_train.jpg',
      hotels: '/destinations/dest_hotel.jpg',
      ledger: '/destinations/hero_map.jpg',
    },
    suggestedDestinations: [
      { name: 'Ellora Kailash Temple', city: 'Chhatrapati Sambhajinagar', coverImage: '/destinations/dest_ellora.jpg', type: 'heritage' },
      { name: 'Ajanta Cave Paintings', city: 'Aurangabad', coverImage: '/destinations/dest_ajanta.jpg', type: 'heritage' },
      { name: 'Shirdi Sai Sansthan', city: 'Shirdi', coverImage: '/destinations/dest_shirdi.jpg', type: 'temple' },
    ],
  },
];

// Universal Default Fallback Suite
const DEFAULT_BENTO_SUITE: BentoVisualSuite = {
  hero: '/destinations/dest_ellora.jpg',
  itinerary: '/destinations/dest_ajanta.jpg',
  destinations: '/destinations/dest_ellora.jpg',
  trains: '/destinations/dest_train.jpg',
  hotels: '/destinations/dest_hotel.jpg',
  ledger: '/destinations/hero_map.jpg',
};

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
 * Direct landmark/destination keyword photography map
 */
const DESTINATION_IMAGE_CATALOG: { keywords: string[]; url: string }[] = [
  // Local Maharashtra Landmarks
  { keywords: ['ellora', 'kailash', 'cave 16'], url: '/destinations/dest_ellora.jpg' },
  { keywords: ['ajanta', 'caves', 'fresco'], url: '/destinations/dest_ajanta.jpg' },
  { keywords: ['shirdi', 'sai', 'baba'], url: '/destinations/dest_shirdi.jpg' },
  { keywords: ['bhimashankar', 'dakinyam'], url: '/destinations/dest_bhimashankar.jpg' },
  { keywords: ['trimbakeshwar', 'nashik jyotirlinga'], url: '/destinations/dest_trimbakeshwar.jpg' },
  { keywords: ['grishneshwar', 'verul'], url: '/destinations/dest_grishneshwar.jpg' },
  { keywords: ['daulatabad', 'devagiri', 'fort'], url: '/destinations/dest_daulatabad.jpg' },
  { keywords: ['saptashrungi', 'vani', 'devi'], url: '/destinations/dest_saptashrungi.jpg' },
  { keywords: ['panchvati', 'sita gumpha', 'godavari'], url: '/destinations/dest_panchvati.jpg' },
  { keywords: ['shani', 'shingnapur'], url: '/destinations/dest_shanishingnapur.jpg' },
  { keywords: ['sula', 'vineyard', 'wine'], url: '/destinations/dest_sula.jpg' },
  { keywords: ['nashik', 'temple city'], url: '/destinations/dest_nashik.jpg' },
  { keywords: ['pune', 'shaniwar'], url: '/destinations/dest_pune.jpg' },
  { keywords: ['howrah', 'kolkata', 'bridge'], url: '/destinations/dest_howrah.jpg' },
  { keywords: ['train', 'rail', 'express', 'station'], url: '/destinations/dest_train.jpg' },
  { keywords: ['hotel', 'resort', 'stay', 'room'], url: '/destinations/dest_hotel.jpg' },

  // Himalayan & Northern Destinations
  { keywords: ['dal lake', 'shikara', 'srinagar'], url: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['gulmarg', 'gondola', 'snow peak'], url: 'https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['pahalgam', 'betaab', 'aru'], url: 'https://images.unsplash.com/photo-1566837945700-30057527ade0?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['ladakh', 'pangong', 'leh'], url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['manali', 'rohtang', 'solang'], url: 'https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=800&q=80' },

  // Royal Rajasthan Destinations
  { keywords: ['hawa mahal', 'jaipur', 'pink city'], url: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['lake pichola', 'udaipur', 'city palace'], url: 'https://images.unsplash.com/photo-1585123334904-845d60e97b29?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['mehrangarh', 'jodhpur', 'blue city'], url: 'https://images.unsplash.com/photo-1589182373726-e4f658ab50f0?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['jaisalmer', 'sam sand', 'thar desert'], url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800&q=80' },

  // Coastal & Southern Destinations
  { keywords: ['palolem', 'calangute', 'goa', 'beach'], url: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['alleppey', 'alappuzha', 'houseboat', 'backwaters'], url: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['munnar', 'tea plantation', 'highlands'], url: 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=800&q=80' },

  // Sacred & Ganges Destinations
  { keywords: ['varanasi', 'ghat', 'kashi', 'ganges'], url: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?auto=format&fit=crop&w=800&q=80' },
  { keywords: ['rishikesh', 'haridwar', 'ganga aarti'], url: 'https://images.unsplash.com/photo-1598977123418-454555aa07c8?auto=format&fit=crop&w=800&q=80' },
];

/**
 * Resolves destination visual state automatically based on trip title keywords.
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

/**
 * Dynamic Bento Visual Suite resolution tailored to trip theme.
 */
export function resolveBentoVisualSuite(title: string): BentoVisualSuite {
  if (!title) return DEFAULT_BENTO_SUITE;

  const normalized = title.toLowerCase();

  for (const profile of VISUAL_PROFILES) {
    if (profile.keywords.some(keyword => normalized.includes(keyword))) {
      return profile.bentoSuite;
    }
  }

  return DEFAULT_BENTO_SUITE;
}

/**
 * Keyword-Driven Destination Image Discovery Broker:
 * Hooks any destination title, landmark name, or city to high-fidelity photography.
 */
export function resolvePlaceImage(nameOrCity: string, fallback?: string): string {
  if (!nameOrCity && fallback) return fallback;
  if (!nameOrCity) return '/destinations/hero_map.jpg';

  const normalized = nameOrCity.toLowerCase();

  // 1. Direct landmark catalog lookup
  for (const item of DESTINATION_IMAGE_CATALOG) {
    if (item.keywords.some(k => normalized.includes(k))) {
      return item.url;
    }
  }

  // 2. Profile matching
  for (const profile of VISUAL_PROFILES) {
    if (profile.keywords.some(k => normalized.includes(k))) {
      return profile.coverImage;
    }
  }

  // 3. Fallback priority
  return fallback || DEFAULT_VISUAL_PROFILE.coverImage;
}
