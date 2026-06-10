import request from './request'
import type {
  OverviewData,
  RegionSalesItem,
  TrendItem,
  CategoryItem,
  RankingItem,
  AlertItem,
  TimeRange,
} from '@/types/dashboard'

export const getOverview = () =>
  request.get<any, OverviewData>('/dashboard/overview')

export const getSalesByRegion = () =>
  request.get<any, RegionSalesItem[]>('/charts/sales-by-region')

export const getSalesTrend = (range: TimeRange) =>
  request.get<any, TrendItem[]>('/charts/sales-trend', { params: { range } })

export const getCategoryRatio = () =>
  request.get<any, CategoryItem[]>('/charts/category-ratio')

export const getRanking = () =>
  request.get<any, RankingItem[]>('/charts/ranking')

export const getAlerts = () =>
  request.get<any, AlertItem[]>('/alerts')