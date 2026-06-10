import { ref } from 'vue'
import type { TimeRange } from '@/types/dashboard'

export function formatNumber(num: number, decimals = 0): string {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(decimals) + '亿'
  }
  if (num >= 10000) {
    return (num / 10000).toFixed(decimals) + '万'
  }
  return num.toLocaleString('zh-CN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

export function formatPercent(num: number): string {
  return (num * 100).toFixed(1) + '%'
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
}

export function useTimeRange(defaultRange: TimeRange = 'today') {
  const timeRange = ref<TimeRange>(defaultRange)

  const getTimeLabels = (): string[] => {
    const labels: string[] = []
    const now = new Date()
    switch (timeRange.value) {
      case 'today': {
        for (let i = 0; i < 24; i++) {
          labels.push(`${i.toString().padStart(2, '0')}:00`)
        }
        break
      }
      case 'week': {
        const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
        for (let i = 6; i >= 0; i--) {
          const d = new Date(now)
          d.setDate(d.getDate() - i)
          labels.push(`${d.getMonth() + 1}/${d.getDate()} ${days[d.getDay()]}`)
        }
        break
      }
      case 'month': {
        const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()
        for (let i = 1; i <= daysInMonth; i++) {
          labels.push(`${i}日`)
        }
        break
      }
    }
    return labels
  }

  return { timeRange, getTimeLabels }
}