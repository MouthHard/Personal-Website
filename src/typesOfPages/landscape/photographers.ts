import type { SocialLink, ContactInfo } from './common'

export type WorkType = 'photo' | 'video' | 'guide' | 'panorama' | 'timelapse' | 'aerial' | 'longexp' | 'startrail' | 'hdr' | 'macro';

export interface WorkPreview {
  id?: string;
  image?: string;
  cover?: string;
  title?: string;
  type?: WorkType | string;
  likes?: number;
  loves?: number;
  favorites?: number;
  views?: number;
  shares?: number;
}

export interface Photographer {
  id: string
  name: string
  avatar: string
  title: string
  bio?: string
  location?: string
  works: number | string
  followers: number | string
  views?: string
  likes?: string
  tags?: string[]
  verified?: boolean
  isFollowing?: boolean
  recentWorks?: string[]
  socials?: SocialLink[]
  contact?: ContactInfo
  experience?: string
  equipment?: string | string[]
  rating?: number
  onlineStatus?: 'online' | 'offline'
  joinDate?: string
  awards?: string[]
  category?: string
  banner?: string
  website?: string
  socialLinks?: {
    instagram?: string
    youtube?: string
    twitter?: string
    weibo?: string
  }
  createdAt?: string
  updatedAt?: string
  isFavorite?: boolean
  isOnline?: boolean
  isPro?: boolean
  lastActive?: string
  workTypes?: (WorkType | string)[]
  worksPreview?: WorkPreview[] | string[]
  worksCount?: string
  bookmarks?: string
  joinTime?: string
}

