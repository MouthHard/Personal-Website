export interface WeatherInfo {
  icon: string;
  description: string;
  temperature?: string;
}

export const WEATHER_ICONS = ["☀️", "⛅", "☁️", "🌧️", "⛈️", "❄️"];

export const WEATHER_DESCRIPTIONS = [
  "晴朗",
  "多云",
  "阴天",
  "小雨",
  "雷阵雨",
  "雪天",
];

// 模拟温度范围
const TEMPERATURE_RANGES = [
  "15°C - 25°C",
  "18°C - 28°C",
  "10°C - 20°C",
  "12°C - 22°C",
  "8°C - 18°C",
  "-5°C - 5°C",
];

// 根据省份ID获取天气信息
export function getWeatherByProvince(provinceId: string): WeatherInfo {
  const hash = provinceId
    .split("")
    .reduce((acc: number, char: string) => acc + char.charCodeAt(0), 0);

  const weatherIndex = hash % WEATHER_ICONS.length;

  return {
    icon: WEATHER_ICONS[weatherIndex],
    description: WEATHER_DESCRIPTIONS[weatherIndex],
    temperature: TEMPERATURE_RANGES[weatherIndex],
  };
}

