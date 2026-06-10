<template>
  <div class="gauge-chart-container" ref="containerRef">
    <div v-if="loading" class="skeleton-placeholder" />
    <div v-else ref="chartRef" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import * as echarts from 'echarts'

interface GaugeDataItem {
  name: string
  value: number
  min: number
  max: number
}

const props = defineProps<{
  data: GaugeDataItem[]
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

  const series: echarts.GaugeSeriesOption[] = props.data.map((item, index) => {
    const percentage = parseFloat(((item.value - item.min) / (item.max - item.min) * 100).toFixed(1))
    const centerX = (index + 0.5) / props.data.length * 100

    return {
      type: 'gauge',
      center: [`${centerX}%`, '55%'],
      radius: '75%',
      min: item.min,
      max: item.max,
      startAngle: 210,
      endAngle: -30,
      splitNumber: 10,
      axisLine: {
        show: true,
        lineStyle: {
          width: 14,
          color: [
            [percentage / 100, '#00d4ff'],
            [1, 'rgba(200,214,229,0.08)'],
          ],
        },
      },
      pointer: {
        icon: 'path://M12.8,0.7l12,40.1H0.7L12.8,0.7z',
        length: '55%',
        width: 6,
        offsetCenter: [0, '-8%'],
        itemStyle: {
          color: 'auto',
        },
      },
      axisTick: {
        length: 8,
        lineStyle: {
          color: 'auto',
          width: 1,
        },
      },
      splitLine: {
        length: 20,
        lineStyle: {
          color: 'auto',
          width: 3,
        },
      },
      axisLabel: {
        color: '#c8d6e5',
        fontSize: 9,
        distance: 16,
        formatter: (val: number) => {
          if (val === item.max) return val.toString()
          if (val === item.min) return val.toString()
          return ''
        },
      },
      title: {
        offsetCenter: [0, '78%'],
        color: '#c8d6e5',
        fontSize: 12,
      },
      detail: {
        valueAnimation: true,
        formatter: '{value}%',
        color: '#00d4ff',
        fontSize: 18,
        fontWeight: 'bold',
        offsetCenter: [0, '52%'],
      },
      data: [
        {
          value: percentage,
          name: item.name,
        },
      ],
    }
  })

  const option: echarts.EChartsOption = {
    series: series as echarts.SeriesOption[],
    tooltip: {
      backgroundColor: 'rgba(10,31,68,0.9)',
      borderColor: '#00d4ff',
      textStyle: { color: '#c8d6e5', fontSize: 12 },
      formatter: (params: any) => {
        return `${params.name}<br/>当前值: ${params.value}%`
      },
    },
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
.gauge-chart-container {
  width: 100%;
  height: 100%;
  min-height: 260px;
  position: relative;
  background: transparent;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 260px;
}

.skeleton-placeholder {
  width: 100%;
  height: 100%;
  min-height: 260px;
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