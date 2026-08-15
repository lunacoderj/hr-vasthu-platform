import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { AlertCircle, Compass, MapPin, Phone, Mail } from 'lucide-react';

export const VastuDisclaimer: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-20">
      <Helmet>
        <title>Vastu Disclaimer | HR Vasthu Digital Platform</title>
        <meta name="description" content="Legal and advisory disclaimer for Vastu Shastra consultations and educational content on HR Vasthu." />
        <link rel="canonical" href="https://hrvasthu.com/disclaimer" />
      </Helmet>

      <Container size="lg">
        <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-12 border border-stone-200 dark:border-stone-800 shadow-sm space-y-8">
          <div className="flex items-center gap-3 text-gold-500">
            <Compass size={32} />
            <Typography variant="h1" className="text-3xl md:text-4xl font-serif font-bold text-stone-900 dark:text-white">
              Vastu & Advisory Disclaimer
            </Typography>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-300 flex items-start gap-3 text-sm">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <p>
              Please read this disclaimer carefully before relying on any guidance, educational videos, articles, or consultation services provided by HR Vasthu.
            </p>
          </div>

          <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 space-y-6 text-sm md:text-base leading-relaxed">
            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">1. Nature of Vastu Science</h2>
              <p>
                Vastu Shastra is an ancient Indian traditional science of architecture, directional alignment, and spatial geometry. While thousands of clients have experienced profound structural harmony and life benefits over 25+ years of practice by Dr. Kunchala Hanumantha Rao, results may vary based on individual circumstances, geological conditions, and structural feasibility.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">2. No Substitute for Legal, Financial, or Medical Advice</h2>
              <p>
                Vastu consultations and educational content provided on this website are not intended to substitute for certified structural engineering assessments, legal property verifications, medical treatments, or financial planning.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">3. Professional Consultation</h2>
              <p>
                General videos and articles are created for broad educational purposes. For specific properties, plots, or renovations, we always recommend getting a direct 1-on-1 plan verification with <strong>Dr. Kunchala Hanumantha Rao</strong> before executing major structural demolitions or investments.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-serif font-bold text-stone-900 dark:text-white">4. Inquiries & Verifications</h2>
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

export default VastuDisclaimer;
