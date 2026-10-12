import { shallowRef, watch } from 'vue';
import { useFoodPrefs } from '@/composables/travelGuide/useFoodPrefs';
import { useFoodShare } from '@/composables/travelGuide/useFoodShare';
import type { Food } from '@/typesOfPages/travelGuide';

let openCount = 0;

export function useFoodDetail() {
  const { isThumbsUp, toggleThumbsUp } = useFoodPrefs();
  const { share } = useFoodShare();

  const detailVisible = shallowRef(false);
  const detailFood = shallowRef<Food | null>(null);

  const openDetail = (food: Food) => {
    detailFood.value = food;
    detailVisible.value = true;
  };

  const closeDetail = () => {
    detailVisible.value = false;
  };

  const toggleDetailThumbsUp = () => {
    if (detailFood.value) {
      toggleThumbsUp(detailFood.value);
    }
  };

  const shareDetail = () => {
    if (detailFood.value) {
      return share(detailFood.value);
    }
    return Promise.resolve(false);
  };

  watch(detailVisible, (visible) => {
    if (typeof document === 'undefined') return;
    if (visible) {
      openCount++;
      document.body.style.overflow = 'hidden';
    } else {
      openCount = Math.max(0, openCount - 1);
      if (openCount === 0) {
        document.body.style.overflow = '';
      }
    }
  });

  return {
    detailVisible,
    detailFood,
    isThumbsUp,
    toggleThumbsUp,
    openDetail,
    closeDetail,
    toggleDetailThumbsUp,
    share,
    shareDetail,
  };
}
