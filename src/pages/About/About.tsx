import React from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, Star, Compass, MapPin, Globe, Sparkles, Building2 } from 'lucide-react';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-100px" },
  transition: { duration: 0.8, ease: "easeOut" as const }
};

export const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950">
      
      {/* Hero Section */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?q=80&w=2500&auto=format&fit=crop')] bg-cover bg-center opacity-[0.03] dark:opacity-[0.05]"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-stone-50 via-transparent to-stone-50 dark:from-stone-950 dark:to-stone-950"></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold-500/20 dark:bg-gold-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        </div>

        <Container className="relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="inline-flex items-center space-x-2 bg-gold-50 dark:bg-gold-900/30 text-gold-700 dark:text-gold-400 px-4 py-1.5 rounded-full text-sm font-medium mb-8 border border-gold-200 dark:border-gold-800/50 shadow-sm"
            >
              <Sparkles size={16} />
              <span className="tracking-widest uppercase text-xs font-bold">The Master of Vastu Science</span>
              <Sparkles size={16} />
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-5xl md:text-7xl font-serif font-bold text-stone-900 dark:text-ivory-50 mb-6 leading-tight tracking-tight"
            >
              Dr. Kunchala <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-500 via-gold-400 to-copper-600">
                Hanumantha Rao
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl md:text-2xl text-stone-600 dark:text-stone-300 font-light max-w-3xl mx-auto leading-relaxed"
            >
              A visionary bridging the ancient wisdom of Vedic architecture with modern technological science to architect harmony, prosperity, and cosmic balance.
            </motion.p>
          </div>
        </Container>
      </section>

      {/* The Legend Section */}
      <section className="py-20 relative border-t border-stone-200 dark:border-stone-800/50 bg-white dark:bg-stone-900/50">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp} className="relative">
              <div className="aspect-[4/5] rounded-3xl overflow-hidden relative group shadow-2xl">
                <div className="absolute inset-0 bg-stone-900/20 group-hover:bg-transparent transition-colors duration-700 z-10"></div>
                <img 
                  src="/Gallery/speech.png" 
                  alt="Dr. Kunchala Hanumantha Rao delivering a speech on Vastu Science" 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-stone-900 to-transparent z-20">
                  <p className="text-gold-400 font-serif text-xl italic">"Architecture is the alignment of human life with cosmic geometry."</p>
                </div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-stone-800 p-6 rounded-2xl shadow-xl border border-stone-100 dark:border-stone-700 max-w-[240px]">
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 bg-gold-50 dark:bg-gold-900/30 rounded-full flex items-center justify-center text-gold-600 dark:text-gold-400">
                    <Globe size={24} />
                  </div>
                  <div>
                    <div className="font-bold text-2xl text-stone-900 dark:text-white">25+</div>
                    <div className="text-xs text-stone-500 uppercase tracking-wider font-semibold">Years of Mastery</div>
                  </div>
                </div>
              </div>
            </motion.div>

            <div className="space-y-8">
              <motion.div {...fadeUp}>
                <Typography variant="h2" className="mb-6">The Architect of Destiny</Typography>
                <div className="space-y-6 text-stone-600 dark:text-stone-300 text-lg leading-relaxed">
                  <p>
                    Known profoundly across the subcontinent as the <strong>"Vastu Jnani"</strong> and <strong>"Vastu Kala Samrat"</strong>, Dr. Kunchala Hanumantha Rao is not merely a consultant; he is a master of elemental forces. Operating from the prestigious MVP Colony in Visakhapatnam, his name is synonymous with profound, life-altering structural transformations.
                  </p>
                  <p>
                    Unlike traditional practitioners, Dr. Rao pioneers the field of <strong>Vastu Science & Technology</strong>. He possesses an unparalleled ability to decode the complex relationship between gravitational forces, magnetic fields, solar energy, and architectural design, ensuring that every home and business he touches becomes a magnet for prosperity and peace.
                  </p>
                  <p>
                    His deep, scientific approach has earned him a revered <strong>Doctorate from The Open International University for Complementary Medicines (Colombo)</strong>, cementing his status as a globally recognized authority in structural energy alignment.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      {/* Biography & Legacy (Wikipedia-style detailed section) */}
      <section className="py-24 relative bg-stone-50 dark:bg-stone-900/30">
        <Container size="md">
          <motion.div {...fadeUp} className="prose prose-lg dark:prose-invert prose-stone mx-auto">
            <Typography variant="h2" className="mb-8 text-center">Biography & Legacy</Typography>
            
            <h3 className="text-2xl font-serif font-bold text-gold-600 dark:text-gold-500 mt-12 mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">Early Vision & Foundation</h3>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 text-lg">
              Dr. Kunchala Hanumantha Rao's journey into the profound depths of Vastu Shastra began decades ago. Driven by an insatiable curiosity about the universe's energetic influence on human habitation, he dedicated his early years to the rigorous study of ancient Vedic scriptures, specifically those detailing structural engineering and cosmic geometry (Sthapatya Veda). Dissatisfied with the superstitious practices that often clouded traditional Vastu, Dr. Rao embarked on a mission to scientifically codify these ancient laws.
            </p>

            <h3 className="text-2xl font-serif font-bold text-gold-600 dark:text-gold-500 mt-12 mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">Establishment of HR Vasthu</h3>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 text-lg">
              Founding <strong>HR Vasthu</strong> in Visakhapatnam, Andhra Pradesh, Dr. Rao introduced the paradigm of <em>"Vastu Science & Technology."</em> He revolutionized the field by integrating modern architectural tools—such as magnetic compass precision analysis, solar pathway mapping, and geotechnical considerations—with traditional Vastu principles. His firm rapidly grew from a local consultancy into a nationally recognized authority, serving thousands of residential homeowners, massive industrial complexes, and corporate headquarters.
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 text-lg">
              Operating out of the MVP Colony and Pedda Waltair areas, his headquarters became a sanctuary for those seeking to resolve chronic financial, health, or personal struggles through architectural realignment. His methodology proved that harmonizing a structure's elemental balance directly influences the psychological and physiological well-being of its inhabitants.
            </p>

            <h3 className="text-2xl font-serif font-bold text-gold-600 dark:text-gold-500 mt-12 mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">Global Impact & Recognition</h3>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 text-lg">
              Dr. Rao's empirical success rate caught the attention of international academic and spiritual bodies. He was awarded a <strong>Doctorate of Science</strong> from The Open International University for Complementary Medicines in Colombo, Sri Lanka, an honor that formally validated his scientific approach to Vastu.
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 text-lg">
              Furthermore, his cross-border contributions to establishing harmony and peace through architectural consultation earned him the esteemed <strong>Nepal Sadbhavana Award</strong>. In the digital age, Dr. Rao expanded his reach globally, educating millions through his highly popular YouTube channel, where he demystifies Vastu concepts for the modern viewer, earning the monikers <em>"Vastu Jnani"</em> (The Knower of Vastu) and <em>"Vastu Kala Samrat"</em> (Emperor of Vastu Art).
            </p>

            <h3 className="text-2xl font-serif font-bold text-gold-600 dark:text-gold-500 mt-12 mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">The Philosophy of Vastu Science</h3>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 text-lg">
              At the core of Dr. Rao's teaching is the profound belief that a building is a living entity, constantly interacting with the Earth's electromagnetic field and cosmic radiation. He emphasizes that improper architectural layout—such as incorrect placement of structural weight, water bodies, or fire elements—creates energetic stagnation, manifesting as physical illnesses, financial blockages, or relational strife for the occupants.
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 text-lg">
              His unique philosophy strips away the esoteric mystery of Vastu and replaces it with logic. For instance, he explains the Vastu mandate for North-East water placement not as a religious edict, but as a scientific method to capture the beneficial morning ultraviolet rays, ensuring water purification and positive ionic circulation throughout the home. This rational, physics-based approach has made his counsel highly sought after by modern architects, engineers, and skeptic corporate leaders.
            </p>

            <h3 className="text-2xl font-serif font-bold text-gold-600 dark:text-gold-500 mt-12 mb-4 border-b border-stone-200 dark:border-stone-800 pb-2">Media, Authorship, & Public Influence</h3>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 text-lg">
              Understanding that individualized consultations could only help a limited number of people, Dr. Rao embarked on a massive public education campaign. He has authored comprehensive books detailing the application of Vastu in modern high-rise apartments and industrial complexes. His writings serve as primary textbooks for aspiring Vastu students worldwide.
            </p>
            <p className="text-stone-700 dark:text-stone-300 leading-relaxed mb-6 text-lg">
              Simultaneously, his presence on television and digital media has democratized Vastu knowledge. Through his hundreds of recorded video sessions, he tackles everyday architectural dilemmas, providing practical, cost-effective remedies for structural faults without requiring massive demolition. His ability to explain complex cosmic geometry in simple, relatable terms has cemented his legacy not just as a consultant, but as a beloved educator and the definitive voice of modern Vastu Shastra.
            </p>
          </motion.div>
        </Container>
      </section>

      {/* Honors & Accolades */}
      <section className="py-24 bg-stone-100 dark:bg-stone-950 relative">
        <Container>
          <motion.div {...fadeUp} className="text-center max-w-3xl mx-auto mb-16">
            <Typography variant="h2" className="mb-4">Honors & Titles</Typography>
            <Typography variant="body" className="text-lg">A lifetime dedicated to the perfection of spatial harmony has garnered international recognition and deeply respected titles from spiritual and academic institutions alike.</Typography>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Award size={32} />,
                title: "Vastu Jnani",
                desc: "The Knower of Vastu. A spiritual title bestowed for his profound, intuitive grasp of ancient architectural scriptures.",
                image: "/Gallery/Vaasthu Jnani Award.png"
              },
              {
                icon: <Star size={32} />,
                title: "Vastu Kala Samrat",
                desc: "The Emperor of Vastu Art. Recognizing his unmatched skill in blending aesthetic design with absolute elemental perfection.",
                image: "/Gallery/Vaasthu kala Samrat.png"
              },
              {
                icon: <BookOpen size={32} />,
                title: "Doctorate of Science",
                desc: "Awarded by The Open International University (Colombo) for his rigorous, scientific codification of Vastu principles.",
                image: "/Gallery/Doctorate Photo.png"
              },
              {
                icon: <Globe size={32} />,
                title: "Nepal Sadbhavana Award",
                desc: "A prestigious international honor acknowledging his cross-border impact in bringing peace through architectural harmony.",
                image: "/Gallery/Indo Nepal Award.png"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-stone-900 p-8 rounded-2xl shadow-lg border border-stone-100 dark:border-stone-800 hover:-translate-y-2 transition-transform duration-300 group overflow-hidden"
              >
                {/* Award thumbnail */}
                <div className="w-full aspect-[3/2] rounded-xl overflow-hidden mb-5 bg-stone-100 dark:bg-stone-800">
                  <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="w-12 h-12 bg-gold-50 dark:bg-gold-900/20 text-gold-600 dark:text-gold-400 rounded-xl flex items-center justify-center mb-4 shadow-inner">
                  {item.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white mb-3">{item.title}</h3>
                <p className="text-stone-600 dark:text-stone-400 text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* The Methodology */}
      <section className="py-24 relative overflow-hidden">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeUp} className="order-2 lg:order-1 space-y-8">
              <div>
                <Typography variant="h2" className="mb-6">The HR Vasthu Methodology</Typography>
                <p className="text-stone-600 dark:text-stone-300 text-lg leading-relaxed mb-6">
                  Dr. Rao does not rely on superstition; he relies on physics, astronomy, and ancient structural engineering. His consultations involve rigorous analysis of a property's magnetic axis, solar exposure, and wind flow patterns.
                </p>
              </div>

              <div className="space-y-6">
                {[
                  { icon: <Compass className="text-gold-500" />, title: "Directional Precision", text: "Micro-degree analysis of the earth's magnetic grid." },
                  { icon: <Building2 className="text-copper-500" />, title: "Commercial Mastery", text: "Transforming failing businesses into highly profitable ventures by realigning corporate energy centers." },
                  { icon: <MapPin className="text-stone-400" />, title: "Land Selection", text: "Identifying the precise energetic vibration of a plot before a single brick is laid." }
                ].map((feature, idx) => (
                  <div key={idx} className="flex gap-4 p-4 rounded-xl hover:bg-stone-50 dark:hover:bg-stone-900/50 transition-colors">
                    <div className="mt-1 bg-white dark:bg-stone-800 p-2 rounded-lg shadow-sm border border-stone-100 dark:border-stone-700 h-fit">
                      {feature.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-stone-900 dark:text-white mb-1">{feature.title}</h4>
                      <p className="text-stone-600 dark:text-stone-400 text-sm">{feature.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div {...fadeUp} className="order-1 lg:order-2">
              <div className="aspect-square rounded-full bg-gradient-to-tr from-gold-500/20 to-copper-500/20 p-8 relative animate-[spin_60s_linear_infinite]">
                <div className="absolute inset-4 rounded-full border-2 border-dashed border-gold-500/30"></div>
                <div className="absolute inset-12 rounded-full border border-copper-500/20"></div>
                <div className="w-full h-full rounded-full bg-[url('/Gallery/hero.png')] bg-cover bg-center shadow-2xl relative z-10 animate-[spin_60s_linear_infinite_reverse]"></div>
              </div>
            </motion.div>
          </div>
        </Container>
      </section>

    </div>
  );
};

export default About;
