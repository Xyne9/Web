<template>
  <div class="line-chart" ref="containerRef">
    <div v-if="loading" class="skeleton"></div>
  </div>
</template>

<script setup lang="ts">
import type { TrendItem, TimeRange } from '@/types/dashboard'
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'

const props = withDefaults(
  defineProps<{
    data: TrendItem[]
    timeRange?: TimeRange
    loading?: boolean
  }>(),
  { timeRange: 'today', loading: false },
)

const containerRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

const xLabels = computed(() => props.data.map((d) => d.time))
const salesData = computed(() => props.data.map((d) => d.sales))
const ordersData = computed(() => props.data.map((d) => d.orders))
const usersData = computed(() => props.data.map((d) => d.users))

function getOption() {
  return {
    backgroundColor: 'transparent',
    grid: { top: 30, right: 30, bottom: 35, left: 55 },
    legend: {
      data: ['销售额', '订单量', '用户数'],
      right: 10,
      textStyle: { color: '#c8d6e5', fontSize: 11 },
    },
    xAxis: {
      type: 'category',
      data: xLabels.value,
      axisLine: { lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: {
        color: '#8899aa',
        fontSize: 10,
        rotate: props.timeRange === 'month' ? 45 : 0,
        interval: props.timeRange === 'month' ? 6 : 'auto',
      },
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { color: 'rgba(0,212,255,0.1)' } },
      axisLine: { show: true, lineStyle: { color: 'rgba(0,212,255,0.3)' } },
      axisLabel: { color: '#c8d6e5', fontSize: 11 },
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'cross' },
      backgroundColor: 'rgba(10,31,68,0.9)',
      borderColor: '#00d4ff',
      textStyle: { color: '#fff' },
    },
    series: [
      {
        name: '销售额',
        type: 'line',
        data: salesData.value,
        smooth: 0.4,
        showSymbol: false,
        lineStyle: { color: '#00d4ff', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00d4ff30' },
            { offset: 1, color: '#00d4ff05' },
          ]),
        },
        animationDuration: 300,
      },
      {
        name: '订单量',
        type: 'line',
        data: ordersData.value,
        smooth: 0.4,
        showSymbol: false,
        lineStyle: { color: '#7b2ff7', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#7b2ff730' },
            { offset: 1, color: '#7b2ff705' },
          ]),
        },
        animationDuration: 300,
      },
      {
        name: '用户数',
        type: 'line',
        data: usersData.value,
        smooth: 0.4,
        showSymbol: false,
        lineStyle: { color: '#00ff88', width: 2 },
        areaStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00ff8830' },
            { offset: 1, color: '#00ff8805' },
          ]),
        },
        animationDuration: 300,
      },
    ],
  }
}

function initChart() {
  if (!containerRef.value) return
  chart = echarts.init(containerRef.value)
  chart.setOption(getOption())
}

watch(
  () => [props.data, props.timeRange],
  () => {
    if (chart) {
      chart.setOption(getOption(), true)
    }
  },
  { deep: true },
)

watch(
  () => props.loading,
  (val) => {
    if (!val) {
      nextTick(() => {
        if (!chart && containerRef.value) initChart()
      })
    }
  },
)

onMounted(() => {
  if (!props.loading) initChart()
  window.addEventListener('resize', () => chart?.resize())
})

onUnmounted(() => {
  window.removeEventListener('resize', () => chart?.resize())
  chart?.dispose()
})
</script>

<style scoped>
.line-chart {
  width: 100%;
  height: 100%;
  min-height: 150px;
}

.skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 212, 255, 0.05) 25%, rgba(0, 212, 255, 0.1) 50%, rgba(0, 212, 255, 0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.6s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-pulse {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>