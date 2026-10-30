export function getDifficultyLabel(difficulty?: string): string {
  const labels: Record<string, string> = {
    beginner: '入门',
    intermediate: '进阶',
    advanced: '专家'
  }
  return labels[difficulty || 'intermediate'] || '进阶'
}

