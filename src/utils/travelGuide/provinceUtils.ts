import type { Province } from "@/typesOfPages/travelGuide";

export const TAG_COLOR_CLASSES = [
  "tag-blue",
  "tag-green",
  "tag-orange",
  "tag-purple",
  "tag-red",
];

export const DEFAULT_TAB_ID = "food";
export const DEFAULT_REGION = "全部";

// 获取标签颜色类
export function getTagColorClass(index: number): string {
  return TAG_COLOR_CLASSES[index % TAG_COLOR_CLASSES.length];
}

// 筛选省份
export function filterProvinces(
  provinces: Province[],
  region: string,
  searchQuery: string,
): Province[] {
  return provinces.filter((province) => {
    const matchRegion = region === "全部" || province.region === region;
    const matchSearch =
      searchQuery === "" ||
      province.name.includes(searchQuery) ||
      province.id.includes(searchQuery);
    return matchRegion && matchSearch;
  });
}

// 提取地区列表
export function extractRegions(provinces: Province[]): string[] {
  const regionSet = new Set(provinces.map((p) => p.region));
  return ["全部", ...Array.from(regionSet)];
}

