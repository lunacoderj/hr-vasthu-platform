import React from 'react';
import { Helmet } from 'react-helmet-async';

export interface SEOHeadProps {
  title: string;
  description: string;
  path: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'video.other';
  noindex?: boolean;
}

const BASE_URL = 'https://www.hrvasthu.com';
const DEFAULT_OG_IMAGE = 'https://www.hrvasthu.com/hero.webp';
const SITE_NAME = 'HR Vasthu - Dr. Kunchala Hanumantha Rao';

export const SEOHead: React.FC<SEOHeadProps> = ({
  title,
  description,
  path,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = 'website',
  noindex = false,
}) => {
  const canonicalUrl = path.startsWith('http')
    ? path
    : `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

  const fullOgImage = ogImage.startsWith('http')
    ? ogImage
    : `${BASE_URL}${ogImage.startsWith('/') ? ogImage : `/${ogImage}`}`;

  // Ensure brand name is present in title without duplicating
  const fullTitle = title.includes('HR Vasthu') || title.includes('Hanumantha Rao')
    ? title
    : `${title} | HR Vasthu`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={fullOgImage} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullOgImage} />
    </Helmet>
  );
};

export default SEOHead;
