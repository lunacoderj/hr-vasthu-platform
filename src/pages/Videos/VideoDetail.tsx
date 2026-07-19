import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Eye, ThumbsUp, MessageCircle, Calendar } from 'lucide-react';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Button, Spinner } from '../../shared/components/ui';
import { videoService } from '../../core/services/video.service';
import { supabase } from '../../core/services/supabase';
import { type Video } from '../../core/types/video';
import { VideoCard } from './components/VideoCard';
import { JsonLd } from '../../shared/components/seo/JsonLd';

export const VideoDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [video, setVideo] = useState<Video | null>(null);
  const [similarVideos, setSimilarVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadVideo = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        const data = await videoService.getVideoById(id);
        setVideo(data);
        if (data) {
          const similar = await videoService.getSimilarVideos(data, 4);
          setSimilarVideos(similar);
        }
      } catch (error) {
        console.error("Error loading video:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadVideo();
  }, [id]);

  const trackEvent = async (eventType: 'play' | 'pause' | 'complete', playedSeconds: number) => {
    if (!video) return;
    try {
      await supabase.from('video_events').insert({
        video_id: video.id,
        event_type: eventType,
        watch_time_seconds: Math.floor(playedSeconds)
      });
    } catch (e) {
      console.error('Failed to track video event', e);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50 dark:bg-stone-950">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 dark:bg-stone-950 px-4">
        <Typography variant="h2" className="mb-6">Video Not Found</Typography>
        <Button variant="primary" onClick={() => navigate('/videos')} icon={<ArrowLeft size={18} />} iconPosition="left">
          Back to All Videos
        </Button>
      </div>
    );
  }

  const formatNumber = (num?: number) => {
    if (num === undefined) return '0';
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-IN', options);
  };

  const videoSchema = video ? {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description || video.title,
    "thumbnailUrl": [
      video.thumbnail_medium || video.thumbnail_default || video.thumbnail
    ],
    "uploadDate": video.published_at || video.created_at,
    "duration": "PT10M", // Ideally parsed from video.duration
    "contentUrl": video.embed_url,
    "embedUrl": video.embed_url,
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": { "@type": "WatchAction" },
      "userInteractionCount": video.views || 0
    }
  } : null;

  const videoId = video.youtube_id || video.embed_url?.split('/embed/')[1]?.split('?')[0] || video.watch_url?.split('v=')[1]?.split('&')[0] || '';
  
  let cleanEmbedUrl = '';
  const currentOrigin = encodeURIComponent(window.location.origin);
  if (videoId) {
    cleanEmbedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&enablejsapi=1&playsinline=1&origin=${currentOrigin}`;
  } else if (video.embed_url) {
    const separator = video.embed_url.includes('?') ? '&' : '?';
    cleanEmbedUrl = `${video.embed_url}${separator}playsinline=1&origin=${currentOrigin}`;
  } else {
    cleanEmbedUrl = '';
  }

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-6">
      {videoSchema && <JsonLd data={videoSchema} />}
      <Container size="xl">
        {/* Large Back Button for Accessibility */}
        <div className="mb-4">
          <Link to="/videos" className="inline-flex items-center text-stone-500 hover:text-stone-900 dark:hover:text-white font-medium text-sm transition-colors">
            <ArrowLeft size={16} className="mr-1" />
            Back to Videos
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content Area (Left) */}
          <div className="w-full lg:w-[70%]">
            {/* Video Embed Player */}
            <div className="w-full bg-black rounded-xl shadow-xl aspect-video mb-4 relative z-20">
              <iframe
                src={cleanEmbedUrl}
                className="w-full h-full rounded-xl pointer-events-auto"
                style={{ pointerEvents: 'auto' }}
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => trackEvent('play', 0)}
              ></iframe>
            </div>

            {/* Title & Stats */}
            <Typography variant="h2" className="mb-2 text-xl md:text-2xl font-bold line-clamp-2">
              {video.title}
            </Typography>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 pb-4 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-sm font-medium">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Eye size={16} />
                  <span>{formatNumber(video.views)} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} />
                  <span>{formatDate(video.published_at || video.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-stone-100 dark:bg-stone-800/50 px-4 py-2 rounded-full">
                <button className="flex items-center gap-2 hover:text-stone-900 dark:hover:text-white transition-colors">
                  <ThumbsUp size={16} />
                  <span>{formatNumber(video.likes)}</span>
                </button>
                <div className="w-px h-4 bg-stone-300 dark:bg-stone-700"></div>
                <button className="flex items-center gap-2 hover:text-stone-900 dark:hover:text-white transition-colors">
                  <MessageCircle size={16} />
                  <span>{formatNumber(video.comments)}</span>
                </button>
              </div>
            </div>

            {/* Description Box */}
            <div className="bg-stone-100 dark:bg-stone-800/30 rounded-xl p-4 text-sm md:text-base text-stone-800 dark:text-stone-200">
              <div className="font-semibold mb-2">
                {formatNumber(video.views)} views • {formatDate(video.published_at || video.created_at)}
              </div>
              <div className="prose dark:prose-invert max-w-none leading-relaxed whitespace-pre-line">
                {video.description || "No description provided."}
              </div>
            </div>
          </div>

          {/* Up Next Sidebar (Right) */}
          <div className="w-full lg:w-[30%] flex flex-col gap-4">
            <Typography variant="h3" className="text-lg font-bold mb-2">
              Up Next
            </Typography>
            {similarVideos.length > 0 ? (
              similarVideos.map((simVideo) => (
                <Link to={`/videos/${simVideo.id}`} key={simVideo.id} className="flex gap-2 group cursor-pointer">
                  <div className="relative w-[168px] shrink-0 aspect-video rounded-lg overflow-hidden bg-stone-200 dark:bg-stone-800">
                    <img 
                      src={simVideo.thumbnail_medium || simVideo.thumbnail} 
                      alt={simVideo.title} 
                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1 rounded">
                      {simVideo.duration || '10:00'}
                    </div>
                  </div>
                  <div className="flex flex-col min-w-0 py-1">
                    <Typography variant="h4" className="text-sm font-semibold line-clamp-2 group-hover:text-gold-600 transition-colors leading-tight mb-1">
                      {simVideo.title}
                    </Typography>
                    <span className="text-xs text-stone-500 dark:text-stone-400">HR Vasthu</span>
                    <span className="text-xs text-stone-500 dark:text-stone-400">{formatNumber(simVideo.views)} views • {new Date(simVideo.published_at || simVideo.created_at).getFullYear()}</span>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-stone-500 text-sm">No related videos found.</p>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
};

export default VideoDetail;
