import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { ShieldCheck, Mail, Phone, MapPin } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-20">
      <Helmet>
        <title>Privacy Policy | HR Vasthu Digital Platform</title>
        <meta name="description" content="Privacy policy, data protection, and cookie compliance for HR Vasthu digital platform." />
        <link rel="canonical" href="https://hrvasthu.com/privacy" />
      </Helmet>

      <Container size="lg">
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-12 border border-stone-200 dark:border-stone-800 shadow-sm space-y-8">
          <div className="flex items-center gap-3 text-gold-500">
            <ShieldCheck size={32} />
            <Typography variant="h1" className="text-3xl md:text-4xl font-serif font-bold text-stone-900 dark:text-white">
              Privacy Policy
            </Typography>
          </div>

          <p className="text-sm text-stone-500 font-mono">
            Effective Date: January 1, 2026 | Last Updated: August 2026
          </p>

          <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 space-y-6 text-sm md:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">1. Introduction</h2>
              <p>
                Welcome to <strong>HR Vasthu</strong> (https://hrvasthu.com), operated by <strong>Dr. Kunchala Hanumantha Rao</strong>. We respect your privacy and are committed to protecting any personal information you share with us. This Privacy Policy explains how we collect, use, and safeguard your details when visiting our website or requesting Vastu consultations.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">2. Information We Collect</h2>
              <p>We may collect information you provide directly, including:</p>
              <ul className="list-disc pl-5 space-y-1">
                <li><strong>Contact Information:</strong> Full name, phone number, email address, and physical location when booking a consultation or contacting us via WhatsApp.</li>
                <li><strong>Architectural Data:</strong> Floor plans, layout drawings, direction details, and photographs submitted for Vastu analysis.</li>
                <li><strong>Usage & Analytics Data:</strong> Anonymous telemetry (device type, browser, approximate city, page views, and video interactions) to optimize site speed and content relevance.</li>
              </ul>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">3. Google AdSense & Third-Party Advertising Cookies</h2>
              <p>
                We use <strong>Google AdSense</strong> to display advertisements. Google, as a third-party vendor, uses cookies (including the DoubleClick DART cookie) to serve ads based on your visit to this site and other websites on the internet.
              </p>
              <p>
                Users may opt out of personalized advertising by visiting <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline">Google Ads Settings</a> or through <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-gold-600 underline">AboutAds.info</a>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">4. Data Security & Storage</h2>
              <p>
                We implement industry-standard encryption protocols. We do not sell, rent, or trade your personal contact details to any third-party marketing companies.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">5. Contact Information</h2>
              <p>If you have any questions about this Privacy Policy, please contact our headquarters:</p>
              <div className="bg-stone-50 dark:bg-stone-950/50 p-4 rounded-xl border border-stone-200 dark:border-stone-800 space-y-2 text-sm">
                <div className="flex items-center gap-2"><MapPin size={16} className="text-gold-500" /> Opposite Rama Lakshmi Apartments, Pedda Waltair, Visakhapatnam, AP, India — 530017</div>
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

export default PrivacyPolicy;
