import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle } from 'lucide-react';
import { type Video } from '../../../core/types/video';

interface VideoCardProps {
  video: Video;
  onClick?: (video: Video) => void;
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const hoverTimeout = useRef<any | null>(null);

  const handleMouseEnter = () => {
    // Delay playing slightly to prevent accidental plays when just moving mouse across
    hoverTimeout.current = setTimeout(() => {
      setIsHovered(true);
    }, 500);
  };

  const handleMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    setIsHovered(false);
  };

  const thumbnailUrl = video.thumbnail_medium || video.thumbnail_default || video.thumbnail;
  // Default channel avatar
  const avatarUrl = "https://ui-avatars.com/api/?name=HR+Vasthu&background=b45309&color=fff"; 

  return (
    <Link 
      to={`/videos/${video.id}`} 
      className="block h-full group" 
      onClick={() => onClick && onClick(video)}
    >
      <div 
        className="h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-[#d4720a]/30 transition-all duration-300 p-3 hover:shadow-[0_10px_35px_rgba(212,114,10,0.15)] flex flex-col justify-between magnetic"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <div>
          {/* Thumbnail / Iframe Preview */}
          <div className="relative rounded-xl overflow-hidden aspect-video bg-stone-950/80 mb-3 border border-white/5">
            {!isHovered ? (
              <>
                <img 
                  src={thumbnailUrl} 
                  alt={video.title} 
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-[#0a0a0f]/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                  <PlayCircle size={40} className="text-[#d4720a] drop-shadow-[0_0_10px_rgba(212,114,10,0.5)] transform scale-90 group-hover:scale-100 transition-transform duration-300" />
                </div>
              </>
            ) : (
              <div className="absolute inset-0 z-20 w-full h-full bg-black">
                <iframe
                  src={`${video.embed_url}?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&modestbranding=1`}
                  className="w-full h-full"
                  title={video.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                ></iframe>
              </div>
            )}
            
            <div className="absolute right-2 bottom-2 px-2 py-0.5 rounded text-[11px] font-semibold bg-black/80 text-stone-200 z-10">
              {video.duration || '10:00'}
            </div>
          </div>

          {/* Details */}
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10">
              <img src={avatarUrl} alt="HR Vasthu" className="w-full h-full object-cover" />
            </div>
            
            <div className="flex-1 min-w-0">
              <h4 
                className="text-sm font-medium text-stone-100 group-hover:text-[#d4720a] transition-colors duration-200 line-clamp-2 leading-snug" 
                title={video.title}
              >
                {video.title}
              </h4>
              
              <div className="text-xs text-stone-400 font-light mt-1">
                HR Vasthu
              </div>

              <div className="flex items-center gap-1.5 text-[11px] text-stone-400 font-light mt-0.5">
                <span>{new Intl.NumberFormat('en-IN').format(video.views || 0)} views</span>
                <span>•</span>
                <span className="uppercase text-[#d4720a] font-medium">{video.language}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
