import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Video, 
  Lock, 
  CheckCircle2, 
  Download, 
  MessageCircle, 
  Sparkles, 
  Gift, 
  Calendar, 
  Clock, 
  Phone, 
  ArrowRight,
  ShieldCheck,
  Building,
  Compass,
  Check
} from 'lucide-react';
import { consultationService } from '../../../core/services/consultation.service';
import { cashfreeService } from '../../../core/services/cashfree.service';

interface OnlineConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnlineConsultationModal: React.FC<OnlineConsultationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [preferredPlatform, setPreferredPlatform] = useState<'whatsapp_video' | 'google_meet'>('whatsapp_video');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('morning');
  const [propertyType, setPropertyType] = useState('Residential House / Villa');
  const [propertyDetails, setPropertyDetails] = useState('');
  const [agreedTerms, setAgreedTerms] = useState(true);

  const [statusStep, setStatusStep] = useState<'form' | 'processing' | 'verifying' | 'success'>('form');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [complimentaryBooks, setComplimentaryBooks] = useState<Array<{ title: string; pdfUrl: string }>>([]);

  useEffect(() => {
    if (isOpen) {
      setStatusStep('form');
      setErrorMessage('');
      cashfreeService.loadSDK().catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const price = 999;
  const originalPrice = 3000;

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d+]/g, '');
    setMobileNumber(raw);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const digitsOnly = mobileNumber.replace(/\D/g, '');
    const clean10 = digitsOnly.length === 12 && digitsOnly.startsWith('91') 
      ? digitsOnly.slice(2) 
      : digitsOnly;

    if (!clean10 || clean10.length !== 10 || !/^[6-9]\d{9}$/.test(clean10)) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g. 9246624248).');
      return;
    }

    if (!agreedTerms) {
      setErrorMessage('Please agree to the consultation booking terms.');
      return;
    }

    setStatusStep('processing');

    try {
      // 1. Create Cashfree Production Order (₹999)
      const orderRes = await consultationService.createOrder({
        name: customerName.trim(),
        mobile: clean10,
        email: emailAddress.trim() || undefined,
        consultationType: `Online Vastu Consultation (${propertyType})`,
        preferredPlatform,
        preferredDate: preferredDate || undefined,
        preferredTimeSlot,
        propertyDetails: propertyDetails.trim() || undefined,
      });

      if (!orderRes.success || !orderRes.orderId) {
        throw new Error('Failed to create consultation payment order. Please try again.');
      }

      setOrderId(orderRes.orderId);
      setStatusStep('verifying');

      // 2. Launch Cashfree Checkout SDK
      if (orderRes.paymentSessionId) {
        try {
          await cashfreeService.launchCheckout({
            paymentSessionId: orderRes.paymentSessionId,
          });
        } catch (cfErr: any) {
          console.warn('[Consultation Modal] SDK modal notice:', cfErr);
          throw new Error('Payment was cancelled or closed. Please complete the ₹999 payment to confirm your consultation slot.');
        }
      } else {
        throw new Error('Payment session could not be created.');
      }

      // 3. Verify Payment
      const verifyRes = await consultationService.verifyPayment(orderRes.orderId);
      if (verifyRes.success && verifyRes.paymentStatus === 'PAID') {
        setStatusStep('success');
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
        throw new Error(verifyRes.message || 'Payment has not been completed or is pending.');
      }
    } catch (err: any) {
      console.error('[ConsultationModal] Payment error:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'Payment failed or was cancelled.');
      setStatusStep('form');
    }
  };

  const whatsappMessage = encodeURIComponent(
    `*Online Vastu Consultation Booking Confirmed (₹999)*\n\n` +
    `👤 *Name:* ${customerName || 'Client'}\n` +
    `📞 *Phone:* ${mobileNumber}\n` +
    `📱 *Preferred Platform:* ${preferredPlatform === 'google_meet' ? 'Google Meet' : 'WhatsApp Video Call'}\n` +
    `📅 *Date:* ${preferredDate || 'Earliest Available'}\n` +
    `⏰ *Slot:* ${preferredTimeSlot}\n` +
    `🏠 *Property:* ${propertyType}\n` +
    `📝 *Notes:* ${propertyDetails || 'N/A'}\n` +
    `💳 *Order ID:* ${orderId}\n\n` +
    `Hello Dr. Hanumanthu Rao garu, I have completed the ₹999 online consultation payment. Please confirm my video call appointment slot.`
  );

  return (
    <AnimatePresence>
      <div 
        data-payment-modal="true"
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 pt-16 sm:pt-24 pb-8 overflow-y-auto bg-black/85 backdrop-blur-md font-['DM_Sans',sans-serif]"
        onClick={statusStep === 'processing' || statusStep === 'verifying' ? undefined : onClose}
      >
        {/* ═══ RESPONSIVE 2-COLUMN MAGAZINE CARD ═══ */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[96vw] sm:w-[92vw] md:w-[86vw] lg:w-[82vw] max-w-5xl max-h-[calc(100vh-6rem)] md:max-h-[840px] bg-white dark:bg-[#12121a] rounded-3xl sm:rounded-[36px] shadow-2xl border border-amber-300/50 dark:border-white/10 overflow-hidden flex flex-col md:flex-row my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 sm:top-4 sm:right-4 z-30 p-2.5 rounded-full bg-stone-900/85 hover:bg-stone-900 text-white border border-white/20 transition-all transform hover:scale-110 shadow-lg cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>

          {/* ═══ LEFT COLUMN: DR. RAO AUTHORITY, 4 PILLARS & COMPLIMENTARY BONUS ═══ */}
          <div className="w-full md:w-[42%] bg-gradient-to-br from-stone-950 via-stone-900 to-[#1a140e] p-6 sm:p-8 flex flex-col justify-between text-white relative overflow-hidden shrink-0">
            
            {/* Ambient Warm Golden Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
            
            <div className="space-y-4 relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                <Sparkles size={12} className="text-yellow-300 animate-pulse" />
                <span>వాస్తు పరిష్కారం ఇప్పుడు ఆన్‌లైన్‌లో</span>
              </div>

              <div>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight">
                  Online Vastu Consultation
                </h3>
                <p className="text-xs text-amber-300 font-semibold mt-1">
                  డా॥ కుంచాల హనుమంత రావు గారితో ప్రత్యక్ష సంభాషణ
                </p>
                <p className="text-[11px] text-stone-400">
                  వాస్తు జ్ఞాని, వాస్తు కళా సామ్రాట్ అవార్డుల గ్రహీత
                </p>
              </div>

              {/* 4 Core Pillars from Poster */}
              <div className="space-y-2.5 pt-2">
                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white block">గృహ వాస్తు దోష నివారణ</strong>
                    <span className="text-stone-400 text-[11px]">ఎటువంటి వాస్తు లోపాలు ఉన్నా శాస్త్రీయ పరిష్కారాలు</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white block">నూతన గృహ నిర్మాణ ప్లాన్స్</strong>
                    <span className="text-stone-400 text-[11px]">కట్టబోయే బిల్డింగ్ డ్రాయింగ్స్ &amp; బ్లూప్రింట్ వెరిఫికేషన్</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 flex items-start gap-2.5 text-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-400 mt-1.5 shrink-0" />
                  <div>
                    <strong className="text-white block">వీడియో కాల్ సంభాషణ</strong>
                    <span className="text-stone-400 text-[11px]">WhatsApp Video Call లేదా Google Meet ద్వారా</span>
                  </div>
                </div>
              </div>

              {/* Free Book Gift Ribbon */}
              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-950/70 via-teal-950/50 to-emerald-950/70 border border-emerald-400/50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <Gift size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                    🎁 FREE COMPLIMENTARY BONUS
                  </span>
                  <span className="text-xs text-stone-200">
                    ₹500 విలువైన <strong>వాస్తు బుక్ PDF ఫైల్</strong> ఉచితంగా లభించును
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Price Tag Box */}
            <div className="mt-4 p-4 rounded-2xl bg-black/60 border border-amber-400/40 flex items-center justify-between relative z-10">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-400 block">Total Consultation Fee</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-sm line-through text-stone-400 font-normal">₹{originalPrice}</span>
                  <span className="text-2xl font-black text-amber-400 font-serif">₹{price}/-</span>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                Save 67% Today
              </span>
            </div>

          </div>

          {/* ═══ RIGHT COLUMN: BOOKING FORM, CASHFREE PAY & SUCCESS ═══ */}
          <div className="w-full md:w-[58%] flex-1 overflow-y-auto p-5 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#12121a] text-stone-900 dark:text-white">
            
            {statusStep === 'form' && (
              <form onSubmit={handlePay} className="space-y-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4720a] bg-[#d4720a]/10 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                    ✦ Instant Cashfree Verification
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                    Book Online Vastu Consultation (₹{price})
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Fill the details below to lock your slot and receive free complimentary Vastu Books.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Form Inputs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Varma"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1">
                      WhatsApp Mobile Number (+91) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={handleMobileChange}
                      placeholder="e.g. 9246624248"
                      maxLength={13}
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="e.g. ramesh@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1">
                      Property Type
                    </label>
                    <select
                      value={propertyType}
                      onChange={(e) => setPropertyType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none"
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

                {/* Platform Preference Selector */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1.5">
                    Preferred Video Consultation Platform *
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setPreferredPlatform('whatsapp_video')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                        preferredPlatform === 'whatsapp_video'
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 text-emerald-700 dark:text-emerald-300 shadow-xs'
                          : 'bg-stone-50 dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <MessageCircle size={16} className="text-emerald-500" />
                      <span>WhatsApp Video Call</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPreferredPlatform('google_meet')}
                      className={`p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all cursor-pointer ${
                        preferredPlatform === 'google_meet'
                          ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-700 dark:text-blue-300 shadow-xs'
                          : 'bg-stone-50 dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <Video size={16} className="text-blue-500" />
                      <span>Google Meet</span>
                    </button>
                  </div>
                </div>

                {/* Date & Time Slot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1">
                      Preferred Time Slot
                    </label>
                    <select
                      value={preferredTimeSlot}
                      onChange={(e) => setPreferredTimeSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none"
                    >
                      <option value="morning">Morning (9:00 AM – 1:00 PM)</option>
                      <option value="afternoon">Afternoon (2:00 PM – 5:00 PM)</option>
                      <option value="evening">Evening (6:00 PM – 9:00 PM)</option>
                    </select>
                  </div>
                </div>

                {/* Specific Queries */}
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1">
                    Property Facing / Specific Doubts
                  </label>
                  <textarea
                    rows={2}
                    value={propertyDetails}
                    onChange={(e) => setPropertyDetails(e.target.value)}
                    placeholder="Mention house facing (East/North/South/West), main door issues, kitchen, or specific doubts..."
                    className="w-full px-3.5 py-2 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none resize-none"
                  />
                </div>

                {/* Terms Agreement */}
                <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={agreedTerms}
                    onChange={(e) => setAgreedTerms(e.target.checked)}
                    className="rounded text-[#d4720a] focus:ring-[#d4720a]"
                  />
                  <span>I agree to the ₹999 consultation fee and slot confirmation terms.</span>
                </label>

                {/* Main Cashfree Pay CTA Button */}
                <button
                  type="submit"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-[#d4720a] to-[#ff5436] text-white font-bold text-xs uppercase tracking-wider shadow-xl hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock size={15} />
                  <span>Pay <span className="line-through opacity-70 font-normal mr-1">₹3,000</span> ₹{price} &amp; Lock Consultation Slot</span>
                  <ArrowRight size={15} />
                </button>
              </form>
            )}

            {(statusStep === 'processing' || statusStep === 'verifying') && (
              <div className="py-16 text-center space-y-4">
                <div className="w-16 h-16 rounded-full border-4 border-amber-500/20 border-t-amber-500 animate-spin mx-auto" />
                <h3 className="font-serif font-bold text-xl text-stone-900 dark:text-white">
                  {statusStep === 'processing' ? 'Connecting to Cashfree Gateway...' : 'Verifying Payment & Issuing Free Books...'}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Please complete the payment in the secure Cashfree checkout window. Do not close or refresh this tab.
                </p>
              </div>
            )}

            {statusStep === 'success' && (
              <div className="py-6 space-y-6 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-lg">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                    ✦ Payment Verified &amp; Slot Booked
                  </span>
                  <h3 className="font-serif font-bold text-2xl text-stone-900 dark:text-white">
                    Consultation Confirmed! (₹{price})
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    Order ID: <strong className="font-mono text-stone-700 dark:text-stone-300">{orderId}</strong>
                  </p>
                </div>

                {/* Complimentary Books Unlocked Banner */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 border border-emerald-500/30 text-left space-y-3">
                  <div className="flex items-center gap-2">
                    <Gift size={18} className="text-emerald-500" />
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white">
                      🎁 Your Complimentary Vastu Books are Unlocked!
                    </h4>
                  </div>
                  <p className="text-[11px] text-stone-600 dark:text-stone-300">
                    As promised, you have received free downloadable access to the authoritative Vijayabata Vaasthu Grandham eBook:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {complimentaryBooks.map((book, idx) => (
                      <a
                        key={idx}
                        href={book.pdfUrl}
                        download
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-2 px-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl inline-flex items-center gap-1.5 shadow-sm transition-colors"
                      >
                        <Download size={14} />
                        <span>Download {book.title} (PDF)</span>
                      </a>
                    ))}
                  </div>
                </div>

                {/* VIP WhatsApp Hotline Direct Action */}
                <div className="space-y-3 pt-2">
                  <a
                    href={`https://wa.me/919246624248?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-sm shadow-xl hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle size={18} />
                    <span>Connect with Dr. Rao on WhatsApp to Confirm Slot</span>
                  </a>

                  <button
                    onClick={onClose}
                    className="text-xs font-bold text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 transition-colors"
                  >
                    Close &amp; Return to Website
                  </button>
                </div>

              </div>
            )}

          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default OnlineConsultationModal;
