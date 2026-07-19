export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  src: string;
  category: 'awards' | 'certifications' | 'speeches';
}

export const GALLERY_ITEMS: GalleryItem[] = [
  // Awards & Honors
  {
    id: 'doctorate',
    title: 'Doctorate of Science',
    description: 'Awarded by The Open International University for Complementary Medicines, Colombo, Sri Lanka.',
    src: '/Gallery/Doctorate Photo.png',
    category: 'awards',
  },
  {
    id: 'indo-nepal',
    title: 'Indo Nepal Sadbhavana Award',
    description: 'A prestigious international honor for cross-border contributions to peace through architectural harmony.',
    src: '/Gallery/Indo Nepal Award.png',
    category: 'awards',
  },
  {
    id: 'vastu-pandit',
    title: 'International Vastu Pandit',
    description: 'Recognized globally as a supreme authority on Vastu Shastra and architectural science.',
    src: '/Gallery/International Vastu Pandit.png',
    category: 'awards',
  },
  {
    id: 'vastu-pandit-2',
    title: 'International Vastu Pandit — Ceremony',
    description: 'Felicitation ceremony honoring the title of International Vastu Pandit.',
    src: '/Gallery/International Vastu Pandit 2.png',
    category: 'awards',
  },
  {
    id: 'chiranjeevi',
    title: 'Snamanam — Chiranjeevi Charitable Trust',
    description: 'Honored at the May Day celebrations by the Chiranjeevi Charitable Trust.',
    src: '/Gallery/Snamanam - Chiranjeevi Charitable Trust MAY DAY.png',
    category: 'awards',
  },
  {
    id: 'vastu-jnani',
    title: 'Vaasthu Jnani Award',
    description: 'The Knower of Vastu — a spiritual title for his profound grasp of ancient architectural scriptures.',
    src: '/Gallery/Vaasthu Jnani Award.png',
    category: 'awards',
  },
  {
    id: 'vastu-kala-samrat',
    title: 'Vaasthu Kala Samrat',
    description: 'The Emperor of Vastu Art — recognizing unmatched skill in blending design with elemental perfection.',
    src: '/Gallery/Vaasthu kala Samrat.png',
    category: 'awards',
  },
  // Client Certifications
  {
    id: 'cert-main',
    title: 'Client Certification',
    description: 'Official Vastu compliance certification issued to satisfied clients.',
    src: '/Gallery/clients-certification.png',
    category: 'certifications',
  },
  {
    id: 'cert-1',
    title: 'Client Certification',
    description: 'Vastu-compliant structural certification.',
    src: '/Gallery/client-certification1.png',
    category: 'certifications',
  },
  {
    id: 'cert-3',
    title: 'Client Certification',
    description: 'Residential Vastu alignment certificate.',
    src: '/Gallery/client-certification3.png',
    category: 'certifications',
  },
  {
    id: 'cert-4',
    title: 'Client Certification',
    description: 'Commercial property Vastu certificate.',
    src: '/Gallery/client-certification4.png',
    category: 'certifications',
  },
  {
    id: 'cert-5',
    title: 'Client Certification',
    description: 'Industrial layout Vastu certification.',
    src: '/Gallery/client-certification5.png',
    category: 'certifications',
  },
  {
    id: 'cert-6',
    title: 'Client Certification',
    description: 'Vastu energy alignment certificate.',
    src: '/Gallery/client-certification6.png',
    category: 'certifications',
  },
  {
    id: 'cert-7',
    title: 'Client Certification',
    description: 'Structural harmony validation certificate.',
    src: '/Gallery/client-certification7.png',
    category: 'certifications',
  },
  {
    id: 'cert-8',
    title: 'Client Certification',
    description: 'Cosmic geometry compliance certificate.',
    src: '/Gallery/client-certification8.png',
    category: 'certifications',
  },
  {
    id: 'cert-9',
    title: 'Client Certification',
    description: 'Elemental balance verification certificate.',
    src: '/Gallery/client-certification9.png',
    category: 'certifications',
  },
  {
    id: 'cert-10',
    title: 'Client Certification',
    description: 'Magnetic field alignment certificate.',
    src: '/Gallery/client-certification10.png',
    category: 'certifications',
  },
  {
    id: 'madhura',
    title: 'Madhura Constructions',
    description: 'Vastu consultation partnership with Madhura Constructions.',
    src: '/Gallery/madhura-constructions.png',
    category: 'certifications',
  },
  // Speeches
  {
    id: 'speech',
    title: 'Public Address',
    description: 'Dr. Rao delivering an inspiring speech on the principles of Vastu Science & Technology.',
    src: '/Gallery/speech.png',
    category: 'speeches',
  },
];

export const FILTER_TABS = [
  { key: 'all', label: 'All' },
  { key: 'awards', label: 'Awards & Honors' },
  { key: 'certifications', label: 'Client Certifications' },
  { key: 'speeches', label: 'Lectures & Speeches' },
] as const;
