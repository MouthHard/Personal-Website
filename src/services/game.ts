import { loadJSON, paginate, filterByKeyword, filterByField } from './static-data';

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

export interface GameCategoryItem {
  key: string;
  label: string;
  icon: string;
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
  const items = applyFilters(data?.items || [], params);
  return paginate(items, params);
}

export async function fetchGameCategories() {
  return loadJSON<GameCategoryItem[]>('game/game-categories.json');
}
