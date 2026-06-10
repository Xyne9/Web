/**
 * DataSimulator — generates mock data with realistic patterns.
 *
 * Patterns implemented:
 *  - Day-of-week: weekends (Sat=6, Sun=0) have ~30% higher sales
 *  - Time-of-day: peaks at 10:00-12:00, 14:00-16:00, 19:00-22:00
 */

import { randomInt, randomFloat, pickRandom } from '../utils/random'

/* ------------------------------------------------------------------ */
/*  Provinces                                                          */
/* ------------------------------------------------------------------ */

const PROVINCES = [
  '北京', '天津', '上海', '重庆', '河北', '山西', '辽宁',
  '吉林', '黑龙江', '江苏', '浙江', '安徽', '福建', '江西',
  '山东', '河南', '湖北', '湖南', '广东', '广西', '海南',
  '四川', '贵州', '云南', '西藏', '陕西', '甘肃', '青海',
  '宁夏', '新疆', '内蒙古',
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Get a multiplier based on current time (0‑23) */
function timeMultiplier(): number {
  const hour = new Date().getHours()
  if ((hour >= 10 && hour < 12) || (hour >= 14 && hour < 16) || (hour >= 19 && hour < 22)) {
    return 1.3
  }
  if (hour >= 0 && hour < 6) {
    return 0.2
  }
  return 0.85
}

/** Get a multiplier based on day of week (0=Sun … 6=Sat) */
function dayMultiplier(): number {
  const day = new Date().getDay()
  return day === 0 || day === 6 ? 1.3 : 1.0
}

/** Combined multiplier for a "now" metric */
function nowMultiplier(): number {
  return timeMultiplier() * dayMultiplier()
}

/** Generate a time label relative to now */
function timeLabel(offsetMinutes: number): string {
  const d = new Date(Date.now() + offsetMinutes * 60_000)
  return d.toISOString().replace('T', ' ').slice(0, 16)
}

/* ------------------------------------------------------------------ */
/*  DataSimulator                                                      */
/* ------------------------------------------------------------------ */

export class DataSimulator {
  /* ========== Overview ========== */

  generateOverview() {
    const m = nowMultiplier()

    const totalSales = Math.round(m * randomFloat(500, 2000) * 10_000)   // 500-2000 万
    const totalOrders = Math.round(m * randomInt(1000, 5000))
    const totalUsers = Math.round(m * randomInt(100_000, 500_000))
    const conversionRate = parseFloat((randomFloat(2.0, 5.5)).toFixed(2))
    const salesGrowth = parseFloat((randomFloat(-5, 15)).toFixed(1))
    const ordersGrowth = parseFloat((randomFloat(-3, 12)).toFixed(1))
    const usersGrowth = parseFloat((randomFloat(0, 10)).toFixed(1))

    return { totalSales, totalOrders, totalUsers, conversionRate, salesGrowth, ordersGrowth, usersGrowth }
  }

  /* ========== Region Sales ========== */

  generateRegionSales() {
    return PROVINCES.map((name) => ({
      name,
      value: Math.round(randomFloat(50, 8000) * 10_000),            // 50-8000 万
      growth: parseFloat(randomFloat(-5, 25).toFixed(1)),
    }))
  }

  /* ========== Sales Trend ========== */

  generateSalesTrend(range: 'today' | 'week' | 'month') {
    let count: number
    let stepMinutes: number

    switch (range) {
      case 'today':
        count = 24
        stepMinutes = -60
        break
      case 'week':
        count = 7
        stepMinutes = -24 * 60
        break
      case 'month':
        count = 30
        stepMinutes = -24 * 60
        break
      default:
        count = 24
        stepMinutes = -60
    }

    const result = []
    const baseSales = randomFloat(500, 2000) * 10_000
    const baseOrders = randomInt(100, 500)
    const baseUsers = randomInt(3000, 20_000)

    for (let i = count - 1; i >= 0; i--) {
      const offset = i * stepMinutes
      const label = timeLabel(offset)

      // Simulate some fluctuation
      const fluctuation = randomFloat(0.7, 1.3)

      result.push({
        time: label,
        sales: Math.round(baseSales * fluctuation),
        orders: Math.round(baseOrders * fluctuation),
        users: Math.round(baseUsers * fluctuation),
      })
    }

    return result
  }

  /* ========== Category Ratio ========== */

  generateCategoryRatio() {
    const categories = ['电子产品', '服装鞋帽', '食品饮料', '家居用品', '美妆个护', '其他']
    // Generate raw values then convert to percentages
    const raw = categories.map(() => randomFloat(10, 50))
    const total = raw.reduce((a, b) => a + b, 0)

    return categories.map((name, i) => ({
      name,
      value: parseFloat((raw[i] / total * 100).toFixed(1)),
    }))
  }

  /* ========== Ranking (top 10 cities) ========== */

  generateRanking() {
    const cityProvincePairs: Array<[string, string]> = [
      ['北京', '北京'], ['上海', '上海'], ['广州', '广东'], ['深圳', '广东'],
      ['杭州', '浙江'], ['成都', '四川'], ['武汉', '湖北'], ['南京', '江苏'],
      ['重庆', '重庆'], ['苏州', '江苏'], ['西安', '陕西'], ['长沙', '湖南'],
      ['郑州', '河南'], ['天津', '天津'], ['青岛', '山东'],
    ]

    // Shuffle & pick 10
    const shuffled = [...cityProvincePairs].sort(() => Math.random() - 0.5).slice(0, 10)

    const raw = shuffled.map(([city, province]) => ({
      city,
      province,
      sales: Math.round(randomFloat(100, 1000) * 10_000),
      growth: parseFloat(randomFloat(-5, 20).toFixed(1)),
    }))

    // Sort descending by sales
    raw.sort((a, b) => b.sales - a.sales)

    return raw.map((item, idx) => ({ rank: idx + 1, ...item }))
  }

  /* ========== Real-Time ========== */

  generateRealTimeMetrics() {
    const m = nowMultiplier()
    const variation = randomFloat(0.95, 1.05)

    return {
      totalSales: Math.round(m * 850_000 * variation),
      totalUsers: Math.round(m * 12_000 * variation),
      conversionRate: parseFloat((3.2 * variation).toFixed(2)),
      timestamp: Date.now(),
    }
  }

  /* ========== Alerts ========== */

  generateAlerts(): Array<{ id: string; level: 'info' | 'warning' | 'error'; message: string; time: string }> {
    const count = randomInt(0, 3)
    if (count === 0) return []

    const alertTemplates: Array<{ level: 'info' | 'warning' | 'error'; messages: string[] }> = [
      {
        level: 'info',
        messages: [
          '系统运行正常，各项指标均在合理范围内',
          '今日新增用户数已突破目标值',
          '数据同步任务已成功完成',
          '定时报表生成完毕',
        ],
      },
      {
        level: 'warning',
        messages: [
          '订单处理队列积压，当前排队数量超过阈值',
          '服务器 CPU 使用率超过 80%，请关注',
          '支付接口响应延迟增加，请注意监控',
          '部分区域配送时效可能延迟',
        ],
      },
      {
        level: 'error',
        messages: [
          '数据库连接池已耗尽，请紧急处理',
          '第三方物流接口调用失败次数过多',
          '库存同步服务异常中断',
          '支付确认超时，部分订单状态异常',
        ],
      },
    ]

    const alerts = []
    for (let i = 0; i < count; i++) {
      const tmpl = pickRandom(alertTemplates)
      const msg = pickRandom(tmpl.messages)
      alerts.push({
        id: `alert-${Date.now()}-${i}`,
        level: tmpl.level,
        message: msg,
        time: new Date().toISOString(),
      })
    }
    return alerts
  }
}