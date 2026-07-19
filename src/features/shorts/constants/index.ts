export const SHORTS_CATEGORIES = [
  'All',
  'Kitchen',
  'Bedroom',
  'Main Door',
  'Borewell',
  'Balcony',
  'Plants',
  'Temple',
  'Apartment',
  'Commercial',
  'Office'
] as const;

export type ShortsCategory = typeof SHORTS_CATEGORIES[number];
