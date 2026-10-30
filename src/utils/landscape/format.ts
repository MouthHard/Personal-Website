export function formatNumber(num: number): string {
  if (num >= 100000000) return (num / 100000000).toFixed(1) + '亿'
  if (num >= 10000) return (num / 10000).toFixed(1) + 'w'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'k'
  return num.toString()
}

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = Math.floor(seconds % 60)
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

export function formatFileSize(bytes: number): string {
  if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + ' GB'
  if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + ' MB'
  if (bytes >= 1024) return (bytes / 1024).toFixed(2) + ' KB'
  return bytes + ' B'
}


export function parseCount(value: string | number): number {
  if (typeof value === 'number') return value
  if (!value) return 0
  const lower = value.toLowerCase().replace(/,/g, '')
  if (lower.endsWith('k')) return parseFloat(lower) * 1000
  if (lower.endsWith('w') || lower.endsWith('万')) return parseFloat(lower) * 10000
  if (lower.endsWith('m')) return parseFloat(lower) * 1000000
  if (lower.endsWith('亿')) return parseFloat(lower) * 100000000
  return parseFloat(lower) || 0
}
