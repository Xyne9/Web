<template>
  <div class="pie-chart-container" ref="containerRef">
    <div v-if="loading" class="skeleton-placeholder" />
    <div v-else ref="chartRef" class="chart" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, shallowRef } from 'vue'
import * as echarts from 'echarts'

interface PieDataItem {
  name: string
  value: number
}

const props = defineProps<{
  data: PieDataItem[]
  loading: boolean
}>()

const containerRef = ref<HTMLDivElement>()
const chartRef = ref<HTMLDivElement>()
const chartInstance = shallowRef<echarts.ECharts | null>(null)

const COLOR_PALETTE = ['#00d4ff', '#7b2ff7', '#00ff88', '#ff6b6b', '#ffd93d', '#6c5ce7']

function initChart() {
  if (!chartRef.value || props.data.length === 0) return

  if (chartInstance.value) {
    chartInstance.value.dispose()
  }

  chartInstance.value = echarts.init(chartRef.value)

  const total = props.data.reduce((sum, item) => sum + item.value, 0)

  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10,31,68,0.9)',
      borderColor: '#00d4ff',
      textStyle: { color: '#c8d6e5', fontSize: 12 },
      formatter: (params: any) => {
        return `${params.marker} ${params.name}: ${params.value.toLocaleString()} (${params.percent}%)`
      },
    },
    legend: {
      orient: 'vertical',
      right: '5%',
      top: 'center',
      textStyle: { color: '#c8d6e5', fontSize: 11 },
      icon: 'circle',
      itemWidth: 8,
      itemHeight: 8,
      itemGap: 12,
    },
    series: [
      {
        type: 'pie',
        roseType: 'area',
        radius: ['50%', '80%'],
        center: ['38%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 4,
          borderColor: 'rgba(10,31,68,0.6)',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: (params: any) => {
            return `{name|${params.name}}\n{val|${params.percent}%}`
          },
          rich: {
            name: {
              color: '#c8d6e5',
              fontSize: 11,
              lineHeight: 18,
            },
            val: {
              color: '#00d4ff',
              fontSize: 13,
              fontWeight: 'bold',
              lineHeight: 20,
            },
          },
        },
        labelLine: {
          lineStyle: { color: 'rgba(200,214,229,0.3)' },
        },
        emphasis: {
          label: { fontSize: 14, fontWeight: 'bold' },
          scaleSize: 8,
        },
        data: props.data.map((item, index) => ({
          value: item.value,
          name: item.name,
          itemStyle: {
            color: COLOR_PALETTE[index % COLOR_PALETTE.length],
          },
        })),
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
.pie-chart-container {
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: relative;
  background: transparent;
}

.chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.skeleton-placeholder {
  width: 100%;
  height: 100%;
  min-height: 300px;
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