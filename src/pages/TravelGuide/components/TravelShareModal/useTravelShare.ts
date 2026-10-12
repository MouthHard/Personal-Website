import { ref } from 'vue';

export function useTravelShare() {
  const shareVisible = ref(false);
  const shareTitle = ref('');
  const shareText = ref('');
  const shareUrl = ref('');

  const openShare = (title: string, text: string, url?: string) => {
    shareTitle.value = title;
    shareText.value = text;
    shareUrl.value = url || (typeof window !== 'undefined' ? window.location.href : '');
    shareVisible.value = true;
  };

  const closeShare = () => {
    shareVisible.value = false;
  };

  return {
    shareVisible,
    shareTitle,
    shareText,
    shareUrl,
    openShare,
    closeShare,
  };
}