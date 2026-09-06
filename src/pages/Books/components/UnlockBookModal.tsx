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
  BookOpen,
  FileText,
  Check,
  CreditCard
} from 'lucide-react';
import { type Book } from '../../../core/types/book';
import { bookService } from '../../../core/services/book.service';
import { cashfreeService } from '../../../core/services/cashfree.service';

interface UnlockBookModalProps {
  book: Book | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess?: (bookId: string) => void;
}

export const UnlockBookModal: React.FC<UnlockBookModalProps> = ({
  book,
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
      cashfreeService.loadSDK().catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen || !book) return null;

  const price = book.price || 99;

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
      setErrorMessage('You must agree to the purchase terms to continue.');
      return;
    }

    setStatusStep('processing');

    try {
      // 1. Mandatory Lead Capture & Order Initialization on Backend
      const orderRes = await bookService.createOrder({
        bookId: book.id,
        mobile: clean10,
        email: emailAddress.trim() || undefined,
        name: customerName.trim() || undefined,
        marketingConsent,
      });

      if (!orderRes.success || !orderRes.orderId) {
        throw new Error('Failed to create payment session. Please try again.');
      }

      setOrderId(orderRes.orderId);
      setStatusStep('verifying');

      // 2. Launch Official Cashfree Checkout Modal
      if (orderRes.paymentSessionId && !orderRes.isMock) {
        try {
          await cashfreeService.launchCheckout({
            paymentSessionId: orderRes.paymentSessionId,
          });
        } catch (cfErr) {
          console.warn('[Cashfree Modal] SDK checkout notice:', cfErr);
        }
      }

      // 3. Level 2 Security: Verify Payment with server
      const verifyRes = await bookService.verifyPayment(orderRes.orderId, book.id);

      if (!verifyRes.success || !verifyRes.entitlementToken) {
        throw new Error(verifyRes.message || 'Payment could not be verified.');
      }

      setEntitlementToken(verifyRes.entitlementToken);

      // 4. Level 3 Security: Request Temporary Signed Download URL
      const dlRes = await bookService.getSecureDownloadUrl(book.id, verifyRes.entitlementToken);
      
      if (dlRes.success && dlRes.downloadUrl) {
        setDownloadUrl(dlRes.downloadUrl);
        setStatusStep('success');
        if (onPaymentSuccess) {
          onPaymentSuccess(book.id);
        }

        // Automatic Download Trigger
        triggerBrowserDownload(dlRes.downloadUrl, dlRes.fileName || `${book.title}.pdf`);
      } else {
        setStatusStep('success');
      }
    } catch (err: any) {
      console.error('[UnlockBookModal] Payment error:', err);
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
      console.warn('Auto download notice:', e);
    }
  };

  const whatsappMessage = encodeURIComponent(
    `Hello Dr. Hanumanthu Rao garu, I am purchasing the eBook Grandham: "${book.title}" (₹${price}). Name: ${customerName || 'Reader'}, Mobile: ${mobileNumber || 'N/A'}. Please share the high-resolution eBook on WhatsApp.`
  );

  return (
    <AnimatePresence>
      <div 
        data-payment-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto bg-black/80 backdrop-blur-md font-['DM_Sans',sans-serif]"
        onClick={statusStep === 'processing' || statusStep === 'verifying' ? undefined : onClose}
      >
        {/* ═══ RESPONSIVE 2-COLUMN MAGAZINE CARD ═══ */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-[96vw] sm:w-[92vw] md:w-[86vw] lg:w-[80vw] max-w-4xl h-[90vh] max-h-[820px] bg-white dark:bg-[#12121a] rounded-3xl shadow-2xl border border-amber-300/40 dark:border-white/10 overflow-hidden flex flex-col md:flex-row my-auto"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-stone-900/80 hover:bg-stone-900 text-white border border-white/20 transition-all transform hover:scale-110 shadow-lg cursor-pointer"
            title="Close"
          >
            <X size={18} />
          </button>

          {/* ═══ LEFT COLUMN: BOOK PREVIEW & DETAILS ═══ */}
          <div className="w-full md:w-[45%] h-56 md:h-full bg-stone-950 relative overflow-hidden flex flex-col justify-between p-6 shrink-0">
            {/* Background Book Cover */}
            <div className="absolute inset-0 flex items-center justify-center p-6 bg-gradient-to-b from-stone-900 via-stone-950 to-black">
              <img
                src={book.coverImage}
                alt={book.title}
                className="max-h-full max-w-full w-auto h-auto object-contain drop-shadow-2xl rounded-xl opacity-90 transition-transform duration-500 hover:scale-105"
              />
            </div>
            
            {/* Gradient Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20 pointer-events-none" />

            {/* Top Badges */}
            <div className="relative z-10 flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-widest bg-amber-500 text-stone-950 px-3 py-1 rounded-full shadow-md flex items-center gap-1">
                <Sparkles size={11} /> Vedic Publication
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider bg-black/70 backdrop-blur-xs text-amber-300 px-3 py-1 rounded-full border border-amber-400/30">
                {book.language} Edition
              </span>
            </div>

            {/* Bottom Info Overlay */}
            <div className="relative z-10 space-y-2 text-white">
              <div className="flex items-center gap-2 text-xs font-mono text-amber-300">
                <BookOpen size={14} className="text-[#d4720a]" />
                <span>{book.pages} Pages</span>
                <span>•</span>
                <span>Complete Authoritative Edition</span>
              </div>
              
              <h3 className="font-serif font-bold text-lg md:text-xl text-white line-clamp-2 leading-tight">
                {book.title}
              </h3>

              <p className="text-[11px] text-stone-300 line-clamp-2 leading-relaxed hidden sm:block">
                {book.description}
              </p>

              {/* Price Tag Box */}
              <div className="p-3 rounded-2xl bg-black/70 backdrop-blur-md border border-amber-400/30 flex items-center justify-between">
                <div>
                  <span className="text-[9px] uppercase font-bold text-stone-400 block">Complete Grandham PDF</span>
                  <span className="text-xl font-black text-white font-serif">₹{price} <span className="text-[10px] font-normal text-stone-400">One-time Fee</span></span>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-1 rounded-lg">
                  Instant High-Res PDF
                </span>
              </div>
            </div>
          </div>

          {/* ═══ RIGHT COLUMN: CASHFREE CHECKOUT & UNLOCK ═══ */}
          <div className="w-full md:w-[55%] flex-1 overflow-y-auto p-5 sm:p-8 flex flex-col justify-between bg-white dark:bg-[#12121a] text-stone-900 dark:text-white">
            
            {statusStep === 'form' && (
              <form onSubmit={handlePay} className="space-y-4">
                {/* Header */}
                <div>
                  <div className="flex items-center gap-1.5 text-[#d4720a] text-[11px] font-bold uppercase tracking-wider mb-1">
                    <ShieldCheck size={14} />
                    <span>Cashfree Secure 256-bit Payment</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-stone-900 dark:text-white">
                    Unlock Complete Telugu Grandham
                  </h2>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Enter your details below to proceed with instant UPI / Card payment of <strong className="text-emerald-600 dark:text-emerald-400">₹{price}</strong>.
                  </p>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-xs font-medium">
                    {errorMessage}
                  </div>
                )}

                {/* Form Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-300 dark:border-white/10 text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-[#d4720a] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      WhatsApp Mobile Number *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400">
                        +91
                      </span>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={mobileNumber}
                        onChange={handleMobileChange}
                        placeholder="9876543210"
                        className="w-full pl-12 pr-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-300 dark:border-white/10 text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-[#d4720a] focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={emailAddress}
                      onChange={(e) => setEmailAddress(e.target.value)}
                      placeholder="e.g. ramesh@gmail.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-100 dark:bg-white/5 border border-stone-300 dark:border-white/10 text-xs text-stone-900 dark:text-white focus:ring-2 focus:ring-[#d4720a] focus:outline-none"
                    />
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="space-y-2 pt-1 text-[11px] text-stone-600 dark:text-stone-400">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
                      className="mt-0.5 rounded border-stone-300 text-[#d4720a] focus:ring-[#d4720a]"
                    />
                    <span>
                      I agree to the instant digital delivery of the 240-page Grandham publication upon payment of ₹{price}.
                    </span>
                  </label>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-[#d4720a] to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 transform hover:scale-102 transition-all cursor-pointer uppercase tracking-wider"
                >
                  <CreditCard size={18} />
                  <span>Pay ₹{price} &amp; Download PDF</span>
                  <ArrowRight size={16} />
                </button>

                {/* Alternate WhatsApp Option */}
                <div className="pt-2 text-center">
                  <span className="text-[11px] text-stone-400 block mb-1.5">— Or Purchase via Office Assistant —</span>
                  <a
                    href={`https://wa.me/919246624248?text=${whatsappMessage}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:underline"
                  >
                    <MessageCircle size={14} /> Buy directly on WhatsApp (+91 92466 24248)
                  </a>
                </div>
              </form>
            )}

            {(statusStep === 'processing' || statusStep === 'verifying') && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-[#d4720a]/20 border-t-[#d4720a] animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-[#d4720a]">
                    <Lock size={20} />
                  </div>
                </div>
                <h3 className="text-lg font-bold font-serif">
                  {statusStep === 'processing' ? 'Connecting to Cashfree Gateway...' : 'Verifying Payment & Issuing Entitlement...'}
                </h3>
                <p className="text-xs text-stone-500 max-w-xs leading-relaxed">
                  Please complete the checkout modal or window. Your high-resolution PDF download will begin immediately.
                </p>
              </div>
            )}

            {statusStep === 'success' && (
              <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500 flex items-center justify-center text-emerald-500">
                  <CheckCircle2 size={36} />
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full">
                    Payment Verified Successfully
                  </span>
                  <h3 className="text-xl font-bold font-serif mt-2">
                    Telugu Grandham Unlocked!
                  </h3>
                  <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm mx-auto">
                    Your payment of ₹{price} has been verified. Order ID: <code className="font-mono text-[11px] text-amber-500">{orderId}</code>.
                  </p>
                </div>

                {downloadUrl && (
                  <div className="w-full max-w-sm space-y-3">
                    <button
                      onClick={() => triggerBrowserDownload(downloadUrl, `${book.title}.pdf`)}
                      className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold text-sm shadow-xl flex items-center justify-center gap-2 cursor-pointer uppercase tracking-wider"
                    >
                      <Download size={18} />
                      <span>{downloadInitiated ? 'Download Again (PDF)' : 'Download Full PDF'}</span>
                    </button>

                    <a
                      href={`https://wa.me/919246624248?text=${encodeURIComponent(`Hello Dr. Rao, I have completed the ₹${price} payment for "${book.title}" (Order ID: ${orderId}). Please also share the copy on my WhatsApp.`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 rounded-xl bg-stone-100 dark:bg-white/5 hover:bg-stone-200 dark:hover:bg-white/10 text-stone-800 dark:text-stone-200 font-bold text-xs flex items-center justify-center gap-1.5 border border-stone-200 dark:border-white/10"
                    >
                      <MessageCircle size={14} /> Send PDF Backup on WhatsApp
                    </a>
                  </div>
                )}
              </div>
            )}

            {/* Modal Footer Note */}
            <div className="pt-4 border-t border-stone-100 dark:border-white/10 text-[10px] text-stone-400 text-center flex items-center justify-center gap-2">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span>100% Secure • Official Publication by Dr. Kunchala Hanumantha Rao</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default UnlockBookModal;
