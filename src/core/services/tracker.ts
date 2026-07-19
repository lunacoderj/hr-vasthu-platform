import { supabase } from './supabase';

interface EventPayload {
  [key: string]: any;
}

export const getDeviceType = (): string => {
  const width = window.innerWidth;
  if (width < 768) return 'mobile';
  if (width < 1024) return 'tablet';
  return 'desktop';
};

export const getOS = (): string => {
  const ua = navigator.userAgent;
  if (/android/i.test(ua)) return 'Android';
  if (/ipad|iphone|ipod/i.test(ua)) return 'iOS';
  if (/windows/i.test(ua)) return 'Windows';
  if (/macintosh|mac os x/i.test(ua)) return 'macOS';
  if (/linux/i.test(ua)) return 'Linux';
  return 'Unknown';
};

export const getBrowser = (): string => {
  const ua = navigator.userAgent;
  if (/chrome|crios/i.test(ua) && !/edge|edg/i.test(ua) && !/opr/i.test(ua)) return 'Chrome';
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) return 'Safari';
  if (/firefox|fxios/i.test(ua)) return 'Firefox';
  if (/edge|edg/i.test(ua)) return 'Edge';
  return 'Browser';
};

// Geolocation cache
let geoInfo = { city: 'Hyderabad', country: 'India' };
let geoFetched = false;

const fetchGeo = async () => {
  if (geoFetched) return geoInfo;
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (res.ok) {
      const data = await res.json();
      geoInfo = {
        city: data.city || 'Hyderabad',
        country: data.country_name || 'India'
      };
      geoFetched = true;
    }
  } catch (err) {
    // Silent fail, use default location
  }
  return geoInfo;
};

export const tracker = {
  async trackEvent(
    eventName: string,
    path: string = window.location.pathname,
    durationSeconds: number | null = null,
    scrollPercentage: number | null = null,
    payload: EventPayload = {}
  ) {
    try {
      const location = await fetchGeo();
      const eventData = {
        event_name: eventName,
        path,
        duration_seconds: durationSeconds,
        scroll_percentage: scrollPercentage,
        device_type: getDeviceType(),
        os: getOS(),
        browser: getBrowser(),
        city: location.city,
        country: location.country,
        payload
      };

      const { error } = await supabase.from('analytics_events').insert([eventData]);
      if (error) {
        // Fallback to console debug when table is not active
        console.debug('Analytics event tracked (table not active):', eventData);
      }
    } catch (err) {
      console.debug('Analytics tracker error:', err);
    }
  },

  trackPageView(path: string) {
    this.trackEvent('page_view', path);
  },

  trackVideoPlay(videoTitle: string, durationSeconds?: number) {
    this.trackEvent('video_play', window.location.pathname, durationSeconds || null, null, { video_title: videoTitle });
  },

  trackVideoComplete(videoTitle: string) {
    this.trackEvent('video_complete', window.location.pathname, null, null, { video_title: videoTitle });
  },

  trackShortView(shortTitle: string, videoId: string) {
    this.trackEvent('short_view', '/shorts', null, null, { video_title: shortTitle, video_id: videoId });
  },

  trackBookDownload(bookTitle: string) {
    this.trackEvent('book_download', window.location.pathname, null, null, { book_title: bookTitle });
  },

  trackCTAClick(ctaType: string, label: string) {
    this.trackEvent('cta_click', window.location.pathname, null, null, { cta_type: ctaType, label });
  },

  trackError(errorMessage: string, errorStack?: string) {
    this.trackEvent('js_error', window.location.pathname, null, null, { 
      message: errorMessage, 
      stack: errorStack || 'no-stack' 
    });
  },

  initTracker() {
    // 1. Auto-track unhandled JS errors
    window.onerror = (message, source, lineno, colno, error) => {
      this.trackError(
        typeof message === 'string' ? message : 'Unhandled Exception',
        error?.stack || `${source}:${lineno}:${colno}`
      );
    };

    window.onunhandledrejection = (event) => {
      this.trackError(`Unhandled Promise Rejection: ${event.reason}`);
    };

    // 2. Track initial page view
    this.trackPageView(window.location.pathname);
  }
};
