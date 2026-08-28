import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Star, BookOpen, Globe } from 'lucide-react';
import { Container } from '../../../shared/components/layout/Container';
import Typography from '../../../shared/components/content/Typography';
import { Button } from '../../../shared/components/ui';

export const FounderPreview: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative py-24 bg-transparent border-t border-white/5 overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#d4720a]/5 rounded-full blur-[100px] pointer-events-none translate-x-1/3 -translate-y-1/3"></div>
      
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl group border border-stone-200/50 dark:border-white/10">
              {/* Golden halo glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#d4720a]/20 to-[#e68a1c]/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
              <picture>
                <source srcSet="/Gallery/hero.webp" type="image/webp" />
                <img 
                  src="/Gallery/hero.webp" 
                  alt="Dr. Kunchala Hanumantha Rao" 
                  width={800}
                  height={1000}
                  loading="lazy"
                  decoding="async"
                  style={{ aspectRatio: '4 / 5' }}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
              </picture>
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0a0a0f] to-transparent z-20">
                <Typography variant="h3" className="text-white mb-1">Dr. Kunchala Hanumanthu Rao</Typography>
                <p className="text-[#d4720a] font-semibold tracking-wider text-sm uppercase">Vasthu Siddanthi &amp; Kala Samrat</p>
              </div>
            </div>
            
            {/* Badges */}
            <div className="absolute -right-8 top-1/4 hidden md:flex flex-col gap-4 z-20">
              {[
                { icon: <Star size={20} />, label: "Vasthu Siddanthi" },
                { icon: <Globe size={20} />, label: "Global Reach" },
                { icon: <BookOpen size={20} />, label: "Author & Guide" }
              ].map((badge, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="bg-white/40 dark:bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl p-4 flex items-center gap-3 border border-stone-200/50 dark:border-white/10 magnetic"
                >
                  <div className="text-[#d4720a] bg-[#d4720a]/10 p-2 rounded-xl">
                     {badge.icon}
                  </div>
                  <span className="font-bold text-stone-900 dark:text-white text-sm whitespace-nowrap">{badge.label}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <div className="inline-flex items-center space-x-2 text-[#d4720a] font-bold tracking-widest uppercase text-xs mb-4">
                <span className="w-8 h-[2px] bg-[#d4720a] rounded-full"></span>
                <span>The Master Vasthu Siddanthi</span>
              </div>
              <Typography variant="h2" className="mb-6 leading-tight text-stone-900 dark:text-white">
                Connect with Vasthu Siddanthi Dr. Hanumanthu Rao
              </Typography>
              <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed mb-6 font-light">
                Renowned <strong>Vasthu Siddanthi Dr. Kunchala Hanumanthu Rao</strong> is an internationally acclaimed Vedic Architecture authority. Honored with the prestigious <strong>Nepal Sadbhavana Award</strong> and holding a Doctorate in Vastu Science, he has transformed thousands of homes and commercial establishments across India and globally.
              </p>
              <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed font-light">
                His scientific approach dispels superstitions, replacing them with pure geomagnetic precision, Pancha Bhoota balance, and practical remedies without destructive demolitions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <button 
                onClick={() => navigate('/appointment')}
                className="px-8 py-3.5 bg-gradient-to-r from-gold-600 to-amber-500 hover:from-gold-500 text-white rounded-full font-semibold transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-gold-500/20 cursor-pointer"
              >
                <span>Connect with Dr. Hanumanthu Rao</span>
                <ArrowRight size={18} />
              </button>

              <button 
                onClick={() => navigate('/about')}
                className="px-8 py-3.5 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-800 dark:text-white rounded-full font-medium transition-all active:scale-95 flex items-center gap-2 magnetic cursor-pointer"
              >
                <span>Full Biography</span>
              </button>
            </div>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};
