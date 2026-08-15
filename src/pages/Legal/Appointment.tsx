import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Calendar, Phone, MessageCircle, Send, CheckCircle2, Award, Clock, MapPin } from 'lucide-react';
import { supabase } from '../../core/services/supabase';

const WHATSAPP_NUMBER = '919246624248';

export const Appointment: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'residential',
    date: '',
    timeSlot: 'morning',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');

    try {
      await supabase.from('bookings').insert({
        name: formData.name,
        phone: formData.phone,
        email: formData.email || null,
        consultation_type: `${formData.service} (Preferred Date: ${formData.date || 'Flexible'}, Slot: ${formData.timeSlot})`,
        message: formData.message || null,
        status: 'appointment_requested',
        source: 'appointment_page',
      });
    } catch {
      /* best effort */
    }

    const whatsappMessage = `*New Vastu Consultation Appointment Request*\n\n` +
      `👤 *Name:* ${formData.name}\n` +
      `📞 *Phone:* ${formData.phone}\n` +
      `🏠 *Type:* ${formData.service}\n` +
      `📅 *Preferred Date:* ${formData.date || 'Earliest available'}\n` +
      `⏰ *Time Slot:* ${formData.timeSlot}\n` +
      `📝 *Details:* ${formData.message || 'Consultation request via website'}`;

    setStatus('success');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-20">
      <Helmet>
        <title>Book Vastu Consultation Appointment | Dr. Kunchala Hanumantha Rao</title>
        <meta name="description" content="Schedule a personal or on-site Vastu consultation with Dr. Kunchala Hanumantha Rao for home, apartment, commercial, or industrial properties." />
        <link rel="canonical" href="https://hrvasthu.com/appointment" />
      </Helmet>

      <Container size="lg">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-gold-500/10 text-gold-600 dark:text-gold-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border border-gold-500/20">
              <Calendar size={14} /> Official Consultation Schedule
            </div>
            <Typography variant="h1" className="text-3xl md:text-5xl font-serif font-bold text-stone-900 dark:text-white">
              Book an Appointment
            </Typography>
            <p className="text-stone-600 dark:text-stone-400 max-w-xl mx-auto text-base">
              Direct consultation with <strong>Dr. Kunchala Hanumantha Rao</strong> (Vastu Jnani & Nepal Sadbhavana Awardee).
            </p>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl p-8 md:p-10 border border-stone-200 dark:border-stone-800 shadow-xl">
            {status === 'success' ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">Appointment Request Sent!</h3>
                <p className="text-stone-600 dark:text-stone-400 max-w-md mx-auto text-sm">
                  We have redirected your request directly to Dr. Rao's official WhatsApp. Our team will confirm your consultation slot shortly.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  className="px-6 py-2.5 bg-gold-600 text-white rounded-xl font-semibold text-sm hover:bg-gold-500 transition-colors"
                >
                  Book Another Consultation
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Ramesh Sharma"
                      className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">Phone / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">Consultation Type</label>
                    <select
                      value={formData.service}
                      onChange={e => setFormData({ ...formData, service: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                    >
                      <option value="Residential House Vastu">Residential House / Villa</option>
                      <option value="Apartment / Flat Vastu">Apartment / Flat</option>
                      <option value="Commercial / Shop Vastu">Commercial Office / Shop</option>
                      <option value="Industrial / Factory Vastu">Industrial / Factory Plot</option>
                      <option value="Plot / Site Selection Vastu">Open Plot / Site Verification</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">Preferred Consultation Date</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={e => setFormData({ ...formData, date: e.target.value })}
                      className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-2">Property Details / Specific Queries</label>
                  <textarea
                    rows={4}
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Mention house facing (East/North/South/West), main door issues, kitchen location, or specific concerns..."
                    className="w-full p-3.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-gold-500 outline-none text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="w-full py-4 bg-gradient-to-r from-gold-600 to-amber-500 text-white font-bold rounded-xl shadow-lg hover:shadow-gold-500/20 hover:scale-[1.01] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle size={20} />
                  <span>{status === 'submitting' ? 'Confirming Appointment...' : 'Submit & Connect via WhatsApp'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Appointment;
