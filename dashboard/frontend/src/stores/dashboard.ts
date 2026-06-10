import { defineStore } from 'pinia'
import { ref } from 'vue'
import type {
  OverviewData,
  RegionSalesItem,
  TrendItem,
  CategoryItem,
  RankingItem,
  RealTimeMetric,
  AlertItem,
  TimeRange,
} from '@/types/dashboard'
import * as api from '@/api/dashboard'
import { wsClient } from '@/api/websocket'

export const useDashboardStore = defineStore('dashboard', () => {
  // Overview data
  const overview = ref<OverviewData>({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    conversionRate: 0,
    salesGrowth: 0,
    ordersGrowth: 0,
    usersGrowth: 0,
  })

  // Chart data
  const regionSales = ref<RegionSalesItem[]>([])
  const salesTrend = ref<TrendItem[]>([])
  const categoryRatio = ref<CategoryItem[]>([])
  const ranking = ref<RankingItem[]>([])

  // Real-time data
  const realTimeMetric = ref<RealTimeMetric>({
    totalSales: 0,
    totalUsers: 0,
    conversionRate: 0,
    timestamp: Date.now(),
  })

  // Alerts
  const alerts = ref<AlertItem[]>([])

  // UI state
  const timeRange = ref<TimeRange>('today')
  const loading = ref(false)
  const isFullscreen = ref(false)
  const skeletonVisible = ref(true)

  // Fetch overview
  async function fetchOverview() {
    try {
      overview.value = await api.getOverview()
    } catch (e) {
      console.error('fetchOverview error:', e)
    }
  }

  // Fetch region sales
  async function fetchRegionSales() {
    try {
      regionSales.value = await api.getSalesByRegion()
    } catch (e) {
      console.error('fetchRegionSales error:', e)
    }
  }

  // Fetch sales trend
  async function fetchSalesTrend() {
    try {
      salesTrend.value = await api.getSalesTrend(timeRange.value)
    } catch (e) {
      console.error('fetchSalesTrend error:', e)
    }
  }

  // Fetch category ratio
  async function fetchCategoryRatio() {
    try {
      categoryRatio.value = await api.getCategoryRatio()
    } catch (e) {
      console.error('fetchCategoryRatio error:', e)
    }
  }

  // Fetch ranking
  async function fetchRanking() {
    try {
      ranking.value = await api.getRanking()
    } catch (e) {
      console.error('fetchRanking error:', e)
    }
  }

  // Fetch alerts
  async function fetchAlerts() {
    try {
      alerts.value = await api.getAlerts()
    } catch (e) {
      console.error('fetchAlerts error:', e)
    }
  }

  // Set time range and refetch trend
  function setTimeRange(range: TimeRange) {
    timeRange.value = range
    fetchSalesTrend()
  }

  // Toggle fullscreen
  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } else {
      document.exitFullscreen()
      isFullscreen.value = false
    }
  }

  // Initialize WebSocket
  function initWebSocket() {
    wsClient.connect()
    wsClient.on('realtime-metrics', (data: RealTimeMetric) => {
      realTimeMetric.value = data
    })
    wsClient.on('alert', (data: AlertItem) => {
      alerts.value.unshift(data)
      if (alerts.value.length > 50) {
        alerts.value.pop()
      }
    })
  }

  // Fetch all initial data
  async function fetchAllData() {
    loading.value = true
    skeletonVisible.value = true
    await Promise.all([
      fetchOverview(),
      fetchRegionSales(),
      fetchSalesTrend(),
      fetchCategoryRatio(),
      fetchRanking(),
      fetchAlerts(),
    ])
    skeletonVisible.value = false
    loading.value = false
  }

  return {
    overview,
    regionSales,
    salesTrend,
    categoryRatio,
    ranking,
    realTimeMetric,
    alerts,
    timeRange,
    loading,
    isFullscreen,
    skeletonVisible,
    fetchOverview,
    fetchRegionSales,
    fetchSalesTrend,
    fetchCategoryRatio,
    fetchRanking,
    fetchAlerts,
    setTimeRange,
    toggleFullscreen,
    initWebSocket,
    fetchAllData,
  }
})