import React, { useState } from 'react';
import { ChevronDown, HelpCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { Container } from '../../../shared/components/layout/Container';
import Typography from '../../../shared/components/content/Typography';

export interface FAQItem {
  question: string;
  answer: string;
}

export const HOME_FAQS: FAQItem[] = [
  {
    question: "What are the core Vastu rules for North-East (Eshanya) and South-West (Niruthi)?",
    answer: "North-East (Eshanya) is governed by Water and Ether — it must remain lightweight, clean, and open, making it ideal for the Pooja Mandir and underground water sump. South-West (Niruthi) is governed by Earth — it should be the heaviest and highest elevated zone of the house, making it the supreme location for the Master Bedroom to ensure stability, health, and prosperity."
  },
  {
    question: "Can Vastu defects (Doshas) be corrected without structural demolition?",
    answer: "Yes. Over 95% of common architectural imbalances can be remediated through scientific non-demolition methods. Dr. Kunchala Hanumantha Rao specializes in Pancha Bhoota elemental realignment, micro-degree geometric adjustments, and spatial energy channeling without knocking down load-bearing walls."
  },
  {
    question: "Which house facing direction (East, North, West, or South) is considered best in Vedic Vastu?",
    answer: "Every facing direction can be highly auspicious and bring immense prosperity if the main entrance (Simhadwaram) is positioned in positive pada zones (e.g., Jayanta/Indra for East, Mukhya/Bhallata for North, Pushpadanta for West, and Vitatha/Gruhakshata for South) and internal rooms match their respective cardinal elements."
  },
  {
    question: "What consultation services does Dr. Kunchala Hanumantha Rao offer across AP & Telangana?",
    answer: "We provide comprehensive on-site physical property inspections, 100% Vastu-compliant 2D CAD floor plans, 3D architectural elevations, factory/commercial enterprise audits, and online digital blueprint assessments across Visakhapatnam (Vizag), Vijayawada, Guntur, Tirupati, Hyderabad, and all districts."
  },
  {
    question: "How can I book a personalized consultation with Vasthu Siddanthi Dr. Hanumantha Rao?",
    answer: "You can book directly via our online Appointment page or call our Visakhapatnam headquarters at +91 92466 24248. Both in-person visits across Andhra Pradesh/Telangana and remote digital blueprint reviews are available."
  }
];

export const HomeFAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-20 bg-stone-100/60 dark:bg-stone-900/40 border-t border-stone-200 dark:border-stone-800">
      <Container>
        <div className="max-w-4xl mx-auto">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
              <HelpCircle size={14} />
              <span>Authentic Vastu Guidance</span>
            </div>
            <Typography variant="h2" className="text-2xl sm:text-4xl font-serif font-bold text-stone-900 dark:text-stone-100 mb-4">
              Frequently Asked Questions on Vedic Vastu
            </Typography>
            <p className="text-stone-600 dark:text-stone-300 text-sm sm:text-base max-w-2xl mx-auto">
              Essential answers to common architectural and spatial planning queries by Vasthu Siddanthi Dr. Kunchala Hanumantha Rao.
            </p>
          </div>

          {/* Accordion List */}
          <div className="space-y-4">
            {HOME_FAQS.map((faq, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs transition-all"
                >
                  <button
                    onClick={() => toggleFAQ(idx)}
                    className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-stone-50/50 dark:hover:bg-stone-800/50 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <span className="font-serif font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                      {faq.question}
                    </span>
                    <div className={`p-1.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180 bg-amber-500/20 text-amber-600' : ''}`}>
                      <ChevronDown size={18} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 text-sm sm:text-base text-stone-600 dark:text-stone-300 leading-relaxed border-t border-stone-100 dark:border-stone-800/60 font-light">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Trust Banner */}
          <div className="mt-10 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-500/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-amber-500 text-white shrink-0">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="font-bold text-sm text-stone-900 dark:text-white">Have a Unique Structural Query?</h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">Get customized architectural remedies tailored to your site coordinates.</p>
              </div>
            </div>
            <a
              href="/appointment"
              className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold rounded-full transition-all shrink-0"
            >
              Ask Dr. Hanumanthu Rao
            </a>
          </div>

        </div>
      </Container>
    </section>
  );
};

export default HomeFAQ;
