import React from 'react';
import { Hero } from './components/Hero';
import { ServicesOverview } from './components/ServicesOverview';
import { FeaturedVideos } from './components/FeaturedVideos';
import { CallToAction } from './components/CallToAction';
import { FounderPreview } from './components/FounderPreview';
import { LibraryPreview } from './components/LibraryPreview';
import { Helmet } from 'react-helmet-async';
import { JsonLd } from '../../shared/components/seo/JsonLd';

const Home: React.FC = () => {
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "HR Vasthu",
    "url": "https://hrvasthu.com",
    "logo": "https://hrvasthu.com/favicon.svg",
    "founder": {
      "@type": "Person",
      "name": "Dr. Kunchala Hanumantha Rao"
    },
    "sameAs": [
      "https://youtube.com/@hrvasthu"
    ]
  };

  return (
    <div className="w-full">
      <Helmet>
        <title>HR Vasthu - Expert Vastu Shastra Consultation</title>
      </Helmet>
      <JsonLd data={orgSchema} />
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
