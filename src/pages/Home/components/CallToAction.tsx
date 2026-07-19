import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Container } from '../../../shared/components/layout/Container';
import Typography from '../../../shared/components/content/Typography';
import { Button } from '../../../shared/components/ui';
import { Link } from 'react-router-dom';

export const CallToAction: React.FC = () => {
  return (
    <section className="py-24 bg-transparent relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none -z-10">
        <div className="w-full max-w-4xl h-full bg-[#d4720a]/5 blur-3xl rounded-full" />
      </div>

      <Container className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto backdrop-blur-xl shadow-2xl hover:border-[#d4720a]/30 transition-all duration-300"
        >
          <Typography variant="h2" className="text-white mb-4 font-serif">
            Ready to Align Your Life?
          </Typography>
          <p className="text-stone-300 mb-8 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Book a personal consultation today and take the first step towards a harmonious, prosperous, and balanced lifestyle.
          </p>
          
          <Link to="/contact" className="inline-block">
            <button className="px-8 py-3.5 bg-gradient-to-r from-[#d4720a] to-[#e68a1c] text-white rounded-full font-medium transition-all shadow-lg hover:shadow-xl hover:opacity-90 active:scale-95 flex items-center gap-2 magnetic">
              <Calendar size={18} />
              <span>Schedule Your Consultation</span>
            </button>
          </Link>
        </motion.div>
      </Container>
    </section>
  );
};
