import { computed } from 'vue';
import { useRoute } from 'vue-router';

export function useCurrentMuseumId() {
  const route = useRoute();
  return computed(() => Number(route.params.id));
}