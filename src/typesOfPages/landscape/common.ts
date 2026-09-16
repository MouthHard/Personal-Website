import type { ShootParam, GearItem, SafetyInfo } from './profile'

export interface SocialLink {
  platform: string
  url?: string
  iconPath?: string
}

export interface ContactInfo {
  email?: string
  website?: string
  phone?: string
}

export interface Category {
  id: string
  name: string
  icon: string
  count?: number
  description?: string
  children?: Category[]
}

export interface CategoryTag {
  dimension: string
  category: string
  subCategory: string
}

export interface InteractionItem {
  id: string
  type: 'image' | 'video' | 'guide' | 'photographer'
  title: string
  image: string
  location?: string
  category?: string
  timestamp: number
  likes?: number
  views?: number
  loves?: number
  favorites?: number
  shares?: number
  icon?: string
  quality?: string
  duration?: number | null
  summary?: string
  author?: string
  authorId?: string
  authorAvatar?: string
  authorVerified?: boolean
  difficulty?: 'beginner' | 'intermediate' | 'advanced'
  rating?: number
  ratingCount?: number
  readTime?: string
  saves?: number
  comments?: number
  date?: string
  isEditorPick?: boolean
  season?: string
  transport?: string
  budget?: string
  audience?: string
  highlights?: string[]
  accommodation?: string
  language?: string
  warnings?: string[]
  shootTime?: string
  shootParams?: ShootParam[]
  gears?: GearItem[]
  safety?: SafetyInfo[]
  altitude?: string
  temperature?: string
  tips?: string[]
}
