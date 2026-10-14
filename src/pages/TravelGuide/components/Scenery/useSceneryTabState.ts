import { ref } from 'vue';

const sceneryActiveTab = ref('discover');
const discoverActiveSubTab = ref('overview');
const experienceActiveSubTab = ref('craft');

export function useSceneryTabState() {
  return { sceneryActiveTab, discoverActiveSubTab, experienceActiveSubTab };
}