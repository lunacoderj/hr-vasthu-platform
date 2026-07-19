import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Clock, MessageCircle, Send } from 'lucide-react';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Button } from '../../shared/components/ui';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: 'residential',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate WhatsApp redirect or form submission
    const text = `Hello Dr. Rao, I am ${formData.name}. I am looking for a ${formData.service} Vastu consultation. ${formData.message}`;
    window.open(`https://wa.me/919246624248?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-20">
      
      {/* Header */}
      <section className="pt-12 pb-16 text-center">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="display" className="mb-6">
              Connect With The Master
            </Typography>
            <Typography variant="body" className="text-xl max-w-2xl mx-auto text-stone-600 dark:text-stone-400">
              Transform your living or workspace into a magnet for cosmic prosperity. Reach out to Dr. Kunchala Hanumantha Rao for an expert consultation.
            </Typography>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column: Contact Cards */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white dark:bg-stone-900 rounded-3xl p-8 shadow-xl border border-stone-100 dark:border-stone-800 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <Typography variant="h3" className="mb-8">Direct Access</Typography>
              
              <div className="space-y-8 relative z-10">
                {/* Phone / WhatsApp */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-gold-50 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 flex items-center justify-center shrink-0 group-hover:bg-gold-500 group-hover:text-white transition-colors shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-1">Direct Line</h4>
                    <a href="tel:+919246624248" className="text-2xl font-serif text-stone-700 dark:text-stone-300 hover:text-gold-600 dark:hover:text-gold-500 transition-colors">
                      +91 92466 24248
                    </a>
                    <a 
                      href="https://wa.me/919246624248" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-500 font-medium hover:underline"
                    >
                      <MessageCircle size={16} /> Chat on WhatsApp
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center shrink-0 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-1">Headquarters</h4>
                    <p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
                      MVP Colony / Pedda Waltair<br />
                      Visakhapatnam, Andhra Pradesh<br />
                      India
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center shrink-0 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors shadow-sm">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-1">Consultation Hours</h4>
                    <p className="text-lg text-stone-700 dark:text-stone-300">
                      Mon - Sat: 9:00 AM - 6:00 PM<br />
                      <span className="text-sm text-stone-500">Prior appointment required for in-person visits.</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-12 shadow-xl border border-stone-100 dark:border-stone-800 h-full"
            >
              <Typography variant="h3" className="mb-2">Request Consultation</Typography>
              <p className="text-stone-500 dark:text-stone-400 mb-8">Fill out the form below and Dr. Rao's team will get back to you promptly to schedule your session.</p>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Full Name</label>
                    <input 
                      type="text" 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Phone Number</label>
                    <input 
                      type="tel" 
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all"
                      placeholder="+91"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Consultation Type</label>
                  <select 
                    value={formData.service}
                    onChange={(e) => setFormData({...formData, service: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all text-stone-700 dark:text-stone-300"
                  >
                    <option value="residential">Residential Vastu</option>
                    <option value="commercial">Commercial / Business Vastu</option>
                    <option value="industrial">Industrial Factory Vastu</option>
                    <option value="plot">Plot / Land Selection</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-stone-700 dark:text-stone-300">Additional Details (Optional)</label>
                  <textarea 
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                    className="w-full px-4 py-3 bg-stone-50 dark:bg-stone-950 border border-stone-200 dark:border-stone-800 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all resize-none"
                    placeholder="Tell us briefly about the property..."
                  />
                </div>

                <Button type="submit" size="lg" className="w-full" icon={<Send size={18} />} iconPosition="right">
                  Send via WhatsApp
                </Button>
              </form>
            </motion.div>
          </div>

        </div>
      </Container>
    </div>
  );
};

export default Contact;
