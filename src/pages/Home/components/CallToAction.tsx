import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import { Container } from '../../../shared/components/layout/Container';
import Typography from '../../../shared/components/content/Typography';
import { Button, AnimatedBookingCTA } from '../../../shared/components/ui';
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
          className="glass-card-adaptive border border-stone-200/50 dark:border-white/10 rounded-3xl p-8 md:p-16 text-center max-w-4xl mx-auto shadow-2xl hover:border-[#d4720a]/30 transition-all duration-300"
        >
          <Typography variant="h2" className="text-stone-900 dark:text-white mb-4 font-serif">
            Ready to Connect with Vasthu Siddanthi Dr. Hanumanthu Rao?
          </Typography>
          <p className="text-stone-600 dark:text-stone-300 mb-8 max-w-2xl mx-auto text-lg font-light leading-relaxed">
            Get 100% authentic Vedic Vastu guidance, personalized house plans, and remedy consultations directly from <strong>Dr. Kunchala Hanumanthu Rao</strong>.
          </p>
          
          <Link to="/appointment" className="inline-block mt-4">
            <AnimatedBookingCTA />
          </Link>
        </motion.div>
      </Container>
    </section>
  );
};
