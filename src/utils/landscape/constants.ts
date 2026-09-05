
export const OSS = 'https://mouthhard-website.oss-cn-hangzhou.aliyuncs.com/landscape'


export const dimensions = [
  { id: 'theme', name: '主题', icon: '🎨' },
  { id: 'location', name: '地点', icon: '📍' },
  { id: 'time', name: '时间', icon: '⏰' },
  { id: 'weather', name: '天气', icon: '🌤️' },
  { id: 'technique', name: '技术', icon: '📷' },
  { id: 'style', name: '风格', icon: '🎭' },
  { id: 'element', name: '元素', icon: '✨' },
]


export const mainNavs = [
  { path: '/landscape/home', name: '首页' },
  { path: '/landscape/search', name: '搜索' },
  { path: '/landscape/category', name: '分类' },
  { path: '/landscape/guides', name: '指南攻略' },
  { path: '/landscape/photographers', name: '摄影师' },
  { path: '/landscape/profile', name: '我的' },
]

export const contentTabs = [
  { key: 'all', label: '全部', icon: '⊞' },
  { key: 'photo', label: '图片', icon: '⊡' },
  { key: 'video', label: '视频', icon: '▶' },
  { key: 'guide', label: '攻略', icon: '⊞' },
]


export const sortOptions = [
  { value: 'default', label: '默认排序' },
  { value: 'works', label: '作品数最多' },
  { value: 'likes', label: '点赞数最多' },
  { value: 'followers', label: '粉丝数最多' },
  { value: 'active', label: '最近活跃' }
]

export const guideSortOptions = [
  { value: 'latest', label: '最新' },
  { value: 'views', label: '最多浏览' },
  { value: 'likes', label: '最多点赞' },
  { value: 'loves', label: '最多喜爱' },
  { value: 'bookmarks', label: '最多收藏' },
  { value: 'shares', label: '最多分享' },
]

export const rankingTabs = [
  { value: 'works', label: '作品数', icon: '📸' },
  { value: 'followers', label: '粉丝数', icon: '👥' },
  { value: 'likes', label: '点赞数', icon: '❤️' },
  { value: 'views', label: '浏览量', icon: '👁️' }
]

export const hotTags = [
  { id: 'city', name: '城市', count: 10400 },
  { id: 'aurora', name: '极光', count: 9700 },
  { id: 'mountain', name: '山岳', count: 8600 },
  { id: 'ocean', name: '海洋', count: 5100 },
]

export const mediaTypes: Array<{ id: 'all' | 'image' | 'video'; label: string; icon: string }> = [
  { id: 'all', label: '全部', icon: '📊' },
  { id: 'image', label: '图片', icon: '🖼️' },
  { id: 'video', label: '视频', icon: '🎬' },
]

export const quickFilters: Array<{ id: string; label: string; icon: string }> = [
  { id: 'latest', label: '最新', icon: '🆕' },
  { id: 'most-views', label: '最多浏览', icon: '👁️' },
  { id: 'most-likes', label: '最多点赞', icon: '👍' },
  { id: 'most-loves', label: '最多喜爱', icon: '❤️' },
  { id: 'most-favorites', label: '最多收藏', icon: '🔖' },
  { id: 'most-shares', label: '最多分享', icon: '🔗' },
]

export const typeFilters = [
  { value: 'image', label: '图片', icon: '🖼️' },
  { value: 'video', label: '视频', icon: '🎬' },
  { value: 'guide', label: '攻略', icon: '📖' },
  { value: 'photographer', label: '摄影师', icon: '👤' }
]

export const userProfile = {
  id: 'user-1',
  name: '风光摄影爱好者',
  title: '星空追逐者',
  avatar: `${OSS}/1.webp`,
  bio: '用镜头记录宇宙的浩瀚与大地的壮美，在光影中寻找永恒的瞬间',
  location: '中国·北京',
  joinDate: '2024年加入',
  tags: ['风光', '星空', '城市'],
  verified: false,
  stats: {
    works: 12,
    favorites: 0,
    likes: 0,
    following: 0,
  }
}

export const profileTabs = [
  { key: 'favorites', name: '我的收藏', icon: '❤️' },
  { key: 'likes', name: '我的喜欢', icon: '⭐' },
  { key: 'uploads', name: '我的上传', icon: '📤' },
  { key: 'following', name: '我的关注', icon: '👤' },
]

export const profileCategories = [
  { id: 'image', name: '图片', icon: '🖼️' },
  { id: 'video', name: '视频', icon: '🎬' },
  { id: 'guide', name: '攻略', icon: '📖' },

]

export const seasonMap: Record<string, string> = {
  spring: '春季',
  summer: '夏季',
  autumn: '秋季',
  winter: '冬季',
  all: '四季皆宜',
}

export const difficultyMap: Record<string, string> = {
  beginner: '初级',
  intermediate: '中级',
  advanced: '高级',
  expert: '专家级',
}

export const travelModeMap: Record<string, { class: string; icon: string; title: string; subtitle: string }> = {
  self: { class: 'self-drive', icon: '🚗', title: '自驾游', subtitle: '自由探索' },
  group: { class: 'group-tour', icon: '👥', title: '跟团游', subtitle: '省心省力' },
  guide: { class: 'guided', icon: '🗺️', title: '向导游', subtitle: '深度体验' },
  hiking: { class: 'hiking', icon: '🥾', title: '徒步游', subtitle: '亲近自然' },
}

export const workTypes = ['photo', 'video', 'guide', 'panorama', 'timelapse', 'aerial', 'longexp', 'startrail', 'hdr']

export const workTypeConfigs: Record<string, { icon: string; name: string; format: string }> = {
  photo: { icon: '📷', name: '照片', format: 'JPG' },
  video: { icon: '🎬', name: '视频', format: 'MP4' },
  guide: { icon: '📖', name: '攻略', format: 'PDF' },
  panorama: { icon: '🌅', name: '全景', format: 'JPG' },
  timelapse: { icon: '⏱️', name: '延时', format: 'MP4' },
  aerial: { icon: '🚁', name: '航拍', format: 'JPG' },
  longexp: { icon: '✨', name: '长曝光', format: 'JPG' },
  startrail: { icon: '⭐', name: '星轨', format: 'JPG' },
  hdr: { icon: '🌈', name: 'HDR', format: 'JPG' },
}

export const workTypeIcons: Record<string, string> = Object.fromEntries(
  Object.entries(workTypeConfigs).map(([k, v]) => [k, v.icon])
) as Record<string, string>

export const workTypeLabels: Record<string, string> = Object.fromEntries(
  Object.entries(workTypeConfigs).map(([k, v]) => [k, v.name])
) as Record<string, string>

export const travelModes = [
  { id: 'self-drive', label: '自驾游', icon: '🚗', count: 0 },
  { id: 'group-tour', label: '跟团游', icon: '👥', count: 0 },
  { id: 'guided', label: '向导游', icon: '🗺️', count: 0 },
  { id: 'hiking', label: '徒步游', icon: '🥾', count: 0 },
  { id: 'cycling', label: '骑行游', icon: '🚴', count: 0 },
  { id: 'backpacking', label: '背包游', icon: '🎒', count: 0 },
  { id: 'photography-tour', label: '摄影团', icon: '📸', count: 0 },
  { id: 'cruise', label: '邮轮游', icon: '🚢', count: 0 },
  { id: 'rv-camping', label: '房车游', icon: '🚐', count: 0 },
  { id: 'train-travel', label: '火车游', icon: '🚄', count: 0 },
]

export const naturalScenery = [
  { id: 'mountain', label: '山岳', icon: '⛰️', count: 0 },
  { id: 'ocean', label: '海洋', icon: '🌊', count: 0 },
  { id: 'forest', label: '森林', icon: '🌲', count: 0 },
  { id: 'desert', label: '沙漠', icon: '🏜️', count: 0 },
  { id: 'lake', label: '湖泊', icon: '💧', count: 0 },
  { id: 'waterfall', label: '瀑布', icon: '💦', count: 0 },
  { id: 'grassland', label: '草原', icon: '🌾', count: 0 },
  { id: 'glacier', label: '冰川', icon: '🏔️', count: 0 },
  { id: 'canyon', label: '峡谷', icon: '🏔️', count: 0 },
  { id: 'cave', label: '溶洞', icon: '🕳️', count: 0 },
  { id: 'coastline', label: '海岸线', icon: '🏖️', count: 0 },
  { id: 'island', label: '岛屿', icon: '🏝️', count: 0 },
  { id: 'wetland', label: '湿地', icon: '🦆', count: 0 },
]

export const weatherScenery = [
  { id: 'aurora', label: '极光', icon: '🌌', count: 0 },
  { id: 'sunrise', label: '日出', icon: '🌅', count: 0 },
  { id: 'sunset', label: '日落', icon: '🌇', count: 0 },
  { id: 'clouds', label: '云海', icon: '☁️', count: 0 },
  { id: 'rainbow', label: '彩虹', icon: '🌈', count: 0 },
  { id: 'starry', label: '星空', icon: '⭐', count: 0 },
  { id: 'fog', label: '雾景', icon: '🌫️', count: 0 },
  { id: 'lightning', label: '雷电', icon: '⚡', count: 0 },
  { id: 'snow-scene', label: '雪景', icon: '❄️', count: 0 },
]

export const seasonalScenery = [
  { id: 'spring-flowers', label: '春季花海', icon: '🌸', count: 0 },
  { id: 'summer-green', label: '夏季绿荫', icon: '🌿', count: 0 },
  { id: 'autumn-leaves', label: '秋季红叶', icon: '🍂', count: 0 },
  { id: 'winter-snow', label: '冬季雪景', icon: '❄️', count: 0 },
  { id: 'cherry-blossom', label: '樱花季', icon: '🌼', count: 0 },
  { id: 'lavender', label: '薰衣草季', icon: '💜', count: 0 },
  { id: 'rapeseed', label: '油菜花季', icon: '💛', count: 0 },
  { id: 'ginkgo', label: '银杏季', icon: '💛', count: 0 },
]

export const culturalScenery = [
  { id: 'ancient', label: '古迹遗址', icon: '🏛️', count: 0 },
  { id: 'city', label: '都市风光', icon: '🏙️', count: 0 },
  { id: 'village', label: '乡村田园', icon: '🏘️', count: 0 },
  { id: 'festival', label: '节庆活动', icon: '🎭', count: 0 },
  { id: 'temple', label: '宗教建筑', icon: '⛩️', count: 0 },
  { id: 'museum', label: '博物馆', icon: '🏛️', count: 0 },
  { id: 'castle', label: '城堡宫殿', icon: '🏰', count: 0 },
  { id: 'market', label: '市集文化', icon: '🛒', count: 0 },
]

export const wildlifeScenery = [
  { id: 'birds', label: '鸟类摄影', icon: '🦅', count: 0 },
  { id: 'mammals', label: '哺乳动物', icon: '🦁', count: 0 },
  { id: 'marine', label: '海洋生物', icon: '🐋', count: 0 },
  { id: 'insects', label: '昆虫微距', icon: '🦋', count: 0 },
  { id: 'safari', label: '野生动物', icon: '🦒', count: 0 },
  { id: 'panda', label: '大熊猫', icon: '🐼', count: 0 },
  { id: 'penguin', label: '企鹅', icon: '🐧', count: 0 },
]

export const locations = [
  { id: 'china', label: '中国', icon: '🇨🇳', count: 0 },
  { id: 'asia', label: '亚洲', icon: '🌏', count: 0 },
  { id: 'europe', label: '欧洲', icon: '🌍', count: 0 },
  { id: 'north-america', label: '北美洲', icon: '🌎', count: 0 },
  { id: 'south-america', label: '南美洲', icon: '🌎', count: 0 },
  { id: 'africa', label: '非洲', icon: '🌍', count: 0 },
  { id: 'oceania', label: '大洋洲', icon: '🌏', count: 0 },
  { id: 'antarctica', label: '南极洲', icon: '🐧', count: 0 },
]

export const seasons = [
  { id: 'spring', label: '春季', icon: '🌸', count: 0 },
  { id: 'summer', label: '夏季', icon: '☀️', count: 0 },
  { id: 'autumn', label: '秋季', icon: '🍂', count: 0 },
  { id: 'winter', label: '冬季', icon: '❄️', count: 0 },
  { id: 'all-year', label: '四季皆宜', icon: '🌈', count: 0 },
]

export const durations = [
  { id: '1-3', label: '1-3天', icon: '📅', count: 0 },
  { id: '4-7', label: '4-7天', icon: '📅', count: 0 },
  { id: '8-14', label: '8-14天', icon: '📅', count: 0 },
  { id: '15-30', label: '15-30天', icon: '📅', count: 0 },
  { id: '30+', label: '30天以上', icon: '📅', count: 0 },
]


export const guideModeMap: Record<string, string> = {
  'self-drive': '自驾游',
  'group-tour': '跟团游',
  'guided': '向导游',
  'hiking': '徒步游',
  'cycling': '骑行游',
  'backpacking': '背包游',
  'photography-tour': '摄影团',
  'cruise': '邮轮游',
  'rv-camping': '房车游',
  'train-travel': '火车游',
}

export const guideSeasonMap: Record<string, string> = {
  'spring': '春季',
  'summer': '夏季',
  'autumn': '秋季',
  'winter': '冬季',
  'all-year': '全年',
}

export const guideDurationMap: Record<string, string> = {
  '1-3': '1-3天',
  '4-7': '4-7天',
  '8-14': '8-14天',
  '15-30': '15-30天',
  '30+': '30天以上',
}

export const guideThemeMap: Record<string, string> = {
  'mountain': '山岳',
  'ocean': '海洋',
  'forest': '森林',
  'desert': '沙漠',
  'lake': '湖泊',
  'waterfall': '瀑布',
  'grassland': '草原',
  'glacier': '冰川',
  'canyon': '峡谷',
  'cave': '溶洞',
  'coastline': '海岸线',
  'island': '岛屿',
  'wetland': '湿地',
  'aurora': '极光',
  'sunrise': '日出',
  'sunset': '日落',
  'clouds': '云海',
  'rainbow': '彩虹',
  'starry': '星空',
  'fog': '雾景',
  'lightning': '雷电',
  'snow-scene': '雪景',
  'spring-flowers': '春季花海',
  'summer-green': '夏季绿荫',
  'autumn-leaves': '秋季红叶',
  'winter-snow': '冬季雪景',
  'cherry-blossom': '樱花季',
  'lavender': '薰衣草季',
  'rapeseed': '油菜花季',
  'ginkgo': '银杏季',
  'ancient': '古迹遗址',
  'city': '都市风光',
  'village': '乡村田园',
  'festival': '节庆活动',
  'temple': '宗教建筑',
  'museum': '博物馆',
  'castle': '城堡宫殿',
  'market': '市集文化',
  'birds': '鸟类摄影',
  'mammals': '哺乳动物',
  'marine': '海洋生物',
  'insects': '昆虫微距',
  'safari': '野生动物',
  'panda': '大熊猫',
  'penguin': '企鹅',
}

export const cachedViews = ['Home', 'Category', 'Photographers', 'Profile', 'Guides', 'Search', 'Setting'] as const

export const masonryCardHeights = [
  240, 320, 280, 360, 300, 260, 340, 290, 
  310, 270, 350, 250, 330, 380, 285, 315,
  295, 335, 305, 275, 365, 255, 325, 375
]


export const ProfileSpecialtyOptions = [
  '风光',
  '人像',
  '纪实',
  '商业',
  '建筑',
  '美食',
  '婚礼',
  '体育',
  '动物',
  '微距',
] as const

export const SearchPhotographerSortOptions = [
  { value: 'relevance', label: '综合推荐' },
  { value: 'latest', label: '最新发布' },
  { value: 'followers', label: '最多关注' },
  { value: 'works', label: '最多作品' },
  { value: 'likes', label: '最多点赞' },
  { value: 'views', label: '最多浏览' },
] as const

export const SearchContentSortOptions = [
  { value: 'relevance', label: '综合推荐' },
  { value: 'latest', label: '最新发布' },
  { value: 'views', label: '最多浏览' },
  { value: 'likes', label: '最多点赞' },
  { value: 'loves', label: '最多喜爱' },
  { value: 'bookmarks', label: '最多收藏' },
  { value: 'shares', label: '最多分享' },
] as const

export const CopyrightOptions = [
  { label: '保留所有权利', value: '保留所有权利' },
  { label: 'CC BY', value: 'CC BY' },
  { label: 'CC BY-SA', value: 'CC BY-SA' },
  { label: 'CC BY-NC', value: 'CC BY-NC' },
  { label: 'CC0', value: 'CC0' },
] as const

export const PhotographyQualityOptions = [
  { label: '原图', value: '原图' },
  { label: '高清', value: '高清' },
  { label: '标清', value: '标清' },
] as const

export const WatermarkPositionOptions = [
  { label: '右下角', value: '右下角' },
  { label: '左下角', value: '左下角' },
  { label: '右上角', value: '右上角' },
  { label: '左上角', value: '左上角' },
  { label: '居中', value: '居中' },
] as const

export const UploadQualityOptions = [
  { label: '高质量', value: '高质量' },
  { label: '平衡', value: '平衡' },
  { label: '节省空间', value: '节省空间' },
] as const

export const UploadPrivacyOptions = [
  { label: '公开', value: 'public' },
  { label: '仅关注者', value: 'followers' },
  { label: '私有', value: 'private' },
] as const
