import type { Food } from '@/typesOfPages/travelGuide';

export function useFoodShare() {
  const share = async (food: Food): Promise<boolean> => {
    const text = `${food.name}｜评分 ${food.rating ?? 0}｜价格 ¥${food.price ?? '-'}`;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
        return true;
      }
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  };

  return { share };
}