import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Play, CheckCircle } from 'lucide-react';
import { type Video } from '../../../core/types/video';
import { getVideoSlug } from '../../../core/services/video.service';
import { Skeleton } from '../../../shared/components/ui/Skeleton';

interface VideoCardProps {
  video: Video;
  onClick?: (video: Video) => void;
}

const formatViews = (views?: number): string => {
  if (!views) return '0';
  if (views >= 1_000_000) return `${(views / 1_000_000).toFixed(1)}M`;
  if (views >= 1_000) return `${(views / 1_000).toFixed(1)}K`;
  return new Intl.NumberFormat('en-IN').format(views);
};

const formatTimeAgo = (dateStr?: string): string => {
  if (!dateStr) return '';
  const now = new Date();
  const date = new Date(dateStr);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) return `${diffInDays}d ago`;
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths}mo ago`;
  const diffInYears = Math.floor(diffInMonths / 12);
  return `${diffInYears}y ago`;
};

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef<any | null>(null);

  const handleMouseEnter = () => {
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(true);
    }, 600);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovered(false);
  };

  const thumbnailUrl = video.thumbnail_max || video.thumbnail_high || video.thumbnail_medium || video.thumbnail_default || 'https://hrvasthu.com/hero.png';
  const videoSlug = getVideoSlug(video);

  return (
    <Link 
      to={`/video/${videoSlug}`} 
      className="group flex flex-col w-full cursor-pointer select-none" 
      onClick={() => onClick && onClick(video)}
    >
      {/* ── YouTube-Style Thumbnail Container (16:9) ── */}
      <div 
        className="relative w-full aspect-video rounded-2xl overflow-hidden bg-stone-900 shadow-md border border-stone-200/40 dark:border-stone-800"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {!isHovered ? (
          <>
            <img 
              src={thumbnailUrl} 
              alt={video.title} 
              width={480}
              height={270}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover transform group-hover:scale-[1.03] transition-transform duration-300 ease-out"
            />
            {/* Dark gradient shadow at bottom */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Play Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform">
                <Play size={20} className="fill-white ml-0.5" />
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 w-full h-full bg-black">
            <iframe
              src={`${video.embed_url}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1`}
              className="w-full h-full border-none pointer-events-none"
              title={video.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </div>
        )}

        {/* Duration Badge */}
        <div className="absolute right-2 bottom-2 px-1.5 py-0.5 rounded-md text-[11px] font-mono font-semibold bg-black/85 text-white z-10 shadow-sm">
          {video.duration || '10:00'}
        </div>
      </div>

      {/* ── YouTube-Style Meta Details Section ── */}
      <div className="flex gap-3 pt-3 px-1 items-start">
        {/* Author Avatar / Dr. Rao Channel Logo */}
        <div className="w-9 h-9 rounded-full overflow-hidden shrink-0 ring-1 ring-gold-500/30 shadow-sm bg-gradient-to-tr from-amber-600 to-gold-500 flex items-center justify-center text-white font-serif font-bold text-xs">
          HR
        </div>

        {/* Video Title & Meta Stats */}
        <div className="flex-1 min-w-0 space-y-1">
          <h4 
            className="text-sm font-semibold text-stone-900 dark:text-stone-100 group-hover:text-gold-500 transition-colors line-clamp-2 leading-snug" 
            title={video.title}
          >
            {video.title}
          </h4>

          {/* Channel Name with Verified Check */}
          <div className="flex items-center gap-1 text-xs text-stone-500 dark:text-stone-400 font-medium">
            <span>Dr. Kunchala Hanumantha Rao</span>
            <CheckCircle size={12} className="text-stone-400 fill-stone-400/20 shrink-0" />
          </div>

          {/* Views & Published Date */}
          <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
            <span>{formatViews(video.views)} views</span>
            <span>•</span>
            <span>{formatTimeAgo(video.published_at || video.created_at)}</span>
            {video.category && video.category !== 'General' && (
              <>
                <span>•</span>
                <span className="text-[10px] px-1.5 py-0.2 bg-stone-200/60 dark:bg-stone-800 text-stone-600 dark:text-stone-300 rounded font-medium">
                  {video.category}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;

export const VideoCardSkeleton: React.FC = () => {
  return (
    <div className="w-full flex flex-col space-y-3">
      <Skeleton className="w-full aspect-video rounded-2xl" />
      <div className="flex gap-3 px-1">
        <Skeleton variant="circular" className="w-9 h-9 shrink-0" />
        <div className="flex-1 space-y-2 py-0.5">
          <Skeleton variant="text" className="w-full h-4" />
          <Skeleton variant="text" className="w-3/4 h-3" />
          <Skeleton variant="text" className="w-1/2 h-3" />
        </div>
      </div>
    </div>
  );
};
