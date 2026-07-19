import type { Video } from '../../../core/types/video';

export interface ShortAnalytics {
  id: string;
  videoId: string;
  watchDuration: number;
  completed: boolean;
  skipped: boolean;
  clickedFullVideo: boolean;
}

export interface ShortsFeedState {
  shorts: Video[];
  currentIndex: number;
  isLoading: boolean;
  isMuted: boolean;
  activeCategory: string;
}
