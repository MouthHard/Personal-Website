import { ref } from 'vue';

export type MainTab = 'food' | 'scenery';

const mainTab = ref<MainTab>('food');
const activeLeaf = ref('eaten');
const expanded = ref<Record<MainTab, boolean>>({
  food: true,
  scenery: false,
});

export function useMyPageState() {
  return { mainTab, activeLeaf, expanded };
}
