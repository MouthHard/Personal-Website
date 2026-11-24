export interface Destination {
  id: number | string;
  name: string;
  country: string;
  image?: string;
  images?: {
    spring: string;
    summer: string;
    autumn: string;
    winter: string;
  };
  rating: number;
  score: number;
  photos: string;
  views: string;
  likes: number;
  loves: number;
  favorites?: number;
  shares?: number;
  bestTime?: string;
  tips?: string;
  coordinates?: { lat: number; lng: number };
  works?: number;
  photographers?: number;
  trending?: boolean;
  navigation?: {
    dimension: string;
    category: string;
    subCategory: string;
  };
}

export interface Topic {
  id: number | string;
  title: string;
  category: string;
  image: string;
  description: string;
  views: string;
  likes: string;
  favorites?: string;
  comments: string;
  date: string;
  bestSeason: string;
  locations: string[];
  tips: string[];
  navigation?: {
    dimension: string;
    category: string;
    subCategory: string;
  };
  posts?: number;
  followers?: number;
  trending?: boolean;
}

interface HomePhotographerWork {
  id: string;
  type: 'photo' | 'video' | 'guide';
  title: string;
  cover?: string;
  views?: string;
  likes?: string;
  loves?: string;
  bookmarks?: string;
  shares?: string;
  duration?: string;
  excerpt?: string;
  size?: 'large' | 'normal' | 'small';
}

export interface HomePhotographerRecommendation {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  location: string;
  bio: string;
  rating: number;
  equipment: string[];
  worksCount: string;
  followers: string;
  likes: string;
  bookmarks: string;
  works: HomePhotographerWork[];
}

export interface FeaturedSlide {
  id: string;
  image: string;
  category: string;
  icon: string;
  title: string;
  location: string;
  likes: number;
  loves: number;
  views: number;
  favorites: number;
  shares: number;
  mediaType: 'image' | 'video';
  quality: string;
  duration: number | null;
  author: string;
  authorId?: string;
  authorAvatar?: string;
  /** 关键词标签，来自图片原始 tags */
  tags: string[];
  /** 拍摄器材与日期，来自图片原始元数据 */
  camera?: string;
  date?: string;
  /** 作者档案：评分 / 认证，来自摄影师库 */
  authorRating?: number;
  authorVerified?: boolean;
  /** 主题色三件套，由 categoryTags 映射，供卡片 CSS 变量使用 */
  accent: string;
  accentSoft: string;
  accentGlow: string;
}

export interface VideoShowcase {
  id: string;
  url: string;
  poster: string;
  title: string;
  location: string;
  category: string;
  duration: string;
  views: number;
  likes: number;
  loves: number;
  bookmarks: number;
  shares: number;
  comments: number;
  authorAvatar: string;
  authorName: string;
  authorTitle: string;
  author?: string;
  authorId?: string;
}
