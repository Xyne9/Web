<template>
  <div class="bar-chart-container" ref="containerRef">
    <div v-if="loading" class="skeleton-placeholder" />
    <div v-else ref="chartRef" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import * as echarts from 'echarts'

interface BarDataItem {
  name: string
  value: number
  growth: number
}

const props = defineProps<{
  data: BarDataItem[]
  loading: boolean
}>()

const containerRef = ref<HTMLDivElement>()
const chartRef = ref<HTMLDivElement>()
const chartInstance = shallowRef<echarts.ECharts | null>(null)

function initChart() {
  if (!chartRef.value || props.data.length === 0) return

  if (chartInstance.value) {
    chartInstance.value.dispose()
  }

  chartInstance.value = echarts.init(chartRef.value)

  const names = props.data.map(item => item.name)
  const values = props.data.map(item => item.value)
  const growths = props.data.map(item => item.growth)

  const option: echarts.EChartsOption = {
    grid: {
      left: '3%',
      right: '12%',
      top: '5%',
      bottom: '5%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      backgroundColor: 'rgba(10,31,68,0.9)',
      borderColor: '#00d4ff',
      textStyle: { color: '#c8d6e5', fontSize: 12 },
      formatter: (params: any) => {
        const item = params[0]
        const idx = item.dataIndex
        return `${item.name}<br/>销售额: ${item.value.toLocaleString()}<br/>增长率: ${growths[idx]}%`
      },
    },
    xAxis: {
      type: 'value',
      axisLine: { lineStyle: { color: 'rgba(200,214,229,0.15)' } },
      axisTick: { show: false },
      splitLine: { lineStyle: { color: 'rgba(200,214,229,0.06)' } },
      axisLabel: { color: '#c8d6e5', fontSize: 11 },
    },
    yAxis: {
      type: 'category',
      data: names,
      axisLine: { lineStyle: { color: 'rgba(200,214,229,0.15)' } },
      axisTick: { show: false },
      axisLabel: { color: '#c8d6e5', fontSize: 11 },
    },
    series: [
      {
        type: 'bar',
        data: values.map((val, i) => ({
          value: val,
          itemStyle: {
            borderRadius: [0, 4, 4, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#7b2ff7' },
              { offset: 1, color: '#00d4ff' },
            ]),
          },
        })),
        barWidth: 16,
        label: {
          show: true,
          position: 'right',
          color: '#c8d6e5',
          fontSize: 11,
          formatter: (params: any) => {
            const idx = params.dataIndex
            return `${params.value.toLocaleString()}  ↑${growths[idx]}%`
          },
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: '#9d4fff' },
              { offset: 1, color: '#33e0ff' },
            ]),
          },
        },
      },
    ],
  }

  chartInstance.value.setOption(option)
}

function handleResize() {
  chartInstance.value?.resize()
}

onMounted(() => {
  if (!props.loading) {
    initChart()
  }
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  chartInstance.value?.dispose()
  chartInstance.value = null
})

watch(() => props.loading, (newVal) => {
  if (!newVal) {
    setTimeout(() => initChart(), 0)
  }
})

watch(() => props.data, () => {
  if (!props.loading) {
    initChart()
  }
}, { deep: true })
</script>

<style scoped>
.bar-chart-container {
  width: 100%;
  height: 100%;
  min-height: 280px;
  position: relative;
  background: transparent;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 280px;
}

.skeleton-placeholder {
  width: 100%;
  height: 100%;
  min-height: 280px;
  background: linear-gradient(
    90deg,
    rgba(10, 31, 68, 0.4) 25%,
    rgba(10, 31, 68, 0.7) 50%,
    rgba(10, 31, 68, 0.4) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-pulse 1.6s ease-in-out infinite;
  border-radius: 8px;
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