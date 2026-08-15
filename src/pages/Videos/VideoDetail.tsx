import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ArrowLeft, Eye, ThumbsUp, MessageCircle, Calendar, Sparkles, BookOpen, MessageSquare, Compass, ShieldCheck, CheckCircle2, Play } from 'lucide-react';
import { Container } from '../../shared/components/layout/Container';
import Typography from '../../shared/components/content/Typography';
import { Button, Spinner } from '../../shared/components/ui';
import { videoService, getVideoSlug } from '../../core/services/video.service';
import { supabase } from '../../core/services/supabase';
import { type Video } from '../../core/types/video';
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
    window.scrollTo(0, 0);
  }, [id]);

  const trackEvent = (eventType: string, playbackPosition?: number) => {
    if (!video) return;
    try {
      supabase.from('video_analytics').insert({
        video_id: video.id,
        event_type: eventType,
        playback_position: playbackPosition || 0,
        user_session_id: 'session_' + Math.random().toString(36).substring(2, 9),
      });
    } catch {
      // analytics fail-open
    }
  };

  const formatNumber = (num?: number) => {
    if (!num) return '0';
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const parseIsoDuration = (duration?: string) => {
    if (!duration) return 'PT10M';
    if (duration.startsWith('PT')) return duration;
    return 'PT10M';
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
      <Container className="py-20 text-center">
        <Typography variant="h2" className="mb-4">Video Not Found</Typography>
        <p className="text-stone-500 mb-6">The requested Vastu video could not be located or may have been updated.</p>
        <Button onClick={() => navigate('/videos')}>Back to Videos</Button>
      </Container>
    );
  }

  const pageUrl = `https://hrvasthu.com/video/${getVideoSlug(video)}`;
  const videoThumbnail = video.thumbnail_max || video.thumbnail_medium || video.thumbnail_default || 'https://hrvasthu.com/hero.png';

  const videoSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": video.title,
    "description": video.description || `${video.title} - Authentic Vastu guidelines and remedies by Dr. Kunchala Hanumantha Rao.`,
    "thumbnailUrl": [videoThumbnail],
    "uploadDate": video.published_at || video.created_at,
    "duration": parseIsoDuration(video.duration),
    "contentUrl": video.watch_url,
    "embedUrl": video.embed_url,
    "publisher": {
      "@type": "Organization",
      "name": "HR Vasthu",
      "logo": {
        "@type": "ImageObject",
        "url": "https://hrvasthu.com/logo.png"
      }
    },
    "interactionStatistic": {
      "@type": "InteractionCounter",
      "interactionType": { "@type": "WatchAction" },
      "userInteractionCount": video.views || 0
    }
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": `What Vastu principles are covered in "${video.title}"?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `In this video lesson, Dr. Kunchala Hanumantha Rao explains crucial architectural alignments, directional energies (Ashta-Dikpalakas), and practical Vedic remedies.`
        }
      },
      {
        "@type": "Question",
        "name": "How can I get my house floor plan verified by Dr. Kunchala Hanumantha Rao?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You can connect directly with Dr. Rao by calling +91 92466 24248 or requesting an appointment on WhatsApp through hrvasthu.com."
        }
      }
    ]
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hrvasthu.com/" },
      { "@type": "ListItem", "position": 2, "name": "Videos", "item": "https://hrvasthu.com/videos" },
      { "@type": "ListItem", "position": 3, "name": video.title, "item": pageUrl }
    ]
  };

  const videoId = video.youtube_id || video.embed_url?.split('/embed/')[1]?.split('?')[0] || '';
  const cleanEmbedUrl = videoId 
    ? `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&rel=0&enablejsapi=1&playsinline=1`
    : video.embed_url;

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 py-8">
      <Helmet>
        <title>{`${video.title} | HR Vasthu Official`}</title>
        <meta name="description" content={video.description?.substring(0, 160) || `${video.title} - Authentic Vastu guidance by Dr. Kunchala Hanumantha Rao.`} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={video.title} />
        <meta property="og:description" content={video.description?.substring(0, 160) || video.title} />
        <meta property="og:image" content={videoThumbnail} />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:type" content="video.other" />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      <JsonLd data={videoSchema} />
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumbSchema} />

      <Container size="xl" className="pt-16 md:pt-20">
        
        {/* Back Link */}
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-stone-500 hover:text-gold-500 transition-colors mb-6 text-sm font-semibold cursor-pointer"
        >
          <ArrowLeft size={18} />
          <span>Back to Lessons</span>
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Video Presentation (Left 70%) */}
          <div className="w-full lg:w-[70%] space-y-6">
            
            {/* Player Container */}
            <div className="w-full bg-black rounded-3xl shadow-2xl aspect-video overflow-hidden border border-stone-800 relative z-10">
              <iframe
                src={cleanEmbedUrl}
                className="w-full h-full"
                title={video.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => trackEvent('play', 0)}
              />
            </div>

            {/* Video Headline */}
            <Typography variant="h1" className="text-xl sm:text-2xl md:text-3xl font-bold font-serif text-stone-900 dark:text-white leading-snug">
              {video.title}
            </Typography>

            {/* Channel Info & Subscribe Bar */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-sm">
              <a
                href="https://www.youtube.com/channel/UCgCijg9nTzivoeszshGjzzQ?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 group"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#d4720a] to-amber-500 p-0.5 shadow-md">
                  <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-gold-400 font-bold text-sm">
                    HR
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-bold text-sm text-stone-900 dark:text-white group-hover:text-gold-500 transition-colors">
                      HR Vasthu
                    </h3>
                    <CheckCircle2 size={15} className="text-gold-500" />
                  </div>
                  <p className="text-xs text-stone-500">Dr. Kunchala Hanumantha Rao • Official Channel</p>
                </div>
              </a>

              <div className="flex items-center gap-3">
                <a
                  href="https://www.youtube.com/channel/UCgCijg9nTzivoeszshGjzzQ?sub_confirmation=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all flex items-center gap-1.5"
                >
                  <span>Subscribe on YouTube</span>
                </a>
              </div>
            </div>

            {/* Video Engagement Metrics */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-stone-200 dark:border-stone-800 text-stone-600 dark:text-stone-400 text-sm font-medium">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Eye size={16} className="text-gold-500" />
                  <span>{formatNumber(video.views)} views</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-gold-500" />
                  <span>{formatDate(video.published_at || video.created_at)}</span>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-stone-100 dark:bg-stone-900 px-4 py-2 rounded-full border border-stone-200 dark:border-stone-800">
                <span className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
                  <ThumbsUp size={15} className="text-gold-500" /> {formatNumber(video.likes)}
                </span>
                <div className="w-px h-4 bg-stone-300 dark:bg-stone-700" />
                <span className="flex items-center gap-1.5 font-bold text-stone-800 dark:text-stone-200">
                  <MessageCircle size={15} className="text-gold-500" /> {formatNumber(video.comments)}
                </span>
              </div>
            </div>

            {/* Comprehensive SEO Content & Vastu Principles Section */}
            <div className="bg-white dark:bg-stone-900/70 rounded-3xl p-6 md:p-8 border border-stone-200 dark:border-stone-800 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
                  <Sparkles size={18} className="text-gold-500" /> Lesson Summary & Vastu Principles
                </h3>
                <span className="text-xs text-stone-500 font-mono">
                  {video.category || 'General Vastu'}
                </span>
              </div>

              <div className="prose dark:prose-invert max-w-none text-stone-700 dark:text-stone-300 leading-relaxed whitespace-pre-line text-sm md:text-base">
                {video.description || "In this video lesson, Dr. Kunchala Hanumantha Rao delivers in-depth Vastu guidance and scientific principles."}
              </div>

              {/* Consultation CTA Banner */}
              <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-gold-500/10 border border-gold-500/20 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="font-bold text-stone-900 dark:text-white text-sm flex items-center gap-2">
                    <ShieldCheck size={16} className="text-gold-500" /> Get Your House Plan Verified
                  </h4>
                  <p className="text-xs text-stone-600 dark:text-stone-400">
                    Consult Dr. Kunchala Hanumantha Rao for personalized residential & commercial Vastu solutions.
                  </p>
                </div>
                <a
                  href={`https://wa.me/919246624248?text=${encodeURIComponent(`Hello Dr. Rao, I watched your video "${video.title}" and would like a consultation.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-gradient-to-r from-gold-600 to-amber-500 hover:from-gold-500 hover:to-amber-400 text-white text-xs font-bold rounded-xl shadow-lg hover:scale-105 transition-all flex items-center gap-2 shrink-0 cursor-pointer"
                >
                  <MessageSquare size={14} />
                  <span>WhatsApp Consultation</span>
                </a>
              </div>
            </div>
          </div>

          {/* Up Next / Related Videos Sidebar (Right 30%) */}
          <div className="w-full lg:w-[30%] space-y-4">
            <h3 className="text-base font-bold font-serif text-stone-900 dark:text-white flex items-center gap-2">
              <Compass size={18} className="text-gold-500" /> Up Next & Related Lessons
            </h3>
            
            <div className="space-y-3">
              {similarVideos.length > 0 ? (
                similarVideos.map((sim) => (
                  <Link
                    to={`/video/${getVideoSlug(sim)}`}
                    key={sim.id}
                    className="flex gap-3 p-2.5 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 hover:border-gold-500/50 hover:shadow-md transition-all group"
                  >
                    <div className="relative w-32 aspect-video rounded-xl overflow-hidden bg-stone-200 dark:bg-stone-800 shrink-0">
                      <img 
                        src={sim.thumbnail_medium || sim.thumbnail_default || 'https://hrvasthu.com/hero.png'} 
                        alt={sim.title} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-105"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] font-mono px-1 rounded">
                        {sim.duration || '10:00'}
                      </span>
                    </div>
                    <div className="flex flex-col justify-center min-w-0">
                      <h4 className="text-xs font-bold line-clamp-2 text-stone-900 dark:text-stone-100 group-hover:text-gold-500 transition-colors leading-snug">
                        {sim.title}
                      </h4>
                      <span className="text-[10px] text-stone-400 mt-1">
                        {formatNumber(sim.views)} views
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-stone-500 text-xs">No related lessons found.</p>
              )}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default VideoDetail;
