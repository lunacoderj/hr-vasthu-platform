import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Clock, MessageCircle, Send, Mail, Globe, Award, Star, ExternalLink, CheckCircle2, Loader2 } from 'lucide-react';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { supabase } from '../../core/services/supabase';
import { useTranslation } from '../../core/hooks/useTranslation';

const WHATSAPP_NUMBER = '919246624248';

export const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'residential',
    message: ''
  });
  const [sendStatus, setSendStatus] = useState<'idle' | 'sending' | 'sent'>('idle');
  const { t } = useTranslation();

  const handleWhatsAppSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSendStatus('sending');

    const text = `Hello Dr. Rao, I am ${formData.name}. I am looking for a ${formData.service} Vastu consultation. ${formData.message}`;

    // Log to admin dashboard
    try {
      await supabase.from('bookings').insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        consultation_type: formData.service,
        message: formData.message || null,
        status: 'whatsapp_redirect',
        source: 'contact_page_whatsapp',
      });
    } catch { /* best effort */ }

    setTimeout(() => {
      setSendStatus('sent');
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    }, 800);

    setTimeout(() => setSendStatus('idle'), 3000);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-[#0a0a0f] py-20 relative overflow-hidden">
      {/* Liquid blobs */}
      <div className="liquid-mesh-blob w-[500px] h-[500px] bg-gold-400/15 top-[-150px] left-[-100px]" style={{ animationDuration: '25s' }}></div>
      <div className="liquid-mesh-blob w-[400px] h-[400px] bg-emerald-400/10 bottom-[-100px] right-[-80px]" style={{ animationDuration: '20s', animationDelay: '5s' }}></div>

      {/* Header */}
      <section className="pt-12 pb-16 text-center relative z-10">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gold-400/30 bg-gold-400/10 mb-6">
              <Star size={14} className="text-gold-500" />
              <span className="text-gold-600 dark:text-gold-400 text-xs font-semibold tracking-[0.2em] uppercase">{t('nepalAward')}</span>
            </div>
            <Typography variant="display" className="mb-6">
              {t('connectWithMaster')}
            </Typography>
            <Typography variant="body" className="text-xl max-w-2xl mx-auto text-stone-600 dark:text-stone-400">
              {t('transformSpace')}
            </Typography>
          </motion.div>
        </Container>
      </section>

      {/* Main Content */}
      <Container size="xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10">
          
          {/* Left Column: Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="glass-bento rounded-3xl p-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gold-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              
              <Typography variant="h3" className="mb-8">{t('directAccess')}</Typography>
              
              <div className="space-y-8 relative z-10">
                {/* Phone / WhatsApp */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-gold-50 dark:bg-gold-900/30 text-gold-600 dark:text-gold-400 flex items-center justify-center shrink-0 group-hover:bg-gold-500 group-hover:text-white transition-colors shadow-sm">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-1">{t('directLine')}</h4>
                    <a href="tel:+919246624248" className="text-2xl font-serif text-stone-700 dark:text-stone-300 hover:text-gold-600 dark:hover:text-gold-500 transition-colors">
                      +91 92466 24248
                    </a>
                    <a 
                      href={`https://wa.me/${WHATSAPP_NUMBER}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="mt-2 inline-flex items-center gap-1.5 text-sm text-green-600 dark:text-green-500 font-medium hover:underline"
                    >
                      <MessageCircle size={16} /> {t('whatsappChat')}
                    </a>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-500 group-hover:text-white transition-colors shadow-sm">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-1">{t('emailAddress')}</h4>
                    <a href="mailto:hrvasthu@gmail.com" className="text-lg text-stone-700 dark:text-stone-300 hover:text-indigo-600 transition-colors">
                      hrvasthu@gmail.com
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center shrink-0 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors shadow-sm">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-1">{t('headquarters')}</h4>
                    <p className="text-lg text-stone-700 dark:text-stone-300 leading-relaxed">
                      MVP Colony / Pedda Waltair<br />
                      Visakhapatnam, Andhra Pradesh<br />
                      India — 530017
                    </p>
                  </div>
                </div>

                {/* Hours */}
                <div className="flex items-start gap-5 group">
                  <div className="w-12 h-12 rounded-2xl bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 flex items-center justify-center shrink-0 group-hover:bg-stone-200 dark:group-hover:bg-stone-700 transition-colors shadow-sm">
                    <Clock size={24} />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 dark:text-white uppercase tracking-wider mb-1">{t('consultationHours')}</h4>
                    <p className="text-lg text-stone-700 dark:text-stone-300">
                      Mon - Sat: 9:00 AM - 6:00 PM<br />
                      <span className="text-sm text-stone-500">Prior appointment required for in-person visits.</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Accolades Badge Card */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="clay-card-gold rounded-3xl p-6"
            >
              <div className="flex items-center gap-4">
                <Award size={32} />
                <div>
                  <p className="font-serif font-bold text-lg">Nepal Sadbhavana Award</p>
                  <p className="text-sm text-white/80">Recognized for cross-border contributions to harmony through Vastu science</p>
                </div>
              </div>
            </motion.div>

            {/* YouTube CTA */}
            <motion.a
              href="https://www.youtube.com/@hrvasthu"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="clay-card-rose rounded-3xl p-6 flex items-center gap-4 hover:scale-[1.02] transition-transform cursor-pointer"
            >
              <Globe size={28} />
              <div>
                <p className="font-serif font-bold text-lg">{t('youtubeChannel')}</p>
                <p className="text-sm text-white/80 flex items-center gap-1">{t('watchFreeLessons')} <ExternalLink size={12} /></p>
              </div>
            </motion.a>
          </div>

          {/* Right Column: WhatsApp Form */}
          <div className="lg:col-span-7">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="glass-bento rounded-3xl p-8 md:p-12 h-full relative overflow-hidden"
            >
              <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-green-500/10 rounded-full blur-3xl"></div>

              <Typography variant="h3" className="mb-2">{t('sendViaWhatsApp')}</Typography>
              <p className="text-stone-500 dark:text-stone-400 mb-8">Fill out the form and we'll redirect you to WhatsApp. Your details will also be forwarded to the admin dashboard.</p>
              
              <AnimatePresence mode="wait">
                {sendStatus === 'sent' ? (
                  <motion.div
                    key="sent"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-16"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: [0, 1.3, 1] }}
                      transition={{ duration: 0.5 }}
                      className="w-20 h-20 rounded-full clay-card-emerald flex items-center justify-center mb-6"
                    >
                      <CheckCircle2 size={36} />
                    </motion.div>
                    <p className="text-xl font-serif font-bold text-stone-900 dark:text-white">{t('messageSent')}</p>
                    <p className="text-sm text-stone-500 mt-2">{t('redirectedToWhatsApp')}</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form"
                    onSubmit={handleWhatsAppSubmit}
                    className="space-y-6 relative z-10"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">{t('fullName')} *</label>
                        <input 
                          type="text" 
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                          className="w-full px-4 py-3 bg-stone-100/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all text-stone-900 dark:text-white"
                          placeholder="Your name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">{t('phoneNumber')} *</label>
                        <input 
                          type="tel" 
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                          className="w-full px-4 py-3 bg-stone-100/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all text-stone-900 dark:text-white"
                          placeholder="+91"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">Email <span className="text-stone-400 normal-case">(optional)</span></label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-100/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all text-stone-900 dark:text-white"
                        placeholder="you@example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">{t('consultationType')}</label>
                      <select 
                        value={formData.service}
                        onChange={(e) => setFormData({...formData, service: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-100/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all text-stone-900 dark:text-white"
                      >
                        <option value="residential">Residential Vastu</option>
                        <option value="commercial">Commercial / Business Vastu</option>
                        <option value="industrial">Industrial Factory Vastu</option>
                        <option value="plot">Plot / Land Selection</option>
                        <option value="apartment">Apartment / Flat Vastu</option>
                        <option value="temple">Temple / Religious Vastu</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-stone-600 dark:text-stone-400 uppercase tracking-wider">{t('additionalDetails')} <span className="text-stone-400 normal-case">(optional)</span></label>
                      <textarea 
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                        className="w-full px-4 py-3 bg-stone-100/80 dark:bg-stone-800/50 border border-stone-200 dark:border-stone-700 rounded-xl focus:ring-2 focus:ring-gold-500 focus:outline-none transition-all resize-none text-stone-900 dark:text-white"
                        placeholder="Tell us briefly about the property..."
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={sendStatus === 'sending'}
                      className="w-full py-4 rounded-xl clay-card-emerald font-bold text-sm tracking-wide flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-transform cursor-pointer disabled:opacity-70"
                    >
                      {sendStatus === 'sending' ? (
                        <><Loader2 size={18} className="animate-spin" /> {t('sending')}</>
                      ) : (
                        <><Send size={18} /> {t('sendViaWhatsApp')}</>
                      )}
                    </button>

                    <p className="text-xs text-center text-stone-400 dark:text-stone-500">
                      {t('clientMessageMeta')}
                    </p>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Contact;
