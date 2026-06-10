import { DataSimulator } from '../jobs/dataSimulator'

interface CacheEntry<T> {
  data: T
  timestamp: number
}

const DEFAULT_TTL = 30_000 // 30 seconds

export class DataService {
  private simulator = new DataSimulator()
  private cache = new Map<string, CacheEntry<any>>()

  /** Get from cache if not expired, otherwise call factory and cache result */
  private cached<T>(key: string, factory: () => T, ttl: number = DEFAULT_TTL): T {
    const entry = this.cache.get(key)
    const now = Date.now()

    if (entry && now - entry.timestamp < ttl) {
      return entry.data as T
    }

    const data = factory()
    this.cache.set(key, { data, timestamp: now })
    return data
  }

  /* ========== Public methods ========== */

  getOverview() {
    return this.cached('overview', () => this.simulator.generateOverview())
  }

  getRegionSales() {
    return this.cached('regionSales', () => this.simulator.generateRegionSales(), 60_000) // 1 min TTL for heavier data
  }

  getSalesTrend(range: 'today' | 'week' | 'month') {
    return this.cached(`salesTrend:${range}`, () => this.simulator.generateSalesTrend(range))
  }

  getCategoryRatio() {
    return this.cached('categoryRatio', () => this.simulator.generateCategoryRatio())
  }

  getRanking() {
    return this.cached('ranking', () => this.simulator.generateRanking(), 60_000)
  }

  /** Real-time metrics are NOT cached — always fresh */
  getRealTimeMetrics() {
    return this.simulator.generateRealTimeMetrics()
  }

  /** Alerts are NOT cached — always fresh */
  getAlerts() {
    return this.simulator.generateAlerts()
  }

  /** Manually invalidate a cache key or the entire cache */
  invalidate(key?: string) {
    if (key) {
      this.cache.delete(key)
    } else {
      this.cache.clear()
    }
  }
}