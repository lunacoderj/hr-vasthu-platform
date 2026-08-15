import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X, Send, Play, Compass, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getVideoSlug } from '../../../core/services/video.service';

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  directionBadge?: string;
  recommendedVideos?: any[];
  whatsappUrl?: string;
  timestamp: string;
}

const QUICK_PROMPTS = [
  '📞 Contact Dr. Hanumantha Rao',
  '🧭 Best Main Entrance Direction?',
  '📐 House Plans & Vastu Drawings',
  '🍳 Kitchen Vastu Rules (Agneya)',
  '🛏️ Master Bedroom Location (Niruthi)',
  '🕉️ Pooja Room in North-East (Eshanya)'
];

export const VastuAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "Namaste! 🙏 I am **HR Vasthu AI Assistant**, trained on authentic Vedic architecture principles by **Dr. Kunchala Hanumantha Rao**.\n\nAsk me any question about your house plan, contact info, kitchen, pooja room, or entrance facing!",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (queryText?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim() || isLoading) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/vastu-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend })
      });

      if (!res.ok) throw new Error('AI service error');
      const data = await res.json();

      const aiMessage: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || "According to Vastu Shastra principles, spatial balance is achieved through proper cardinal alignment.",
        directionBadge: data.directionBadge,
        recommendedVideos: data.recommendedVideos || [],
        whatsappUrl: data.whatsappCta?.url,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch {
      const fallbackAi: Message = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'ai',
        text: `### 🧭 Vastu Guidelines for: "${textToSend}"\n\n` +
          `• Maintain proper harmony between the 5 sacred elements (Pancha Bhootas).\n` +
          `• Contact Dr. Kunchala Hanumantha Rao at +91 92466 24248 for personalized floor plan verification.`,
        whatsappUrl: `https://wa.me/919246624248?text=${encodeURIComponent(`Hello Dr. Rao, I inquired about "${textToSend}". Please guide me.`)}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, fallbackAi]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Expandable Interactive AI Chat Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 md:right-6 z-[60] w-[92vw] sm:w-[420px] h-[580px] max-h-[80vh] bg-white dark:bg-[#0f0f15] rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden text-stone-900 dark:text-stone-100"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#0a0a0f] via-[#1a1410] to-[#26170a] text-white flex items-center justify-between border-b border-stone-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-gold-600 to-amber-500 flex items-center justify-center text-white shadow-md">
                  <Sparkles size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-serif font-bold text-sm tracking-wide">HR Vasthu AI</h3>
                    <span className="text-[9px] bg-gold-500/20 text-gold-400 font-mono font-bold px-1.5 py-0.5 rounded-full border border-gold-500/30">
                      Vedic 1.5
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Direct Knowledge of Dr. Hanumantha Rao
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors cursor-pointer"
                aria-label="Close Vastu AI Assistant"
              >
                <X size={18} />
              </button>
            </div>

            {/* Chat Message Scrollable Container */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 text-xs md:text-sm bg-stone-50/50 dark:bg-stone-950/40">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[92%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-r from-gold-600 to-amber-500 text-white rounded-br-none shadow-sm'
                        : 'bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 text-stone-800 dark:text-stone-200 rounded-bl-none shadow-sm'
                    }`}
                  >
                    {msg.directionBadge && (
                      <div className="mb-2 inline-flex items-center gap-1 bg-gold-500/10 text-gold-600 dark:text-gold-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-gold-500/20">
                        <Compass size={12} /> {msg.directionBadge}
                      </div>
                    )}
                    
                    <div className="space-y-1">{msg.text}</div>

                    {/* Recommended YouTube Video Embeds inside Chat */}
                    {msg.recommendedVideos && msg.recommendedVideos.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 space-y-2">
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                          Recommended Vastu Video Lessons:
                        </span>
                        {msg.recommendedVideos.map((video: any) => (
                          <Link
                            to={`/video/${getVideoSlug(video)}`}
                            key={video.id}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-gold-500/10 dark:hover:bg-gold-500/10 border border-stone-200/50 dark:border-stone-700 transition-colors group"
                          >
                            <img
                              src={video.thumbnail_medium || video.thumbnail_max || 'https://hrvasthu.com/hero.png'}
                              alt={video.title}
                              className="w-14 aspect-video rounded-md object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-[11px] font-bold line-clamp-1 group-hover:text-gold-500 text-stone-800 dark:text-stone-200">
                                {video.title}
                              </p>
                              <span className="text-[9px] text-stone-400 flex items-center gap-1">
                                <Play size={10} className="text-gold-500" /> Watch Lesson
                              </span>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}

                    {/* WhatsApp Action */}
                    {msg.whatsappUrl && (
                      <div className="mt-3 pt-2">
                        <a
                          href={msg.whatsappUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                        >
                          <MessageCircle size={14} />
                          <span>WhatsApp Consultation with Dr. Rao</span>
                        </a>
                      </div>
                    )}
                  </div>
                  <span className="text-[9px] text-stone-400 mt-1 px-1">{msg.timestamp}</span>
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-2 p-3 max-w-[80%] bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 text-stone-500 text-xs">
                  <div className="w-4 h-4 border-2 border-t-gold-500 border-r-transparent border-b-gold-500/20 border-l-transparent rounded-full animate-spin" />
                  <span>Analyzing Vedic principles...</span>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Prompt Suggestions */}
            <div className="px-3 py-2 bg-stone-100 dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 overflow-x-auto flex gap-1.5 scrollbar-none shrink-0">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt)}
                  className="px-2.5 py-1 bg-white dark:bg-stone-800 hover:bg-gold-50 dark:hover:bg-gold-900/20 text-stone-700 dark:text-stone-300 hover:text-gold-600 border border-stone-200 dark:border-stone-700 text-[10px] font-medium rounded-full whitespace-nowrap transition-colors cursor-pointer"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input Footer */}
            <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
              <input
                type="text"
                value={inputQuery}
                onChange={e => setInputQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask anything about Vastu or contact details..."
                className="flex-1 px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-gold-500 text-stone-900 dark:text-white"
              />
              <button
                onClick={() => handleSendMessage()}
                disabled={!inputQuery.trim() || isLoading}
                className="p-2.5 bg-gold-600 hover:bg-gold-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-md cursor-pointer"
                title="Send message"
              >
                <Send size={16} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VastuAIAssistant;
