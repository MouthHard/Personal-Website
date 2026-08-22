import { loadJSON, paginate, filterByKeyword, filterByField, findItemById } from './static-data';

export interface GameItemResponse {
  id: string;
  title: string;
  subtitle?: string;
  cover: string;
  banner?: string;
  category: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating: number;
  reviewCount: number;
  developer: string;
  publisher: string;
  releaseDate: string;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  screenshots?: string[];
  features?: string[];
  tags?: string[];
  platforms?: string[];
}

export interface GameListResponse {
  items: GameItemResponse[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GameQueryParams {
  keyword?: string;
  category?: string;
  tag?: string;
  platform?: string;
  priceRange?: string;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
  page?: number;
  limit?: number;
}

export interface GameBannerItem {
  id: string;
  gameId: string;
  image: string;
  title: string;
  subtitle: string;
  tag?: string;
}

export interface GameCategoryItem {
  key: string;
  label: string;
  icon: string;
  count: number;
}

export interface GameTagItem {
  tag: string;
  count: number;
}

export interface GamePlatformItem {
  platform: string;
  count: number;
}

function applyFilters(items: GameItemResponse[], params: GameQueryParams): GameItemResponse[] {
  let result = items;
  if (params.keyword) result = filterByKeyword(result, params.keyword, ['title', 'description']);
  if (params.category) result = filterByField(result, 'category', params.category);
  if (params.tag) result = result.filter((item) => item.tags?.includes(params.tag!));
  if (params.platform) result = result.filter((item) => item.platforms?.includes(params.platform!));
  if (params.sortBy) {
    const order = params.sortOrder === 'ASC' ? 1 : -1;
    result = [...result].sort((a, b) => {
      const av = (a as any)[params.sortBy!] ?? 0;
      const bv = (b as any)[params.sortBy!] ?? 0;
      return (av > bv ? 1 : av < bv ? -1 : 0) * order;
    });
  }
  return result;
}

export async function fetchGames(params: GameQueryParams = {}) {
  const data = await loadJSON<GameListResponse>('game/games.json');
  const items = applyFilters(data.items, params);
  return paginate(items, params);
}

export async function fetchGameById(gameId: string) {
  return findItemById<GameItemResponse>('game/games.json', gameId);
}

export async function fetchGameBanners() {
  return loadJSON<GameBannerItem[]>('game/game-banners.json');
}

export async function fetchGameCategories() {
  return loadJSON<GameCategoryItem[]>('game/game-categories.json');
}

export async function fetchGameTags() {
  return loadJSON<GameTagItem[]>('game/game-tags.json');
}

export async function fetchGamePlatforms() {
  return loadJSON<GamePlatformItem[]>('game/game-platforms.json');
}

export async function fetchGameOnSale(limit = 10) {
  const data = await loadJSON<GameListResponse>('game/games.json');
  const items = data.items.filter((g) => g.discount && g.discount > 0);
  return paginate(items.slice(0, limit), { page: 1, limit });
}
