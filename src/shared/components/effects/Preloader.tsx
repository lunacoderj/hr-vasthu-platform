import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Galaxy3D } from './Galaxy3D';

export const Preloader: React.FC = () => {
  const [show, setShow] = useState(true);
  const [phase, setPhase] = useState<'travel' | 'arrival' | 'exit'>('travel');

  useEffect(() => {
    // Total duration before hiding
    const exitTimer = setTimeout(() => {
      setPhase('exit');
      setTimeout(() => setShow(false), 1000);
    }, 4500); 

    return () => clearTimeout(exitTimer);
  }, []);

  const handleArrival = () => {
    if (phase === 'travel') {
      setPhase('arrival');
    }
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === 'exit' ? 0 : 1 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 z-[9999] bg-[#050508] flex items-center justify-center overflow-hidden"
        >
          {/* Rich 3D WebGL Galaxy Background */}
          <div className="absolute inset-0 z-0">
            <Galaxy3D onArrival={handleArrival} />
          </div>

          {/* Foreground Logo overlay */}
          <AnimatePresence>
            {phase === 'arrival' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, filter: 'blur(20px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
                className="relative z-10 flex flex-col items-center justify-center w-full h-full pointer-events-none"
              >
                {/* Elegant geometric framing */}
                <motion.div
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 45, opacity: 1 }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  className="absolute w-64 h-64 border border-gold-500/30 rotate-45 flex items-center justify-center mix-blend-screen"
                >
                  <div className="w-56 h-56 border border-copper-400/20 -rotate-12" />
                </motion.div>

                {/* Main Logo Text */}
                <div className="relative flex flex-col items-center">
                  <motion.h1
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1, delay: 0.2 }}
                    className="text-5xl md:text-7xl font-serif text-transparent bg-clip-text bg-gradient-to-b from-white via-gold-200 to-gold-600 font-bold uppercase tracking-widest drop-shadow-[0_0_30px_rgba(212,114,10,0.8)]"
                  >
                    HR Vasthu
                  </motion.h1>

                  {/* Golden line */}
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: '150%', opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="h-[2px] bg-gradient-to-r from-transparent via-gold-400 to-transparent mt-6 mb-4 shadow-[0_0_15px_rgba(212,114,10,0.8)]"
                  />

                  <motion.p
                    initial={{ opacity: 0, letterSpacing: '0em' }}
                    animate={{ opacity: 1, letterSpacing: '0.5em' }}
                    transition={{ duration: 1, delay: 1 }}
                    className="text-gold-100 text-sm md:text-base uppercase drop-shadow-[0_0_5px_rgba(0,0,0,1)]"
                  >
                    The Science of Architecture
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
