import React from 'react';
import { Hero } from './components/Hero';
import { ServicesOverview } from './components/ServicesOverview';
import { DistrictCoverage } from './components/DistrictCoverage';
import { FeaturedVideos } from './components/FeaturedVideos';
import { CallToAction } from './components/CallToAction';
import { FounderPreview } from './components/FounderPreview';
import { LibraryPreview } from './components/LibraryPreview';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from '../../shared/components/seo/JsonLd';
import { HonorsBanner } from './components/HonorsBanner';

const Home: React.FC = () => {
  const structuredSchemas = [
    {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": "HR Vasthu - Best & Most Experienced Vasthu Siddanthi in Vizag & Andhra Pradesh",
      "alternateName": [
        "Vasthu Siddanthi Dr Hanumanthu Rao",
        "Best Vasthu Siddanthi in Vizag",
        "Best Vasthu Siddanthi in Visakhapatnam",
        "Best Vasthu Siddanthi in Andhra Pradesh",
        "వాస్తు సిద్ధాంతి డాక్టర్ కుంచాల హనుమంతరావు",
        "Dr. Kunchala Hanumantha Rao Vastu Siddanthi",
        "HR Vasthu"
      ],
      "url": "https://hrvasthu.com",
      "logo": "https://hrvasthu.com/logo.webp",
      "image": "https://hrvasthu.com/hero.webp",
      "description": "Connect with Dr. Kunchala Hanumanthu Rao — the most experienced Vasthu Siddanthi in Vizag and across all Andhra Pradesh & Telangana districts (Vijayawada, Guntur, Tirupati, Rajahmundry, Kakinada, Nellore, Kurnool, Hyderabad). 30+ years of authentic Vedic Vastu expertise.",
      "telephone": "+919246624248",
      "email": "hrvasthu9@gmail.com",
      "priceRange": "$$",
      "areaServed": [
        { "@type": "City", "name": "Visakhapatnam" },
        { "@type": "City", "name": "Vizag" },
        { "@type": "City", "name": "Vijayawada" },
        { "@type": "City", "name": "Guntur" },
        { "@type": "City", "name": "Tirupati" },
        { "@type": "City", "name": "Rajahmundry" },
        { "@type": "City", "name": "Kakinada" },
        { "@type": "City", "name": "Nellore" },
        { "@type": "City", "name": "Kurnool" },
        { "@type": "City", "name": "Kadapa" },
        { "@type": "City", "name": "Anantapur" },
        { "@type": "City", "name": "Srikakulam" },
        { "@type": "City", "name": "Vizianagaram" },
        { "@type": "City", "name": "Eluru" },
        { "@type": "City", "name": "Ongole" },
        { "@type": "City", "name": "Hyderabad" },
        { "@type": "AdministrativeArea", "name": "Andhra Pradesh" },
        { "@type": "AdministrativeArea", "name": "Telangana" }
      ],
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Opposite Rama Lakshmi Apartments, Pedda Waltair",
        "addressLocality": "Visakhapatnam",
        "addressRegion": "Andhra Pradesh",
        "postalCode": "530017",
        "addressCountry": "IN"
      },
      "founder": {
        "@type": "Person",
        "name": "Dr. Kunchala Hanumantha Rao",
        "jobTitle": "Most Experienced Vasthu Siddanthi & Vedic Architecture Master",
        "alternateName": "Vasthu Siddanthi Dr. Hanumanthu Rao",
        "award": "Nepal Sadbhavana Award",
        "sameAs": [
          "https://www.youtube.com/channel/UCgCijg9nTzivoeszshGjzzQ"
        ]
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "HR Vasthu",
      "url": "https://hrvasthu.com",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://hrvasthu.com/videos?search={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <div className="w-full">
      <Helmet>
        <title>Best Experienced Vasthu Siddanthi in Vizag & Andhra Pradesh | Dr. Hanumanthu Rao</title>
        <meta name="description" content="Connect with Dr. Kunchala Hanumanthu Rao — the most experienced Vasthu Siddanthi in Vizag (Visakhapatnam), Vijayawada, Guntur, Tirupati, Rajahmundry, Kakinada, and all AP districts." />
      </Helmet>
      {structuredSchemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
      <HonorsBanner />
      <Hero />
      <FounderPreview />
      <ServicesOverview />
      <DistrictCoverage />
      <FeaturedVideos />
      <LibraryPreview />
      <CallToAction />
    </div>
  );
};

export default Home;
