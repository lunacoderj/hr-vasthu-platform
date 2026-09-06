import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Lock, 
  ShieldCheck, 
  CheckCircle2, 
  Download, 
  MessageCircle, 
  Sparkles, 
  ArrowRight, 
  Phone,
  Compass,
  FileText,
  Building,
  Check
} from 'lucide-react';
import { type Drawing } from '../../../core/types/drawing';
import { drawingService } from '../../../core/services/drawing.service';
import { cashfreeService } from '../../../core/services/cashfree.service';

interface UnlockDrawingModalProps {
  drawing: Drawing | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (drawingId: string) => void;
}

export const UnlockDrawingModal: React.FC<UnlockDrawingModalProps> = ({
  drawing,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [cityLocation, setCityLocation] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(true);
  const [marketingConsent, setMarketingConsent] = useState(false);
  
  const [statusStep, setStatusStep] = useState<'form' | 'processing' | 'verifying' | 'success'>('form');
  const [errorMessage, setErrorMessage] = useState('');
  const [orderId, setOrderId] = useState('');
  const [downloadUrl, setDownloadUrl] = useState('');
  const [entitlementToken, setEntitlementToken] = useState('');
  const [downloadInitiated, setDownloadInitiated] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatusStep('form');
      setErrorMessage('');
      setDownloadUrl('');
      setDownloadInitiated(false);
      cashfreeService.loadSDK().catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen || !drawing) return null;

  const price = drawing.price || 99;

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
      setErrorMessage('Please enter a valid 10-digit Indian mobile number (e.g. 9876543210).');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('You must agree to the purchase and delivery terms to continue.');
      return;
    }

    setStatusStep('processing');

    try {
      // 1. Mandatory Lead Capture & Order Initialization
      const orderRes = await drawingService.createOrder({
        drawingId: drawing.id,
        mobile: clean10,
        email: emailAddress.trim() || cityLocation.trim() || undefined,
        name: customerName.trim() || undefined,
        marketingConsent,
      });

      if (!orderRes.success || !orderRes.orderId) {
        throw new Error('Failed to create payment order. Please try again.');
      }

      setOrderId(orderRes.orderId);
      setStatusStep('verifying');

      // 2. Launch Cashfree Checkout SDK modal
      if (orderRes.paymentSessionId && !orderRes.isMock) {
        try {
          await cashfreeService.launchCheckout({
            paymentSessionId: orderRes.paymentSessionId,
          });
        } catch (cfErr) {
          console.warn('[Cashfree Modal] SDK modal checkout notice:', cfErr);
        }
      }

      // 3. Verify Payment with server
      const verifyRes = await drawingService.verifyPayment(orderRes.orderId, drawing.id);

      if (!verifyRes.success || !verifyRes.entitlementToken) {
        throw new Error(verifyRes.message || 'Payment could not be verified.');
      }

      setEntitlementToken(verifyRes.entitlementToken);

      // 4. Request Temporary Download URL
      const dlRes = await drawingService.getSecureDownloadUrl(drawing.id, verifyRes.entitlementToken);
      
      if (dlRes.success && dlRes.downloadUrl) {
        setDownloadUrl(dlRes.downloadUrl);
        setStatusStep('success');
        if (onPaymentSuccess) {
          onPaymentSuccess(drawing.id);
        }

        // Automatic Download Trigger
        triggerBrowserDownload(dlRes.downloadUrl, dlRes.fileName || `${drawing.title}.jpg`);
      } else {
        setStatusStep('success');
      }
    } catch (err: any) {
      console.error('[UnlockModal] Payment error:', err);
      setErrorMessage(err.response?.data?.message || err.message || 'An error occurred during checkout. Please try again.');
      setStatusStep('form');
    }
  };

  const triggerBrowserDownload = (url: string, filename: string) => {
    try {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadInitiated(true);
    } catch (e) {
      console.warn('Auto download blocked by browser popup setting:', e);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Dr. Hanumanthu Rao garu, I am purchasing the Vastu drawing: "${drawing.title}" (${drawing.facing} Facing, ₹${price}). Name: ${customerName || 'Customer'}, Mobile: ${mobileNumber || 'N/A'}. Please share the complete unlocked CAD package on WhatsApp.`
  );

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md font-['DM_Sans',sans-serif]"
        onClick={statusStep === 'processing' || statusStep === 'verifying' ? undefined : onClose}
      >
        {/* ═══ SMART 80vw × 90vh RESPONSIVE 2-COLUMN MAGAZINE CARD ═══ */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[96vw] sm:w-[92vw] md:w-[86vw] lg:w-[80vw] max-w-5xl h-[90vh] max-h-[880px] bg-white dark:bg-[#12121a] rounded-3xl shadow-2xl border border-amber-300/40 dark:border-white/10 overflow-hidden flex flex-col md:flex-row my-auto"
        >
          {/* Close Button - Always Visible at Top Right */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white border border-white/20 transition-all transform hover:scale-110 shadow-lg cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>

          {/* ═══ LEFT COLUMN: 3D CONCEPTUAL HOUSE VISUAL & SPECS (45% Width on Desktop) ═══ */}
          <div className="w-full md:w-[45%] h-56 md:h-full bg-stone-950 relative overflow-hidden flex flex-col justify-between p-6 shrink-0">
            {/* Background 3D House Image */}
            <img
              src={drawing.aiPreviewPath || drawing.imageUrl}
              alt={drawing.title}
              className="absolute inset-0 w-full h-full object-cover select-none pointer-events-none opacity-80"
              onContextMenu={(e) => e.preventDefault()}
              onDragStart={(e) => e.preventDefault()}
            />
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30 pointer-events-none" />

            {/* Top Badges */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-stone-950 px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles size={11} /> 3D Elevation
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-xs text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
                {drawing.facing} Facing
              </span>
            </div>

            {/* Bottom Info Overlay */}
            <div className="relative z-10 space-y-2 text-white">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                <Compass size={14} className="text-[#d4720a]" />
                <span>{drawing.dimensions || `${drawing.plotWidth}×${drawing.plotLength} ft`}</span>
                <span>•</span>
                <span>{drawing.floors || 'Ground Floor'}</span>
              </div>
              
              <h3 className="font-serif font-bold text-lg md:text-xl text-white line-clamp-2 leading-tight">
                {drawing.title}
              </h3>

              <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed hidden sm:block">
                {drawing.description}
              </p>

              {/* Price Tag Box */}
              <div className="p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-amber-400/30 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Complete Drawing Pack</span>
                  <span className="text-xl font-black text-white font-serif">₹{price} <span className="text-[10px] font-normal text-stone-400">One-time Fee</span></span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                  Instant CAD Download
                </span>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT COLUMN: LEAD CAPTURE, CASHFREE CHECKOUT & DIRECT ACTIONS (55% Width) ═══ */}
          <div className="w-full md:w-[55%] flex-1 overflow-y-auto p-5 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#12121a] text-stone-900 dark:text-white">
            
            {statusStep === 'form' && (
              <form onSubmit={handlePay} className="space-y-4">
                {/* Header */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#d4720a] bg-[#d4720a]/10 px-2.5 py-0.5 rounded-full inline-block mb-1.5">
                    ✦ Secure Instant Unlock
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold leading-tight">
                    Enter Details to Unlock Drawing (₹{price})
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Fill the quick details below. You will receive the high-resolution CAD drawing files immediately.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs">
                    {errorMessage}
                  </div>
                )}

                {/* Form Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 dark:text-stone-300 block mb-1">
                      Your Full Name *
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
                      Mobile Number (+91) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={mobileNumber}
                      onChange={handleMobileChange}
                      placeholder="e.g. 9876543210"
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
                      City / Location
                    </label>
                    <input
                      type="text"
                      value={cityLocation}
                      onChange={(e) => setCityLocation(e.target.value)}
                      placeholder="e.g. Visakhapatnam, Hyderabad"
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Checkbox */}
                <div className="space-y-1.5 pt-1">
                  <label className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="rounded text-[#d4720a] focus:ring-[#d4720a]"
                    />
                    <span>I agree to receive the drawing package via instant download and WhatsApp.</span>
                  </label>
                </div>

                {/* Main Cashfree Pay CTA Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#d4720a] via-[#e68a1c] to-[#d4720a] text-white font-bold text-xs uppercase tracking-wider shadow-xl hover:scale-[1.01] active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock size={15} />
                  <span>Pay ₹{price} &amp; Unlock Full Drawing Pack</span>
                  <ArrowRight size={15} />
                </button>

                {/* Direct Alternative Contacts Strip */}
                <div className="pt-3 border-t border-stone-100 dark:border-white/10 space-y-2">
                  <span className="text-[10px] text-stone-400 text-center block font-bold uppercase tracking-wider">
                    Or Consult Dr. Rao Directly
                  </span>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={`https://wa.me/919246624248?text=${whatsappMessage}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-transform hover:scale-102"
                    >
                      <MessageCircle size={13} /> WhatsApp
                    </a>

                    <a
                      href="tel:+919246624248"
                      className="py-2.5 px-3 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-[11px] flex items-center justify-center gap-1.5 shadow-sm transition-transform hover:scale-102"
                    >
                      <Phone size={13} /> Call Office
                    </a>
                  </div>
                </div>
              </form>
            )}

            {/* Processing / Verifying State */}
            {(statusStep === 'processing' || statusStep === 'verifying') && (
              <div className="my-auto text-center space-y-4 py-12">
                <div className="w-16 h-16 mx-auto rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 animate-pulse">
                  <Lock size={28} />
                </div>
                <h3 className="font-serif text-xl font-bold">
                  {statusStep === 'processing' ? 'Connecting to Secure Gateway...' : 'Verifying Payment & Preparing Drawing Pack...'}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Please do not close or refresh this window. Generating your cryptographic download entitlement token.
                </p>
              </div>
            )}

            {/* Success State */}
            {statusStep === 'success' && (
              <div className="my-auto text-center space-y-5 py-6">
                <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={32} />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 bg-emerald-500/10 px-3 py-1 rounded-full">
                    Payment Verified (₹{price})
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-stone-900 dark:text-white">
                    Drawing Pack Unlocked!
                  </h3>
                  <p className="text-xs text-stone-500 max-w-sm mx-auto">
                    Your complete high-resolution CAD drawing pack has been unlocked and downloaded.
                  </p>
                </div>

                <div className="space-y-2 max-w-sm mx-auto">
                  {downloadUrl && (
                    <button
                      onClick={() => triggerBrowserDownload(downloadUrl, `${drawing.title}.jpg`)}
                      className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-102 uppercase tracking-wider cursor-pointer"
                    >
                      <Download size={15} /> Download Again
                    </button>
                  )}

                  <a
                    href={`https://wa.me/919246624248?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 bg-stone-100 dark:bg-white/10 hover:bg-stone-200 dark:hover:bg-white/20 text-stone-900 dark:text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    <MessageCircle size={14} className="text-emerald-500" /> Share on WhatsApp for Vastu Consultation
                  </a>
                </div>
              </div>
            )}

            {/* Security Guarantee Strip */}
            <div className="pt-4 border-t border-stone-100 dark:border-white/10 flex items-center justify-between text-[10px] text-stone-400">
              <span className="flex items-center gap-1">
                <ShieldCheck size={13} className="text-emerald-500" /> 256-bit Encrypted Checkout
              </span>
              <span>HR Vasthu Certified</span>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UnlockDrawingModal;
