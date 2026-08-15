import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Compass, Play, MessageCircle, ExternalLink, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';

interface VastuAIOverviewProps {
  query: string;
  onCloseModal?: () => void;
}

export const VastuAIOverview: React.FC<VastuAIOverviewProps> = ({ query, onCloseModal }) => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    const fetchAIOverview = async () => {
      if (!query.trim()) return;
      setIsLoading(true);
      try {
        const res = await fetch('/api/ai/vastu-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query })
        });
        if (res.ok) {
          const result = await res.json();
          if (isMounted) setData(result);
        }
      } catch (err) {
        console.error('Failed to load AI overview:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    const timer = setTimeout(fetchAIOverview, 300);
    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [query]);

  if (!query.trim()) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="m-4 p-5 rounded-2xl bg-gradient-to-b from-amber-500/10 via-stone-50 to-white dark:from-amber-500/5 dark:via-stone-900 dark:to-stone-900 border border-amber-500/20 shadow-md space-y-4"
    >
      {/* Header Badge */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-gradient-to-r from-gold-600 to-amber-500 text-white shadow-sm">
            <Sparkles size={16} />
          </div>
          <span className="font-serif font-bold text-xs uppercase tracking-wider text-gold-700 dark:text-gold-400">
            Vastu AI Search Overview
          </span>
        </div>
        {data?.directionBadge && (
          <span className="text-[10px] font-bold px-2.5 py-1 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300 rounded-full border border-stone-200 dark:border-stone-700 flex items-center gap-1">
            <Compass size={12} className="text-gold-500" /> {data.directionBadge}
          </span>
        )}
      </div>

      {isLoading ? (
        <div className="py-6 flex items-center justify-center gap-3 text-stone-500 text-xs">
          <div className="w-4 h-4 border-2 border-t-gold-500 border-r-transparent border-b-gold-500/20 border-l-transparent rounded-full animate-spin" />
          <span>Generating authentic Vastu AI insight for "{query}"...</span>
        </div>
      ) : data?.answer ? (
        <div className="space-y-4 text-xs md:text-sm text-stone-800 dark:text-stone-200 leading-relaxed">
          <div className="prose dark:prose-invert max-w-none text-xs md:text-sm whitespace-pre-line">
            {data.answer}
          </div>

          {/* Video Recommendations */}
          {data.recommendedVideos && data.recommendedVideos.length > 0 && (
            <div className="pt-3 border-t border-stone-200 dark:border-stone-800 space-y-2">
              <span className="text-[11px] font-bold uppercase text-stone-500 block">
                Related YouTube Video Lessons by Dr. Hanumantha Rao:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {data.recommendedVideos.map((v: any) => (
                  <Link
                    to={`/videos/${v.id}`}
                    key={v.id}
                    onClick={onCloseModal}
                    className="flex items-center gap-2 p-2 rounded-xl bg-white dark:bg-stone-800 hover:border-gold-500 border border-stone-200 dark:border-stone-700 transition-colors group"
                  >
                    <img
                      src={v.thumbnail_medium || 'https://hrvasthu.com/hero.png'}
                      alt={v.title}
                      className="w-16 aspect-video rounded-lg object-cover shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="text-[11px] font-bold line-clamp-1 group-hover:text-gold-500 text-stone-900 dark:text-white">
                        {v.title}
                      </h5>
                      <span className="text-[9px] text-stone-400 flex items-center gap-1 mt-0.5">
                        <Play size={10} className="text-gold-500" /> Watch Lesson
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Direct WhatsApp Call to Action */}
          {data.whatsappCta && (
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 bg-green-500/10 p-3 rounded-xl border border-green-500/20">
              <span className="text-xs font-semibold text-green-800 dark:text-green-300">
                Have specific queries about your house layout?
              </span>
              <a
                href={data.whatsappCta.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold text-xs shadow-md transition-colors flex items-center gap-1.5 shrink-0"
              >
                <MessageCircle size={14} />
                <span>Chat with Dr. Rao</span>
              </a>
            </div>
          )}
        </div>
      ) : null}
    </motion.div>
  );
};

export default VastuAIOverview;
