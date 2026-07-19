import React from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MapPin, Phone } from 'lucide-react';
import { Container } from '../layout/Container';
import { Newsletter } from './Newsletter';

const footerLinks = {
  platform: [
    { name: 'Home', href: '/' },
    { name: 'Videos', href: '/videos' },
    { name: 'Books', href: '/books' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Blog', href: '/blog' },
  ],
  support: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Book Appointment', href: '/appointment' },
    { name: 'Privacy Policy', href: '/privacy' },
    { name: 'Terms of Service', href: '/terms' },
  ],
};

const socialLinks = [
  { name: 'Facebook', icon: Globe, href: '#' },
  { name: 'Twitter', icon: Globe, href: '#' },
  { name: 'Instagram', icon: Globe, href: '#' },
  { name: 'YouTube', icon: Globe, href: '#' },
];

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0a0a0f] border-t border-[#d4720a]/10 relative z-10 transition-colors">
      <Container size="xl">
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            
            {/* Brand & Contact (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              <Link to="/" className="inline-block">
                <span className="font-serif text-2xl font-bold text-white tracking-tight">
                  HR <span className="text-[#d4720a] bg-clip-text text-transparent bg-gradient-to-r from-[#d4720a] to-[#e68a1c]">Vasthu</span>
                </span>
              </Link>
              <p className="text-stone-400 text-sm max-w-sm">
                Empowering your life with ancient Vastu wisdom. Harmonize your space, attract prosperity, and align with cosmic energies.
              </p>
              
              <ul className="space-y-3 text-sm text-stone-400">
                <li className="flex items-start space-x-3">
                  <MapPin size={18} className="text-[#d4720a] shrink-0 mt-0.5" />
                  <span>123 Spiritual Avenue, Hyderabad, Telangana, India 500001</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Phone size={18} className="text-[#d4720a] shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
                <li className="flex items-center space-x-3">
                  <Mail size={18} className="text-[#d4720a] shrink-0" />
                  <span>support@hrvasthu.com</span>
                </li>
              </ul>
            </div>

            {/* Platform Links (2 cols) */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Platform
              </h3>
              <ul className="space-y-3">
                {footerLinks.platform.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-stone-400 hover:text-[#d4720a] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links (2 cols) */}
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                Support
              </h3>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-sm text-stone-400 hover:text-[#d4720a] transition-colors"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Newsletter (4 cols) */}
            <div className="lg:col-span-4">
              <Newsletter />
              
              <div className="mt-8">
                <h3 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">
                  Follow Us
                </h3>
                <div className="flex space-x-4">
                  {socialLinks.map((social) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={social.name}
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-stone-400 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-[#d4720a]/20 border border-white/5"
                        aria-label={social.name}
                      >
                        <Icon size={18} />
                      </a>
                    );
                  })}
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-[#d4720a]/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm text-stone-500 text-center md:text-left">
            &copy; {currentYear} HR Vasthu Digital Platform. All rights reserved.
          </p>
          <div className="flex space-x-4 text-sm text-stone-500">
            <Link to="/privacy" className="hover:text-[#d4720a] transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-[#d4720a] transition-colors">Terms</Link>
          </div>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
