/**
 * HR VASTHU — Official Console Security & Grand Vedic Welcome Banner
 * Displays an elegant, branded Vedic Vastu invitation and security badge in the browser DevTools.
 */

export function setupConsoleBranding(): void {
  if (typeof window === 'undefined') return;

  const isProduction = (import.meta as any).env?.PROD || window.location.hostname !== 'localhost';

  // Clear noisy framework debug logs in production once upon boot
  if (isProduction) {
    try {
      console.clear();
    } catch {}
  }

  const titleStyle = [
    'background: linear-gradient(135deg, #b45309 0%, #d97706 50%, #78350f 100%)',
    'color: #ffffff',
    'font-size: 18px',
    'font-weight: 900',
    'padding: 12px 24px',
    'border-radius: 8px',
    'border: 1px solid #f59e0b',
    'text-shadow: 0 2px 4px rgba(0,0,0,0.6)',
    'font-family: serif, system-ui, sans-serif',
  ].join(';');

  const subHeaderStyle = [
    'background: #1c1917',
    'color: #fbbf24',
    'font-size: 13px',
    'font-weight: 700',
    'padding: 6px 14px',
    'border-radius: 4px',
    'margin-top: 4px',
    'border-left: 4px solid #d97706',
  ].join(';');

  const badgeStyle = [
    'background: #0f172a',
    'color: #38bdf8',
    'font-size: 12px',
    'font-weight: 600',
    'padding: 4px 10px',
    'border-radius: 4px',
  ].join(';');

  const contactStyle = [
    'background: #064e3b',
    'color: #34d399',
    'font-size: 13px',
    'font-weight: 800',
    'padding: 8px 16px',
    'border-radius: 6px',
    'margin-top: 6px',
  ].join(';');

  const warningStyle = [
    'color: #ef4444',
    'font-size: 12px',
    'font-weight: 700',
  ].join(';');

  const yantraArt = `
           ▲
          ▲ ▲
         ▲   ▲        ╔══════════════════════════════════════════════════════════════╗
        ▲  ☸  ▲       ║       🕉️  హనుమంతరావు వాస్తు సిద్ధాంతి  🕉️                     ║
       ▲▲▲▲▲▲▲▲▲      ║    DR. KUNCHALA HANUMANTHA RAO (VASTHU SIDDANTHI)            ║
      ▲         ▲     ╚══════════════════════════════════════════════════════════════╝
     ▲   ESHANYA ▲
    ▲  (N-E WATER)▲   🏛️  30+ Years of Empirical Vedic Architectural Science
   ▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲▲  🏆  Recipient of International Nepal Sadbhavana Award
  `;

  console.log(`%c${yantraArt}`, 'color: #d97706; font-weight: bold; font-family: monospace;');

  console.log(
    '%c🌟 WELCOME TO HR VASTHU OFFICIAL PLATFORM 🌟',
    titleStyle
  );

  console.log(
    '%c✦ Sthapatya Veda Architecture • 100% Non-Demolition Remedies • 3D House Blueprints',
    subHeaderStyle
  );

  console.log(
    '%c📞 DIRECT CONSULTATION & APPOINTMENT BOOKING:',
    'color: #e2e8f0; font-size: 13px; font-weight: bold; margin-top: 8px;'
  );

  console.log(
    '%c 📱 Call Now: +91 92466 24248  |  💬 WhatsApp: https://wa.me/919246624248 ',
    contactStyle
  );

  console.log(
    '%c 🌐 Official Portal: https://www.hrvasthu.com  |  📍 Visakhapatnam, Andhra Pradesh ',
    badgeStyle
  );

  console.log(
    '%c🔒 SECURITY & AUDIT NOTICE: All architectural downloads and payment verifications are cryptographically monitored. Unauthorized tampering or script injection is strictly logged.',
    warningStyle
  );

  console.log('\n');
}
