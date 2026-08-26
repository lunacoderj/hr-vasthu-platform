import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, MapPin, Phone, PlaySquare, Globe, Compass, ShieldCheck } from 'lucide-react';
import { Container } from '../layout/Container';
import { Newsletter } from './Newsletter';

const footerLinks = {
  platform: [
    { name: 'Home', href: '/' },
    { name: 'Vasthu Drawings & Plans', href: '/drawings' },
    { name: 'Videos', href: '/videos' },
    { name: 'Shorts', href: '/shorts' },
    { name: 'Books Library', href: '/books' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Vastu Blog', href: '/blog' },
  ],
  support: [
    { name: 'About Dr. Rao', href: '/about' },
    { name: 'Contact & Location', href: '/contact' },
    { name: 'Book Appointment', href: '/appointment' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
    { name: 'Vastu Disclaimer', href: '/disclaimer' },
  ],
};

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0f] border-t border-[#d4720a]/15 relative z-10 transition-colors text-stone-300">
      <Container size="xl">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand & Verified Address (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Link to="/" className="inline-block">
                <span className="font-serif text-2xl font-bold text-white tracking-tight">
                  HR <span className="text-[#d4720a] bg-clip-text text-transparent bg-gradient-to-r from-[#d4720a] to-[#e68a1c]">Vasthu</span>
                </span>
                <p className="text-[10px] uppercase tracking-widest text-[#d4720a] font-semibold mt-0.5">Vasthu Siddanthi Dr. Hanumanthu Rao</p>
              </Link>
              <p className="text-stone-400 text-sm max-w-sm leading-relaxed">
                Official online platform to connect with renowned <strong>Vasthu Siddanthi Dr. Kunchala Hanumanthu Rao</strong> (వాస్తు సిద్ధాంతి). Empowering lives through authentic Vedic Vastu Shastra, personalized house plans, and spatial harmony.
              </p>
              
              <ul className="space-y-3 text-sm text-stone-400">
                <li className="flex items-start space-x-3">
                  <MapPin size={18} className="text-[#d4720a] shrink-0 mt-0.5" />
                  <span>Opposite Rama Lakshmi Apartments, Pedda Waltair, Visakhapatnam, Andhra Pradesh, India — 530017</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone size={18} className="text-[#d4720a] shrink-0" />
                  <a href="tel:+919246624248" className="hover:text-[#d4720a] transition-colors font-medium text-white">+91 92466 24248</a>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail size={18} className="text-[#d4720a] shrink-0" />
                  <a href="mailto:hrvasthu9@gmail.com" className="hover:text-[#d4720a] transition-colors">hrvasthu9@gmail.com</a>
                </li>
              </ul>
            </div>

            {/* Platform Links (2 cols) */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-[#d4720a]">
                Explore Vastu
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-stone-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal & Support Links (2 cols) */}
            <div className="lg:col-span-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-4 text-[#d4720a]">
                Consult & Legal
              </h3>
              <ul className="space-y-2.5">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-stone-400 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter & Official Links (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Newsletter />
              
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-3 text-[#d4720a]">
                  Official YouTube & Media
                </h3>
                <div className="flex space-x-3">
                  <a
                    href="https://www.youtube.com/channel/UCgCijg9nTzivoeszshGjzzQ"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 bg-white/5 hover:bg-red-600/20 text-stone-300 hover:text-red-400 border border-white/10 rounded-xl transition-all text-xs font-semibold"
                  >
                    <PlaySquare size={16} className="text-red-500" />
                    <span>YouTube Channel</span>
                  </a>
                  <Link
                    to="/appointment"
                    className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-gold-600 to-amber-500 text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 transition-transform"
                  >
                    <Compass size={14} />
                    <span>Book Appointment</span>
                  </Link>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* District & City Consultation Coverage Strip */}
        <div className="py-6 border-t border-stone-800/80 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-gold-400">
            <Compass size={14} className="text-[#d4720a]" />
            <span>Vasthu Consultations Across All Andhra Pradesh &amp; Telangana Districts:</span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            <strong>Headquarters:</strong> Visakhapatnam (Pedda Waltair, Gajuwaka, Madhurawada, Pendurthi, Anakapalli). <br className="hidden sm:block" />
            <strong>Andhra Pradesh Districts &amp; Cities:</strong> Vijayawada, Guntur, Tirupati, Rajahmundry, Kakinada, Nellore, Kurnool, Kadapa, Anantapur, Srikakulam, Vizianagaram, Eluru, Ongole, Machilipatnam, Bhimavaram, Tenali, Proddatur, Chittoor, Nandyal, Hindupur, Srikalahasti, Narasaraopet, Bapatla, Chirala, Tadepalligudem, Tanuku, Amalapuram, Kavali, Gudur. <br className="hidden sm:block" />
            <strong>Telangana &amp; Global:</strong> Hyderabad, Secunderabad, Warangal, Karimnagar, Khammam, Nizamabad &amp; Worldwide Digital CAD Consultations.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-stone-800 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-xs text-stone-500">
          <p className="text-center md:text-left">
            &copy; {currentYear} HR Vasthu Digital Platform. All rights reserved. Directed by Dr. Kunchala Hanumantha Rao (Vasthu Siddanthi).
          </p>
          <div className="flex space-x-6">
            <Link to="/privacy" className="hover:text-stone-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-stone-300 transition-colors">Terms of Service</Link>
            <Link to="/disclaimer" className="hover:text-stone-300 transition-colors">Vastu Disclaimer</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
