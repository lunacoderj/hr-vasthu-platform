import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { 
  Calendar, 
  Phone, 
  MessageCircle, 
  CheckCircle2, 
  Award, 
  Clock, 
  MapPin, 
  Video, 
  Sparkles, 
  Gift, 
  Lock, 
  ArrowRight, 
  Download,
  Building,
  Compass,
  Layers,
  ShieldCheck
} from 'lucide-react';
import { consultationService } from '../../core/services/consultation.service';
import { cashfreeService } from '../../core/services/cashfree.service';

const WHATSAPP_NUMBER = '919246624248';

export const Appointment: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    service: 'Residential House / Villa',
    platform: 'whatsapp_video' as 'whatsapp_video' | 'google_meet',
    date: '',
    timeSlot: 'morning',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'processing' | 'verifying' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [complimentaryBooks, setComplimentaryBooks] = useState<Array<{ title: string; pdfUrl: string }>>([]);

  useEffect(() => {
    cashfreeService.loadSDK().catch(() => {});
  }, []);

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d+]/g, '');
    setFormData(prev => ({ ...prev, phone: raw }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const digitsOnly = formData.phone.replace(/\D/g, '');
    const clean10 = digitsOnly.length === 12 && digitsOnly.startsWith('91') 
      ? digitsOnly.slice(2) 
      : digitsOnly;

    if (!clean10 || clean10.length !== 10 || !/^[6-9]\d{9}$/.test(clean10)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g. 9246624248).');
      return;
    }

    setStatus('processing');

    try {
      // 1. Create Cashfree Production Order (₹999)
      const orderRes = await consultationService.createOrder({
        name: formData.name.trim(),
        mobile: clean10,
        email: formData.email.trim() || undefined,
        consultationType: `Online Vastu Consultation (${formData.service})`,
        preferredPlatform: formData.platform,
        preferredDate: formData.date || undefined,
        preferredTimeSlot: formData.timeSlot,
        propertyDetails: formData.message.trim() || undefined,
      });

      if (!orderRes.success || !orderRes.orderId) {
        throw new Error('Failed to create consultation payment order. Please try again.');
      }

      setOrderId(orderRes.orderId);
      setStatus('verifying');

      // 2. Launch Cashfree Checkout SDK
      if (orderRes.paymentSessionId) {
        try {
          await cashfreeService.launchCheckout({
            paymentSessionId: orderRes.paymentSessionId,
          });
        } catch (cfErr: any) {
          console.warn('[Appointment] Checkout SDK notice:', cfErr);
          throw new Error('Payment was cancelled or closed. Please complete payment to confirm your video consultation.');
        }
      } else {
        throw new Error('Payment session could not be established.');
      }

      // 3. Verify Payment
      const verifyRes = await consultationService.verifyPayment(orderRes.orderId);
      if (verifyRes.success && verifyRes.paymentStatus === 'PAID') {
        setStatus('success');
        if (verifyRes.complimentaryBooks && verifyRes.complimentaryBooks.length > 0) {
          setComplimentaryBooks(verifyRes.complimentaryBooks);
        } else {
          setComplimentaryBooks([
            {
              title: 'Vijayabata Vaasthu Book (Authoritative Edition)',
              pdfUrl: '/books/Vijayabata Vaasthu Book English.pdf'
            }
          ]);
        }
      } else {
        throw new Error(verifyRes.message || 'Payment has not been completed or is still pending.');
      }
    } catch (err: any) {
      console.error('[Appointment] Payment error:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Payment failed or was cancelled. Please try again.');
      setStatus('idle');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `*Online Vastu Consultation Booking Confirmed (₹999)*\n\n` +
    `👤 *Name:* ${formData.name || 'Client'}\n` +
    `📞 *Phone:* ${formData.phone}\n` +
    `📱 *Platform:* ${formData.platform === 'google_meet' ? 'Google Meet' : 'WhatsApp Video Call'}\n` +
    `📅 *Preferred Date:* ${formData.date || 'Earliest Available'}\n` +
    `⏰ *Slot:* ${formData.timeSlot}\n` +
    `🏠 *Property:* ${formData.service}\n` +
    `📝 *Details:* ${formData.message || 'N/A'}\n` +
    `💳 *Order ID:* ${orderId}\n\n` +
    `Hello Dr. Hanumanthu Rao garu, I have completed the ₹999 online consultation payment on hrvasthu.com. Please confirm my appointment.`
  );

  return (
    <div className="min-h-screen bg-[#fbf9f5] dark:bg-[#0a0a0f] text-stone-900 dark:text-stone-100 pt-28 sm:pt-36 pb-20 font-['DM_Sans',sans-serif] transition-colors">
      <Helmet>
        <title>Book Online Vastu Consultation (₹999) | Dr. Kunchala Hanumantha Rao</title>
        <meta name="description" content="Book 1-on-1 direct Online Vastu Consultation on WhatsApp Video Call or Google Meet with Dr. Kunchala Hanumantha Rao. Special ₹999 offer with free Vastu Book PDF." />
        <link rel="canonical" href="https://hrvasthu.com/appointment" />
      </Helmet>

      <Container size="xl">
        
        {/* ═══ TOP HEADER & VEDIC ANNOUNCEMENT ═══ */}
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500/15 via-[#d4720a]/15 to-[#ff5436]/15 border border-amber-500/30 text-[#d4720a] dark:text-amber-400 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest shadow-xs">
            <Sparkles size={14} className="text-yellow-500 animate-pulse" />
            <span>వాస్తు పరిష్కారం — ఇప్పుడు ఆన్‌లైన్‌లో!</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-900 dark:text-white leading-[1.15]">
            Online Vastu Consultation with <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#d4720a] via-amber-500 to-[#e68a1c]">Dr. Kunchala Hanumantha Rao</span>
          </h1>

          <p className="text-sm sm:text-base text-stone-600 dark:text-stone-300 max-w-2xl mx-auto leading-relaxed">
            మీ ఇంటికి శాంతి, శుభం, సంపద కావాలా? • 1-on-1 Direct Video Consultation on WhatsApp or Google Meet.
          </p>
        </div>

        {/* ═══ 2-COLUMN MAIN CONTENT ═══ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto">
          
          {/* ═══ LEFT COLUMN: 4 PILLARS & COMPLIMENTARY BONUS (5/12) ═══ */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Dr. Rao Credentials Card */}
            <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-stone-900 via-stone-850 to-stone-950 text-white border border-amber-400/40 shadow-xl space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-400/30 shrink-0">
                  <Compass size={24} />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    Dr. Kunchala Hanumantha Rao
                  </h3>
                  <p className="text-xs text-amber-300 font-semibold">
                    వాస్తు జ్ఞాని, వాస్తు కళా సామ్రాట్ అవార్డుల గ్రహీత
                  </p>
                </div>
              </div>

              {/* 4 Poster Pillars */}
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-white block">మీ ఇంట్లో ఎటువంటి వాస్తు దోషాలు ఉన్నా</strong>
                    <span className="text-stone-300 text-[11px]">పూర్తి విశ్లేషణ మరియు కూల్చివేతలు లేని శాస్త్రీయ నివారణలు.</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-white block">మీరు కట్టబోయే బిల్డింగ్ &amp; ప్లాన్స్</strong>
                    <span className="text-stone-300 text-[11px]">వాస్తు లోపాలు లేకుండా 100% శాస్త్రీయ బ్లూప్రింట్ వెరిఫికేషన్.</span>
                  </div>
                </div>

                <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-3 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400 mt-1 shrink-0" />
                  <div>
                    <strong className="text-white block">వీడియో కాల్ ద్వారా ప్రత్యక్ష సంభాషణ</strong>
                    <span className="text-stone-300 text-[11px]">WhatsApp Video Call లేదా Google Meet ద్వారా సులభంగా.</span>
                  </div>
                </div>
              </div>

              {/* Free Gift Card */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-emerald-950/70 border border-emerald-400/50 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Gift size={22} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest block">
                    🎁 ఉచిత కాంప్లిమెంటరీ గిఫ్ట్
                  </span>
                  <span className="text-xs text-stone-200">
                    ₹500 విలువైన <strong>వాస్తు బుక్ PDF ఫైల్</strong> తక్షణమే ఉచితంగా లభించును
                  </span>
                </div>
              </div>

              {/* Price Tag Strip */}
              <div className="p-4 rounded-2xl bg-black/60 border border-amber-400/40 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">Consultation Fee</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm line-through text-stone-400 font-normal">₹3,000</span>
                    <span className="text-2xl font-black text-amber-400 font-serif">₹999/-</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-3 py-1 rounded-lg">
                  Special Online Deal
                </span>
              </div>
            </div>

            {/* Direct Phone / Contact Help */}
            <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md flex items-center justify-between text-xs">
              <div className="flex items-center gap-2.5">
                <Phone size={18} className="text-[#d4720a]" />
                <div>
                  <span className="text-stone-500 dark:text-stone-400 block text-[10px] uppercase font-bold">Direct Assistance</span>
                  <strong className="text-stone-900 dark:text-white">+91 92466 24248</strong>
                </div>
              </div>

              <a
                href="tel:+919246624248"
                className="py-2 px-3.5 bg-stone-100 dark:bg-white/10 hover:bg-[#d4720a] hover:text-white text-stone-800 dark:text-stone-200 font-bold rounded-xl transition-all"
              >
                Call Hotline
              </a>
            </div>

          </div>

          {/* ═══ RIGHT COLUMN: INTERACTIVE ₹999 BOOKING FORM (7/12) ═══ */}
          <div className="lg:col-span-7">
            <div className="bg-white dark:bg-stone-900 rounded-3xl p-6 sm:p-8 border border-stone-200 dark:border-stone-800 shadow-xl">
              
              {status === 'success' ? (
                <div className="py-8 text-center space-y-6">
                  <div className="w-16 h-16 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-lg">
                    <CheckCircle2 size={36} />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                      ✦ Payment Verified &amp; Slot Booked
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white">
                      Consultation Confirmed! (₹999)
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-stone-400">
                      Order ID: <strong className="font-mono text-stone-800 dark:text-stone-200">{orderId}</strong>
                    </p>
                  </div>

                  {/* Free Books Download Card */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-500/30 text-left space-y-3">
                    <div className="flex items-center gap-2">
                      <Gift size={18} className="text-emerald-600 dark:text-emerald-400" />
                      <h4 className="font-bold text-xs text-stone-900 dark:text-white">
                        🎁 Your Free Complimentary Vastu Books are Ready!
                      </h4>
                    </div>
                    <p className="text-[11px] text-stone-600 dark:text-stone-300 leading-relaxed">
                      You can download the full digital editions immediately:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {complimentaryBooks.map((book, idx) => (
                        <a
                          key={idx}
                          href={book.pdfUrl}
                          download
                          target="_blank"
                          rel="noopener noreferrer"
                          className="py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 shadow-sm transition-colors"
                        >
                          <Download size={14} />
                          <span>Download {book.title} (PDF)</span>
                        </a>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp VIP Slot Action */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm shadow-xl hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <MessageCircle size={18} />
                      <span>Connect with Dr. Rao on WhatsApp to Finalize Slot</span>
                    </a>

                    <button
                      onClick={() => setStatus('idle')}
                      className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
                    >
                      Book Another Consultation Slot
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4720a] bg-[#d4720a]/10 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                      ✦ Secure Cashfree Instant Booking
                    </span>
                    <h2 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 dark:text-white">
                      Enter Details to Lock Slot (₹999)
                    </h2>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                      Fill out your property information. You will receive free Vastu Books immediately after payment.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                      {errorMessage}
                    </div>
                  )}

                  {/* Form Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Varma"
                        className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#d4720a] outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                        WhatsApp Mobile (+91) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={handleMobileChange}
                        placeholder="e.g. 9246624248"
                        maxLength={13}
                        className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#d4720a] outline-none text-xs font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                        Email Address (Optional)
                      </label>
                      <input
                        type="email"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. ramesh@gmail.com"
                        className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#d4720a] outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                        Property Type
                      </label>
                      <select
                        value={formData.service}
                        onChange={e => setFormData({ ...formData, service: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#d4720a] outline-none text-xs"
                      >
                        <option value="Residential House / Villa">Residential House / Villa</option>
                        <option value="Apartment / Flat Vastu">Apartment / Flat Vastu</option>
                        <option value="Commercial Office / Shop">Commercial Office / Shop</option>
                        <option value="Industrial / Factory Plot">Industrial / Factory Plot</option>
                        <option value="Plot / Site Selection">Open Plot / Site Verification</option>
                        <option value="Building Drawings Review">Building Drawings Review</option>
                      </select>
                    </div>
                  </div>

                  {/* Platform Choice */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                      Preferred Video Call Platform *
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, platform: 'whatsapp_video' })}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          formData.platform === 'whatsapp_video'
                            ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        <MessageCircle size={16} className="text-emerald-500" />
                        <span>WhatsApp Video Call</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, platform: 'google_meet' })}
                        className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                          formData.platform === 'google_meet'
                            ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                            : 'bg-stone-50 dark:bg-stone-800 border-stone-200 dark:border-stone-700 text-stone-600 dark:text-stone-400'
                        }`}
                      >
                        <Video size={16} className="text-blue-500" />
                        <span>Google Meet</span>
                      </button>
                    </div>
                  </div>

                  {/* Date & Slot */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        value={formData.date}
                        onChange={e => setFormData({ ...formData, date: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#d4720a] outline-none text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                        Time Slot
                      </label>
                      <select
                        value={formData.timeSlot}
                        onChange={e => setFormData({ ...formData, timeSlot: e.target.value })}
                        className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#d4720a] outline-none text-xs"
                      >
                        <option value="morning">Morning (9:00 AM – 1:00 PM)</option>
                        <option value="afternoon">Afternoon (2:00 PM – 5:00 PM)</option>
                        <option value="evening">Evening (6:00 PM – 9:00 PM)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
                      Property Details / Specific Queries
                    </label>
                    <textarea
                      rows={3}
                      value={formData.message}
                      onChange={e => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Mention house facing (East/North/South/West), main door issues, kitchen location, or specific concerns..."
                      className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-white focus:ring-2 focus:ring-[#d4720a] outline-none text-xs resize-none"
                    />
                  </div>

                  {/* Cashfree Pay CTA Button */}
                  <button
                    type="submit"
                    disabled={status === 'processing' || status === 'verifying'}
                    className="w-full py-4 bg-gradient-to-r from-amber-500 via-[#d4720a] to-[#ff5436] text-white font-bold rounded-2xl shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer text-xs sm:text-sm uppercase tracking-wider"
                  >
                    <Lock size={16} />
                    <span>
                      {status === 'processing' || status === 'verifying'
                        ? 'Connecting to Cashfree Gateway...'
                        : 'Pay ₹999 (Was ₹3,000) & Lock Video Consultation'}
                    </span>
                    <ArrowRight size={16} />
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>

      </Container>
    </div>
  );
};

export default Appointment;
