import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { FileText, MapPin, Phone, Mail } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-20">
      <Helmet>
        <title>Terms of Service | HR Vasthu Digital Platform</title>
        <meta name="description" content="Terms of Service and consultation agreements for HR Vasthu digital platform." />
        <link rel="canonical" href="https://hrvasthu.com/terms" />
      </Helmet>

      <Container size="lg">
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-12 border border-stone-200 dark:border-stone-800 shadow-sm space-y-8">
          <div className="flex items-center gap-3 text-gold-500">
            <FileText size={32} />
            <Typography variant="h1" className="text-3xl md:text-4xl font-serif font-bold text-stone-900 dark:text-white">
              Terms of Service
            </Typography>
          </div>

          <p className="text-sm text-stone-500 font-mono">
            Effective Date: January 1, 2026 | Last Updated: August 2026
          </p>

          <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 space-y-6 text-sm md:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">1. Agreement to Terms</h2>
              <p>
                By accessing or using <strong>HR Vasthu</strong> (https://hrvasthu.com), you agree to be bound by these Terms of Service. If you disagree with any part of these terms, you may not access the service.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">2. Vastu Consultations & Advisory</h2>
              <p>
                Consultations provided by <strong>Dr. Kunchala Hanumantha Rao</strong> are based on authentic Vedic Vastu Shastra principles, spatial geometry, and empirical expertise. Consultations are intended to harmonize architectural layouts and spatial energy flows.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">3. Intellectual Property</h2>
              <p>
                All videos, articles, digital books, logos, diagrams, and written content on this website are the intellectual property of <strong>Dr. Kunchala Hanumantha Rao / HR Vasthu</strong> and are protected by copyright laws. Unauthorized reproduction or commercial distribution without prior written consent is strictly prohibited.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">4. User Conduct</h2>
              <p>
                You agree not to misuse the website, attempt unauthorized access to restricted systems, or submit false inquiries through consultation channels.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">5. Contact Information</h2>
              <div className="bg-stone-50 dark:bg-stone-950/50 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 text-sm">
                <div className="flex items-center gap-2"><MapPin size={16} className="text-gold-500" /> Opposite Rama Lakshmi Apartments, Pedda Waltair, Visakhapatnam, AP — 530017</div>
                <div className="flex items-center gap-2"><Phone size={16} className="text-gold-500" /> +91 92466 24248</div>
                <div className="flex items-center gap-2"><Mail size={16} className="text-gold-500" /> hrvasthu9@gmail.com</div>
              </div>
            </section>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default TermsOfService;
