export interface OverviewData {
  totalSales: number
  totalOrders: number
  totalUsers: number
  conversionRate: number
  salesGrowth: number
  ordersGrowth: number
  usersGrowth: number
}

export interface RegionSalesItem {
  name: string
  value: number
  growth: number
}

export interface TrendItem {
  time: string
  sales: number
  orders: number
  users: number
}

export interface CategoryItem {
  name: string
  value: number
}

export interface RankingItem {
  rank: number
  city: string
  province: string
  sales: number
  growth: number
}

export interface RealTimeMetric {
  totalSales: number
  totalUsers: number
  conversionRate: number
  timestamp: number
}

export interface AlertItem {
  id: string
  level: 'info' | 'warning' | 'error'
  message: string
  time: string
}

export interface GaugeData {
  name: string
  value: number
  min: number
  max: number
}

export type TimeRange = 'today' | 'week' | 'month'