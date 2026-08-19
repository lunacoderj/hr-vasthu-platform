import React from 'react';
import { Hero } from './components/Hero';
import { ServicesOverview } from './components/ServicesOverview';
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
      "name": "HR Vasthu - Official Portal to Connect with Vasthu Siddanthi Dr. Hanumanthu Rao",
      "alternateName": [
        "Vasthu Siddanthi Dr Hanumanthu Rao",
        "వాస్తు సిద్ధాంతి డాక్టర్ కుంచాల హనుమంతరావు",
        "Dr. Kunchala Hanumantha Rao Vastu Siddanthi",
        "HR Vasthu"
      ],
      "url": "https://hrvasthu.com",
      "logo": "https://hrvasthu.com/logo.webp",
      "image": "https://hrvasthu.com/hero.webp",
      "description": "Official platform to directly connect with renowned Vasthu Siddanthi Dr. Kunchala Hanumanthu Rao for authentic Vedic Vastu consultations, floor plans, and architectural drawings.",
      "telephone": "+919246624248",
      "email": "hrvasthu9@gmail.com",
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
        "jobTitle": "Vasthu Siddanthi & Vedic Architecture Consultant",
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
        <title>Connect with Vasthu Siddanthi Dr. Hanumanthu Rao | HR Vasthu</title>
        <meta name="description" content="Official website to connect directly with renowned Vasthu Siddanthi Dr. Kunchala Hanumanthu Rao. Get authentic Vedic house plans, drawings, and personalized consultations." />
      </Helmet>
      {structuredSchemas.map((schema, index) => (
        <JsonLd key={index} data={schema} />
      ))}
      <HonorsBanner />
      <Hero />
      <FounderPreview />
      <ServicesOverview />
      <FeaturedVideos />
      <LibraryPreview />
      <CallToAction />
    </div>
  );
};

export default Home;
