// 博物馆相关工具函数和静态映射

// 省份名称到英文的映射
const provinceMap: Record<string, string> = {
  北京: "beijing",
  上海: "shanghai",
  陕西: "shaanxi",
  江苏: "jiangsu",
  河南: "henan",
  浙江: "zhejiang",
  湖北: "hubei",
  湖南: "hunan",
  四川: "sichuan",
  广东: "guangdong",
  天津: "tianjin",
  重庆: "chongqing",
  山东: "shandong",
  辽宁: "liaoning",
  吉林: "jilin",
  黑龙江: "heilongjiang",
  福建: "fujian",
  安徽: "anhui",
  河北: "hebei",
  山西: "shanxi",
  内蒙古: "inner-mongolia",
  江西: "jiangxi",
  广西: "guangxi",
  海南: "hainan",
  贵州: "guizhou",
  云南: "yunnan",
  西藏: "tibet",
  甘肃: "gansu",
  青海: "qinghai",
  宁夏: "ningxia",
  新疆: "xinjiang",
  台湾: "taiwan",
  香港: "hong-kong",
  澳门: "macau",
};


// 格式化数字（添加千位分隔符）
export const formatNumber = (num: number): string => num.toLocaleString('en-US');

// 获取博物馆的省份英文名称
const getProvinceEn = (province: string): string => {
  return provinceMap[province] || province.toLowerCase();
};


// 生成博物馆详情页的路由路径
export const generateMuseumRoute = (
  province: string,
  museumId: number,
): string => {
  const provinceEn = getProvinceEn(province);
  return `/museum/${provinceEn}/${museumId}`;
};
// 根据日期字符串派生活动状态
export const deriveStatus = (
  dateStr: string,
): 'upcoming' | 'ongoing' | 'ended' => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const parts = dateStr.split(' 至 ').map((s) => s.trim());
  const startDate = new Date(parts[0]);
  const endDate = parts[1] ? new Date(parts[1]) : new Date(startDate);
  if (isNaN(startDate.getTime())) return 'ongoing';
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  if (today < startDate) return 'upcoming';
  if (today > endDate) return 'ended';
  return 'ongoing';
};
