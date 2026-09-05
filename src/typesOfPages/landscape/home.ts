export interface Destination {
  id: number | string
  name: string
  country: string
  image?: string
  images?: {
    spring: string
    summer: string
    autumn: string
    winter: string
  }
  rating: number
  score: number
  photos: string
  views: string
  likes: number
  loves: number
  works?: number
  photographers?: number
  trending?: boolean
  navigation?: {
    dimension: string
    category: string
    subCategory: string
  }
}

export interface Topic {
  id: number | string
  title: string
  category: string
  image: string
  description: string
  views: string
  likes: string
  favorites?: string
  comments: string
  date: string
  bestSeason: string
  locations: string[]
  tips: string[]
  navigation?: {
    dimension: string
    category: string
    subCategory: string
  }
  posts?: number
  followers?: number
  trending?: boolean
}
