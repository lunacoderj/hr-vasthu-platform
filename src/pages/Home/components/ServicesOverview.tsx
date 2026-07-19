import React from 'react';
import { motion } from 'framer-motion';
import { Home, Building2, Star, BookOpen } from 'lucide-react';
import { Container } from '../../../shared/components/layout/Container';
import Typography from '../../../shared/components/content/Typography';
import { Card } from '../../../shared/components/ui';

const services = [
  {
    title: 'Residential Vastu',
    description: 'Transform your home into a sanctuary of peace, health, and familial harmony with tailored residential guidelines.',
    icon: Home,
    delay: 0.1,
    glow: 'glow-orange',
    ext: '.residential'
  },
  {
    title: 'Commercial Vastu',
    description: 'Optimize your workspace for business growth, financial stability, and employee well-being.',
    icon: Building2,
    delay: 0.2,
    glow: 'glow-blue',
    ext: '.commercial'
  },
  {
    title: 'Astrology Services',
    description: 'Gain insights into your life path with accurate astrological readings and personalized remedies.',
    icon: Star,
    delay: 0.3,
    glow: 'glow-yellow',
    ext: '.astrology'
  },
  {
    title: 'Vastu Education',
    description: 'Deepen your understanding of ancient sciences through our comprehensive courses and books.',
    icon: BookOpen,
    delay: 0.4,
    glow: 'glow-green',
    ext: '.education'
  },
];

export const ServicesOverview: React.FC = () => {
  return (
    <section className="py-24 bg-stone-100/50 dark:bg-[#111118]/40 border-t border-stone-200/50 dark:border-white/5 transition-colors">
      <Container>
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <Typography variant="h2" className="mb-4 text-stone-900 dark:text-white">
            Our Core Expertise
          </Typography>
          <p className="text-stone-600 dark:text-stone-400 font-light">
            Comprehensive spiritual and architectural guidance designed to align your physical spaces with cosmic energies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: service.delay }}
              >
                <div 
                  className="h-full glass-card-adaptive border border-stone-200/50 dark:border-white/10 p-6 rounded-3xl transition-all duration-300 group hover:-translate-y-2 hover:border-[#d4720a]/30 shadow-[0_4px_20px_rgba(0,0,0,0.03)] dark:shadow-none hover:shadow-[0_10px_30px_rgba(212,114,10,0.15)] dark:hover:shadow-[0_0_30px_rgba(212,114,10,0.15)] magnetic flex flex-col justify-between"
                >
                  <div>
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 ${service.glow}`}>
                      <Icon size={26} />
                    </div>
                    <Typography variant="h4" className="mb-1 text-stone-900 dark:text-white font-serif text-xl font-bold">
                      {service.title}
                    </Typography>
                    <span className="inline-block text-xs font-mono text-stone-400 dark:text-stone-500 mb-4 tracking-wider">
                      {service.ext}
                    </span>
                    <p className="text-sm text-stone-600 dark:text-stone-300 font-light leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Container>
    </section>
  );
};

