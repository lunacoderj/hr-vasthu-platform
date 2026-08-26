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
  Loader2,
  AlertCircle,
  Compass,
  FileText
} from 'lucide-react';
import { type Drawing } from '../../../core/types/drawing';
import { drawingService } from '../../../core/services/drawing.service';

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
    }
  }, [isOpen]);

  if (!isOpen || !drawing) return null;

  const price = drawing.price || 99;

  // Handle Mobile Number formatting (+91 prefix handling)
  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^\d+]/g, '');
    setMobileNumber(raw);
  };

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Clean mobile digits
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
      // 1. Create order on backend (authoritative DB price lookup)
      const orderRes = await drawingService.createOrder({
        drawingId: drawing.id,
        mobile: clean10,
        email: emailAddress.trim() || undefined,
        name: customerName.trim() || undefined,
        marketingConsent,
      });

      if (!orderRes.success || !orderRes.orderId) {
        throw new Error('Failed to create payment order. Please try again.');
      }

      setOrderId(orderRes.orderId);
      setStatusStep('verifying');

      // 2. Gateway Checkout & Verification
      // In live environment: Cashfree JS SDK opens checkout modal.
      // In sandbox/dev environment: backend verifies and issues entitlement token.
      const verifyRes = await drawingService.verifyPayment(orderRes.orderId, drawing.id);

      if (!verifyRes.success || !verifyRes.entitlementToken) {
        throw new Error(verifyRes.message || 'Payment could not be verified.');
      }

      setEntitlementToken(verifyRes.entitlementToken);

      // 3. Request 60-second Signed Download URL using Entitlement Token
      const dlRes = await drawingService.getSecureDownloadUrl(drawing.id, verifyRes.entitlementToken);
      
      if (dlRes.success && dlRes.downloadUrl) {
        setDownloadUrl(dlRes.downloadUrl);
        setStatusStep('success');
        if (onPaymentSuccess) {
          onPaymentSuccess(drawing.id);
        }

        // 4. Automatic Download Trigger (with fallback button)
        triggerBrowserDownload(dlRes.downloadUrl, dlRes.fileName || 'HR-Vasthu-House-Plan.png');
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

  const whatsappMessage = `Hello Dr. Hanumanthu Rao garu, I purchased the Vastu drawing "${drawing.title}" (Order ID: ${orderId}). Please share the HD CAD files and consultation notes on WhatsApp.`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=919246624248&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={statusStep === 'processing' || statusStep === 'verifying' ? undefined : onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Dialog Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative max-w-md w-full bg-[#fdfcf9] dark:bg-[#12121a] border border-stone-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col"
        >
          {/* Header Strip */}
          <div className="p-5 border-b border-stone-200 dark:border-white/10 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-[#d4720a] to-[#e68a1c] text-white shadow-md">
                <Lock size={16} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4720a]">
                  HR Vasthu Certified Digital Store
                </span>
                <h3 className="font-serif font-bold text-base line-clamp-1">
                  Unlock Drawing (₹{price})
                </h3>
              </div>
            </div>

            {statusStep !== 'processing' && statusStep !== 'verifying' && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-4">
            {statusStep === 'form' && (
              <form onSubmit={handlePay} className="space-y-4">
                {/* Product Summary */}
                <div className="p-3.5 rounded-2xl bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 flex items-center gap-3">
                  <img
                    src={drawing.aiPreviewPath || drawing.imageUrl}
                    alt={drawing.title}
                    className="w-16 h-14 object-cover rounded-xl bg-stone-900 shrink-0 border border-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-[#d4720a] flex items-center gap-1">
                      <Compass size={11} /> {drawing.facing} Facing • {drawing.dimensions || `${drawing.plotWidth}×${drawing.plotLength} ft`}
                    </span>
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white truncate">
                      {drawing.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        High-Res CAD Blueprint
                      </span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        ₹{price}
                      </span>
                    </div>
                  </div>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs flex items-center gap-2">
                    <AlertCircle size={15} className="shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* Customer Details Inputs */}
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                      Mobile Number *
                    </label>
                    <div className="relative mt-1">
                      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 dark:text-stone-400 select-none">
                        +91
                      </div>
                      <input
                        required
                        type="tel"
                        maxLength={13}
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        placeholder="9876543210"
                        className="w-full pl-12 pr-3.5 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/15 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none text-stone-900 dark:text-white font-medium"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                      Email Address (For PDF Delivery)
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="user@gmail.com"
                      className="w-full mt-1 px-3.5 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/15 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none text-stone-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block">
                      Full Name (Optional)
                    </label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full mt-1 px-3.5 py-2.5 bg-stone-50 dark:bg-white/5 border border-stone-300 dark:border-white/15 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none text-stone-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                {/* Consent Checkboxes */}
                <div className="space-y-2 pt-1 border-t border-stone-200 dark:border-white/10">
                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-stone-700 dark:text-stone-300">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 rounded border-stone-300 text-[#d4720a] focus:ring-[#d4720a]"
                    />
                    <span>
                      I agree to the <strong>purchase and delivery terms</strong> for HR Vasthu digital blueprints.
                    </span>
                  </label>

                  <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-stone-500 dark:text-stone-400">
                    <input
                      type="checkbox"
                      checked={marketingConsent}
                      onChange={(e) => setMarketingConsent(e.target.checked)}
                      className="mt-0.5 rounded border-stone-300 text-[#d4720a] focus:ring-[#d4720a]"
                    />
                    <span>
                      Send me HR Vasthu updates, astrological muhurtham dates, and offers (Optional).
                    </span>
                  </label>
                </div>

                {/* Continue to Pay Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#d4720a] via-[#e68a1c] to-[#d4720a] text-white font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-3"
                >
                  <Lock size={15} />
                  <span>Continue to Pay ₹{price}</span>
                  <ArrowRight size={15} />
                </button>

                <div className="flex items-center justify-center gap-1.5 text-[10px] text-stone-400 pt-1">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <span>256-Bit SSL Encrypted • Powered by Cashfree Payments</span>
                </div>
              </form>
            )}

            {(statusStep === 'processing' || statusStep === 'verifying') && (
              <div className="py-12 text-center space-y-4">
                <Loader2 size={44} className="mx-auto text-[#d4720a] animate-spin" />
                <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                  {statusStep === 'processing' ? 'Creating Secure Order...' : 'Verifying Payment & Issuing Entitlement...'}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto leading-relaxed">
                  Please hold on while your transaction is securely processed and verified with the Cashfree gateway.
                </p>
                <div className="inline-block px-3 py-1 bg-stone-100 dark:bg-white/5 rounded-full text-[11px] font-mono text-stone-500 dark:text-stone-400">
                  {orderId ? `Order: ${orderId}` : 'Connecting to gateway...'}
                </div>
              </div>
            )}

            {statusStep === 'success' && (
              <div className="py-3 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner border border-emerald-500/30">
                  <CheckCircle2 size={32} />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                    Payment Verified
                  </span>
                  <h4 className="font-serif font-bold text-xl text-stone-900 dark:text-white mt-0.5">
                    ₹{price} Payment Successful!
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400 mt-1">
                    Your authenticated cryptographic download entitlement has been issued.
                  </p>
                  {orderId && (
                    <p className="text-[10px] font-mono text-stone-400 mt-1">
                      Order ID: {orderId}
                    </p>
                  )}
                </div>

                {/* Primary Download Button */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={() => downloadUrl && triggerBrowserDownload(downloadUrl, 'HR-Vasthu-House-Plan.png')}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download size={18} />
                    <span>Download CAD Drawing File</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={15} />
                    <span>WhatsApp Support &amp; Copy</span>
                  </a>
                </div>

                <p className="text-[11px] text-stone-400 pt-1">
                  Signed download URL active for 60 seconds. Lifetime entitlement stored against your mobile.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UnlockDrawingModal;
