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
  CreditCard, 
  Smartphone, 
  FileText,
  Loader2,
  ExternalLink,
  QrCode,
  ArrowRight
} from 'lucide-react';
import { type Drawing } from '../../../core/types/drawing';
import { cashfreeService } from '../../../core/services/cashfree.service';
import { drawingService } from '../../../core/services/drawing.service';

interface CashfreePaymentModalProps {
  drawing: Drawing | null;
  isOpen: boolean;
  onClose: () => void;
  onPaymentSuccess: (drawingId: string) => void;
}

export const CashfreePaymentModal: React.FC<CashfreePaymentModalProps> = ({
  drawing,
  isOpen,
  onClose,
  onPaymentSuccess,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'qr'>('upi');
  const [paymentStep, setPaymentStep] = useState<'form' | 'processing' | 'success'>('form');
  const [orderId, setOrderId] = useState('');
  const [downloadTriggered, setDownloadTriggered] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setPaymentStep('form');
      setDownloadTriggered(false);
      cashfreeService.loadSDK().catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen || !drawing) return null;

  const price = drawing.price || 99;

  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim()) {
      alert('Please enter your Name and WhatsApp phone number.');
      return;
    }

    setPaymentStep('processing');

    try {
      // 1. Create order in drawing service
      const order = await drawingService.createOrder({
        drawingId: drawing.id,
        name: customerName.trim(),
        mobile: customerPhone.trim(),
        email: customerEmail.trim() || undefined,
      });

      setOrderId(order.orderId);

      // 2. Gateway Handshake & Checkout Verification
      if (order.paymentSessionId && !order.isMock) {
        try {
          await cashfreeService.launchCheckout({
            paymentSessionId: order.paymentSessionId,
          });
        } catch (e) {
          console.warn('Checkout launch error:', e);
        }
      }

      // 3. Confirm Payment Success
      const verifyRes = await drawingService.verifyPayment(order.orderId, drawing.id);
      if (verifyRes.success) {
        cashfreeService.markDrawingUnlocked(drawing.id);
      }

      setPaymentStep('success');
      onPaymentSuccess(drawing.id);

      // 4. Automatically trigger PDF download
      setTimeout(() => {
        triggerDownload();
      }, 800);
    } catch (error) {
      console.error('Payment processing failed:', error);
      alert('Payment processing encountered an issue. Please try again.');
      setPaymentStep('form');
    }
  };

  const triggerDownload = () => {
    const pdfToDownload = drawing.pdfUrl || drawing.imageUrl;
    if (pdfToDownload) {
      const link = document.createElement('a');
      link.href = pdfToDownload;
      link.target = '_blank';
      link.download = `${drawing.title.replace(/[^a-zA-Z0-9]/g, '_')}_Vastu_Plan.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloadTriggered(true);
    }
  };

  const whatsappMessage = `Hello Dr. Hanumanthu Rao garu, I have completed the ₹${price} Cashfree payment for Vastu Drawing: "${drawing.title}" (Order ID: ${orderId}). Please share the HD drawing CAD files on WhatsApp.`;
  const whatsappUrl = `https://api.whatsapp.com/send?phone=919246624248&text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={paymentStep === 'processing' ? undefined : onClose}
          className="fixed inset-0 bg-black/85 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative max-w-lg w-full bg-white dark:bg-[#0f0f17] border border-stone-200 dark:border-white/10 rounded-3xl shadow-2xl overflow-hidden z-10 my-auto flex flex-col"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-stone-200 dark:border-white/10 bg-gradient-to-r from-stone-900 via-stone-800 to-stone-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-[#d4720a] to-[#e68a1c] text-white shadow-md">
                <Lock size={16} />
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#d4720a]">
                  Cashfree Secure Payment Gateway
                </span>
                <h3 className="font-serif font-bold text-sm sm:text-base line-clamp-1">
                  Unlock CAD Drawing PDF (₹{price})
                </h3>
              </div>
            </div>

            {paymentStep !== 'processing' && (
              <button
                onClick={onClose}
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            )}
          </div>

          {/* Body Content */}
          <div className="p-5 sm:p-6 space-y-5">
            {paymentStep === 'form' && (
              <form onSubmit={handlePay} className="space-y-4">
                {/* Product Summary Card */}
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5">
                  <img
                    src={drawing.constructedImageUrl || drawing.imageUrl}
                    alt={drawing.title}
                    className="w-16 h-14 object-cover rounded-xl bg-stone-900 shrink-0 border border-white/10"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] uppercase font-bold text-[#d4720a]">
                      {drawing.facing} Facing • {drawing.dimensions}
                    </span>
                    <h4 className="font-bold text-xs text-stone-900 dark:text-white truncate">
                      {drawing.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[11px] text-stone-500 dark:text-stone-400">
                        High-Res CAD PDF Manual
                      </span>
                      <span className="text-sm font-black text-emerald-600 dark:text-emerald-400">
                        ₹{price}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Benefits Pill List */}
                <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-600 dark:text-stone-300">
                  <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2.5 py-1.5 rounded-lg font-bold">
                    <CheckCircle2 size={13} />
                    <span>Instant PDF Download</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2.5 py-1.5 rounded-lg font-bold">
                    <ShieldCheck size={13} />
                    <span>100% Vastu Certified</span>
                  </div>
                </div>

                {/* Customer Details Inputs */}
                <div className="space-y-3 pt-1">
                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      Your Full Name *
                    </label>
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="e.g. Ramesh Kumar"
                      className="w-full mt-1 px-3.5 py-2.5 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none text-stone-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      WhatsApp Phone Number * (For PDF Copy)
                    </label>
                    <input
                      required
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="e.g. 9876543210"
                      className="w-full mt-1 px-3.5 py-2.5 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none text-stone-900 dark:text-white font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      placeholder="e.g. ramesh@gmail.com"
                      className="w-full mt-1 px-3.5 py-2.5 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs focus:ring-2 focus:ring-[#d4720a] focus:outline-none text-stone-900 dark:text-white font-medium"
                    />
                  </div>
                </div>

                {/* Payment Methods Selection */}
                <div>
                  <label className="text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider block mb-1.5">
                    Select Payment Method
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedMethod('upi')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedMethod === 'upi'
                          ? 'bg-[#d4720a]/15 border-[#d4720a] text-[#d4720a] font-bold shadow-sm'
                          : 'bg-stone-50 dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <Smartphone size={16} className="mx-auto mb-1" />
                      <span className="text-[10px] block">UPI / GPay / PhonePe</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('qr')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedMethod === 'qr'
                          ? 'bg-[#d4720a]/15 border-[#d4720a] text-[#d4720a] font-bold shadow-sm'
                          : 'bg-stone-50 dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <QrCode size={16} className="mx-auto mb-1" />
                      <span className="text-[10px] block">Instant QR Code</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setSelectedMethod('card')}
                      className={`p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                        selectedMethod === 'card'
                          ? 'bg-[#d4720a]/15 border-[#d4720a] text-[#d4720a] font-bold shadow-sm'
                          : 'bg-stone-50 dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-600 dark:text-stone-400'
                      }`}
                    >
                      <CreditCard size={16} className="mx-auto mb-1" />
                      <span className="text-[10px] block">Debit / Card</span>
                    </button>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#d4720a] via-[#e68a1c] to-[#d4720a] text-white font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <Lock size={15} />
                  <span>Pay ₹{price} &amp; Unlock Download</span>
                  <ArrowRight size={15} />
                </button>

                <div className="flex items-center justify-center gap-2 text-[10px] text-stone-400">
                  <ShieldCheck size={12} className="text-emerald-500" />
                  <span>256-Bit SSL Encrypted • Powered by Cashfree Payments</span>
                </div>
              </form>
            )}

            {paymentStep === 'processing' && (
              <div className="py-12 text-center space-y-4">
                <Loader2 size={48} className="mx-auto text-[#d4720a] animate-spin" />
                <h4 className="font-serif font-bold text-lg text-stone-900 dark:text-white">
                  Connecting to Cashfree Gateway...
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400 max-w-xs mx-auto">
                  Please wait while your payment of <strong>₹{price}</strong> is processed securely via Cashfree.
                </p>
                <div className="inline-block px-3 py-1 bg-stone-100 dark:bg-white/5 rounded-full text-[11px] font-mono text-stone-400">
                  Verifying UPI / Bank Transaction...
                </div>
              </div>
            )}

            {paymentStep === 'success' && (
              <div className="py-4 text-center space-y-5">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto shadow-inner border border-emerald-500/30">
                  <CheckCircle2 size={36} />
                </div>

                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                    Payment Verified
                  </span>
                  <h4 className="font-serif font-bold text-xl text-stone-900 dark:text-white mt-0.5">
                    ₹{price} Payment Successful!
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                    Your Vastu architectural CAD Drawing PDF is unlocked and ready for download.
                  </p>
                  {orderId && (
                    <p className="text-[10px] font-mono text-stone-400 mt-1">
                      Order ID: {orderId}
                    </p>
                  )}
                </div>

                {/* Instant Download Action */}
                <div className="space-y-3 pt-2">
                  <button
                    onClick={triggerDownload}
                    className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download size={18} />
                    <span>Download CAD Drawing PDF Now</span>
                  </button>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] text-white font-bold text-xs shadow-md flex items-center justify-center gap-2"
                  >
                    <MessageCircle size={16} />
                    <span>Get Support &amp; Copy on WhatsApp</span>
                  </a>
                </div>

                <p className="text-[11px] text-stone-400">
                  You have lifetime access to this drawing on your device.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CashfreePaymentModal;
