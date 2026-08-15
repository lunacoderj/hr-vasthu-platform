import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MessageCircle, X, Send, Play, BookOpen, Compass, ChevronRight, Phone, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  '🧭 Best Main Entrance Direction?',
  '🍳 Kitchen Vastu Mistakes to Avoid',
  '🛏️ Master Bedroom Location & Bed Direction',
  '🕉️ Pooja Room in North-East (Eshanya)?',
  '🚽 Toilet / Bathroom Vastu Remedies',
  '🌊 Underground Water Sump & Borewell Rules'
];

export const VastuAIAssistant: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-msg',
      sender: 'ai',
      text: "Namaste! 🙏 I am **HR Vasthu AI Assistant**, trained on authentic Vedic architecture principles by **Dr. Kunchala Hanumantha Rao**.\n\nAsk me any question about your house, plot, kitchen, pooja room, or entrance facing!",
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
      // Call Vercel serverless / backend AI endpoint
      const res = await fetch('/api/ai/vastu-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSend })
      });

      if (!res.ok) throw new Error('AI service response error');
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
      // Fallback response with offline Vedic advice
      const fallbackAi: Message = {
        id: `ai-fallback-${Date.now()}`,
        sender: 'ai',
        text: `### 🧭 Vastu Guidelines for: "${textToSend}"\n\n` +
          `• Maintain proper harmony between the 5 sacred elements (Pancha Bhootas).\n` +
          `• North-East (Eshanya) should be light & sacred, while South-West (Niruthi) must be high & heavy.\n` +
          `• For customized layout verification, please reach out to Dr. Rao directly on WhatsApp.`,
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
      {/* Floating CTA Button with Pulsing Glow */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
        <AnimatePresence>
          {!isOpen && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsOpen(true)}
              className="relative group flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#d4720a] via-amber-500 to-[#e68a1c] text-white font-bold text-sm rounded-full shadow-[0_10px_25px_rgba(212,114,10,0.4)] border border-white/20 cursor-pointer overflow-hidden"
              aria-label="Ask Vastu AI Assistant"
            >
              {/* Shimmer light effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles size={16} className="text-white animate-pulse" />
              </div>
              <span className="tracking-wide">Ask Vastu AI</span>
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-400"></span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Expandable Interactive AI Chat Modal */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="w-[92vw] sm:w-[420px] h-[580px] max-h-[85vh] bg-white dark:bg-[#0f0f15] rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 flex flex-col overflow-hidden text-stone-900 dark:text-stone-100"
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
                  className="p-1.5 rounded-full hover:bg-white/10 text-stone-400 hover:text-white transition-colors"
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
                      className={`max-w-[90%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
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
                      <div>{msg.text}</div>

                      {/* Recommended YouTube Video Embeds inside Chat */}
                      {msg.recommendedVideos && msg.recommendedVideos.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-stone-100 dark:border-stone-800/80 space-y-2">
                          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">
                            Recommended Vastu Video Lessons:
                          </span>
                          {msg.recommendedVideos.map((video: any) => (
                            <Link
                              to={`/videos/${video.id}`}
                              key={video.id}
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-2 p-2 rounded-xl bg-stone-50 dark:bg-stone-800 hover:bg-gold-500/10 dark:hover:bg-gold-500/10 border border-stone-200/50 dark:border-stone-700 transition-colors group"
                            >
                              <img
                                src={video.thumbnail_medium || 'https://hrvasthu.com/hero.png'}
                                alt={video.title}
                                className="w-14 aspect-video rounded-md object-cover"
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

                      {/* WhatsApp Consultation Action Button */}
                      {msg.whatsappUrl && (
                        <div className="mt-3 pt-2">
                          <a
                            href={msg.whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors"
                          >
                            <MessageCircle size={14} />
                            <span>Verify Your Plan with Dr. Rao</span>
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
                    <span>Analyzing Vedic directional alignments...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Prompt Suggestions */}
              {messages.length < 3 && (
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
              )}

              {/* Input Footer */}
              <div className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 flex items-center gap-2">
                <input
                  type="text"
                  value={inputQuery}
                  onChange={e => setInputQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Ask anything about Vastu (English/Telugu)..."
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
      </div>
    </>
  );
};

export default VastuAIAssistant;
