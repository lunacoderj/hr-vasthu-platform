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
            <div className="aspect-[4/5] rounded-3xl overflow-hidden relative shadow-2xl group border border-white/10">
              {/* Golden halo glow */}
              <div className="absolute -inset-4 bg-gradient-to-tr from-[#d4720a]/20 to-[#e68a1c]/10 rounded-[2rem] blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />
              <div className="absolute inset-0 bg-[#0a0a0f]/40 z-10 group-hover:bg-transparent transition-colors duration-700"></div>
              <img 
                src="/Gallery/hero.png" 
                alt="Dr. Kunchala Hanumantha Rao" 
                className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
              />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#0a0a0f] to-transparent z-20">
                <Typography variant="h3" className="text-white mb-1">Dr. Kunchala Hanumantha Rao</Typography>
                <p className="text-[#d4720a] font-semibold tracking-wider text-sm uppercase">Vastu Jnani & Kala Samrat</p>
              </div>
            </div>
            
            {/* Badges */}
            <div className="absolute -right-8 top-1/4 hidden md:flex flex-col gap-4 z-20">
              {[
                { icon: <Star size={20} />, label: "25+ Years" },
                { icon: <Globe size={20} />, label: "Global Reach" },
                { icon: <BookOpen size={20} />, label: "Author & Guide" }
              ].map((badge, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + (idx * 0.1) }}
                  className="bg-white/5 backdrop-blur-xl shadow-2xl rounded-2xl p-4 flex items-center gap-3 border border-white/10 magnetic"
                >
                  <div className="text-[#d4720a] bg-[#d4720a]/10 p-2 rounded-xl">
                    {badge.icon}
                  </div>
                  <span className="font-bold text-white text-sm whitespace-nowrap">{badge.label}</span>
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
                <span>The Master Architect</span>
              </div>
              <Typography variant="h2" className="mb-6 leading-tight text-white">
                Pioneering Vastu Science & Technology
              </Typography>
              <p className="text-stone-300 text-lg leading-relaxed mb-6 font-light">
                Dr. Kunchala Hanumantha Rao is not merely a consultant; he is an institution. With a Doctorate in Vastu Science and the prestigious Nepal Sadbhavana Award, he has spent over two decades transforming homes and businesses by aligning them with cosmic geometry and Earth's magnetic forces.
              </p>
              <p className="text-stone-300 text-lg leading-relaxed font-light">
                His unique philosophy strips away superstition, replacing it with a rigorous, physics-based approach to spatial harmony that has garnered millions of followers worldwide.
              </p>
            </div>

            <button 
              onClick={() => navigate('/about')}
              className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-full font-medium transition-all active:scale-95 flex items-center gap-2 magnetic"
            >
              <span>Read Full Biography</span>
              <ArrowRight size={18} />
            </button>
          </motion.div>

        </div>
      </Container>
    </section>
  );
};
