import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, MessageCircle, ArrowRight, Star, Compass, CheckCircle2, Building, Globe } from 'lucide-react';
import { Container } from '../../../shared/components/layout/Container';
import Typography from '../../../shared/components/content/Typography';
import { Link } from 'react-router-dom';

interface RegionZone {
  id: string;
  name: string;
  nameTelugu: string;
  description: string;
  cities: string[];
  highlight: string;
}

const REGION_ZONES: RegionZone[] = [
  {
    id: 'vizag-north',
    name: 'Visakhapatnam & North Coastal AP',
    nameTelugu: 'విశాఖపట్నం & ఉత్తరాంధ్ర జిల్లాలు',
    description: 'Home to our Global Headquarters. Complete on-site residential, commercial & factory consultations.',
    cities: [
      'Visakhapatnam (HQ)', 'Gajuwaka', 'Madhurawada', 'Pendurthi', 
      'Anakapalli', 'Vizianagaram', 'Srikakulam', 'Bobbili', 'Salur', 'Narsipatnam'
    ],
    highlight: 'Headquarters & Same-Day Onsite Visits'
  },
  {
    id: 'godavari',
    name: 'East & West Godavari Districts',
    nameTelugu: 'తూర్పు & పశ్చిమ గోదావరి జిల్లాలు',
    description: 'Authentic Vedic house drawings, agricultural land orientation & commercial vastu.',
    cities: [
      'Kakinada', 'Rajahmundry', 'Amalapuram', 'Eluru', 
      'Bhimavaram', 'Tanuku', 'Tadepalligudem', 'Palakollu', 'Jangareddygudem', 'Ravulapalem'
    ],
    highlight: 'Comprehensive Plot & House Planning'
  },
  {
    id: 'krishna-guntur',
    name: 'Krishna & Guntur (Capital Region)',
    nameTelugu: 'కృష్ణా & గుంటూరు (రాజధాని ప్రాంతం)',
    description: 'High-density commercial complexes, apartments, multi-story buildings & residential duplexes.',
    cities: [
      'Vijayawada', 'Guntur', 'Amaravati', 'Mangalagiri', 
      'Tenali', 'Machilipatnam', 'Gudivada', 'Narasaraopet', 'Bapatla', 'Chilakaluripet'
    ],
    highlight: 'Vastu Drawings for Builders & Duplexes'
  },
  {
    id: 'prakasam-nellore',
    name: 'Prakasam & Nellore Districts',
    nameTelugu: 'ప్రకాశం & నెల్లూరు జిల్లాలు',
    description: 'Plot shape corrections (Veedi Potu), borewell directions & industrial layout designs.',
    cities: [
      'Nellore', 'Ongole', 'Kavali', 'Gudur', 
      'Chirala', 'Markapur', 'Kandukur', 'Venkatagiri', 'Sullurpeta', 'Naidupeta'
    ],
    highlight: 'Remedies without Structural Demolition'
  },
  {
    id: 'rayalaseema',
    name: 'Rayalaseema Region Districts',
    nameTelugu: 'రాయలసీమ జిల్లాలు',
    description: 'Sacred temple architecture alignment, residential construction & spiritual harmony.',
    cities: [
      'Tirupati', 'Kurnool', 'Kadapa', 'Anantapur', 
      'Chittoor', 'Nandyal', 'Madanapalle', 'Proddatur', 'Hindupur', 'Srikalahasti'
    ],
    highlight: 'Sacred Geomagnetic Alignment'
  },
  {
    id: 'telangana-global',
    name: 'Telangana & Global Consultations',
    nameTelugu: 'తెలంగాణ & అంతర్జాతీయ సంప్రదింపులు',
    description: 'Dedicated consultation network across Telangana cities and worldwide NRI digital consultations.',
    cities: [
      'Hyderabad', 'Secunderabad', 'Warangal', 'Karimnagar', 
      'Khammam', 'Nizamabad', 'USA', 'UK', 'Australia', 'UAE / Gulf'
    ],
    highlight: 'Video Call & Online CAD Verification'
  }
];

export const DistrictCoverage: React.FC = () => {
  const [activeZone, setActiveZone] = useState<string>('vizag-north');

  const currentZone = REGION_ZONES.find(z => z.id === activeZone) || REGION_ZONES[0];

  return (
    <section className="py-24 bg-gradient-to-b from-stone-900/60 via-stone-950/80 to-stone-900/60 border-y border-[#d4720a]/20 relative overflow-hidden text-stone-200">
      {/* Glow effects */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#d4720a]/10 rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-[#e68a1c]/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      <Container size="xl">
        {/* Section Header */}
        <div className="text-center max-w-4xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-[#d4720a]/20 to-[#e68a1c]/10 border border-[#d4720a]/40 text-[#e68a1c] px-5 py-1.5 rounded-full text-xs md:text-sm font-semibold shadow-sm">
            <Star size={16} className="text-[#d4720a] fill-[#d4720a]" />
            <span className="tracking-wide uppercase">30+ Years Supreme Mastery · #1 in Andhra Pradesh &amp; Telangana</span>
          </div>

          <Typography variant="h2" className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
            Best &amp; Most Experienced Vasthu Siddanthi in <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#d4720a] via-[#f59e0b] to-[#fbbf24]">
              Vizag &amp; Across All Andhra Pradesh Districts
            </span>
          </Typography>

          <p className="text-stone-300 text-base md:text-lg font-light max-w-3xl mx-auto leading-relaxed">
            విశాఖపట్నం (హెడ్ క్వార్టర్స్) కేంద్రంగా ఆంధ్రప్రదేశ్ మరియు తెలంగాణలోని ప్రతీ జిల్లా మరియు నగరంలోని వేలాది గృహాలు, వ్యాపార సంస్థలకు ప్రత్యక్ష వాస్తు సలహాలు, ప్లాన్స్ అందించిన ప్రముఖ సిద్ధాంతి <strong>డాక్టర్ కుంచాల హనుమంతరావు గారు</strong>.
          </p>
        </div>

        {/* Region Zone Tabs */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-3 mb-10">
          {REGION_ZONES.map((zone) => {
            const isSelected = activeZone === zone.id;
            return (
              <button
                key={zone.id}
                onClick={() => setActiveZone(zone.id)}
                className={`px-4 py-2.5 rounded-2xl text-xs md:text-sm font-semibold transition-all duration-300 cursor-pointer flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#d4720a] to-[#e68a1c] text-white border-[#d4720a] shadow-lg shadow-[#d4720a]/30 scale-105'
                    : 'bg-stone-900/80 hover:bg-stone-800 text-stone-300 border-stone-800 hover:border-[#d4720a]/40'
                }`}
              >
                <MapPin size={15} className={isSelected ? 'text-white' : 'text-[#d4720a]'} />
                <span>{zone.name.split('&')[0]}</span>
              </button>
            );
          })}
        </div>

        {/* Selected Zone Showcase Bento Card */}
        <motion.div
          key={currentZone.id}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-stone-900/90 border border-[#d4720a]/30 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Region Info */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#d4720a]/15 text-[#e68a1c] text-xs font-bold border border-[#d4720a]/30">
                <Compass size={14} />
                <span>{currentZone.highlight}</span>
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">
                  {currentZone.name}
                </h3>
                <p className="text-gold-400 font-serif text-base font-semibold">
                  {currentZone.nameTelugu}
                </p>
              </div>

              <p className="text-stone-300 text-base font-light leading-relaxed">
                {currentZone.description}
              </p>

              {/* Verified Trust Points */}
              <ul className="space-y-2.5 text-sm text-stone-300">
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-[#d4720a] shrink-0" />
                  <span>100% Scientific Vedic Layouts tailored to local directional degrees</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-[#d4720a] shrink-0" />
                  <span>Personal direct consultation by Dr. Kunchala Hanumanthu Rao</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckCircle2 size={18} className="text-[#d4720a] shrink-0" />
                  <span>Remedies for Road Focus (Veedi Potu) &amp; plot shape defects without demolition</span>
                </li>
              </ul>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/appointment"
                  className="px-6 py-3 bg-gradient-to-r from-gold-600 via-amber-500 to-gold-500 text-white rounded-full text-xs md:text-sm font-bold shadow-lg hover:shadow-gold-500/20 hover:scale-105 transition-all flex items-center gap-2"
                >
                  <span>Book Consultation in {currentZone.name.split(' ')[0]}</span>
                  <ArrowRight size={16} />
                </Link>

                <a
                  href={`https://wa.me/919246624248?text=${encodeURIComponent(`Namaste Dr. Rao, I am contacting you from ${currentZone.name}. I need Vastu consultation for my house/plot.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full text-xs md:text-sm font-bold shadow-md hover:scale-105 transition-all flex items-center gap-2"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp Plot Review</span>
                </a>
              </div>
            </div>

            {/* Right: City Chips Grid */}
            <div className="lg:col-span-6 bg-stone-950/70 border border-stone-800 rounded-2xl p-6 md:p-8 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gold-400">
                  Covered Cities &amp; Towns
                </span>
                <span className="text-xs text-stone-400">
                  {currentZone.cities.length} Priority Locations
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {currentZone.cities.map((city, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-900/80 border border-stone-800/80 hover:border-[#d4720a]/50 hover:bg-stone-800/80 transition-all text-xs font-medium text-stone-200"
                  >
                    <Building size={13} className="text-[#d4720a] shrink-0" />
                    <span className="truncate">{city}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
                <span className="flex items-center gap-1.5">
                  <Phone size={14} className="text-[#d4720a]" />
                  <span>Direct Hotline: <strong className="text-white">+91 92466 24248</strong></span>
                </span>
                <span className="text-gold-400 font-medium">
                  On-site &amp; Online Available
                </span>
              </div>
            </div>

          </div>
        </motion.div>
      </Container>
    </section>
  );
};
