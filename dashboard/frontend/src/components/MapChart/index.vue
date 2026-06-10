<template>
  <div class="map-chart" ref="containerRef">
    <div v-if="loading" class="skeleton"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'

const props = withDefaults(
  defineProps<{
    data: { name: string; value: number }[]
    loading?: boolean
  }>(),
  { loading: false },
)

const containerRef = ref<HTMLElement | null>(null)
let chart: echarts.ECharts | null = null

// 中国省份坐标（简化版）
const geoCoordMap: Record<string, [number, number]> = {
  北京: [116.46, 39.92],
  天津: [117.2, 39.13],
  上海: [121.48, 31.22],
  重庆: [106.54, 29.59],
  河北: [114.48, 38.03],
  山西: [112.53, 37.87],
  辽宁: [123.38, 41.8],
  吉林: [125.35, 43.88],
  黑龙江: [126.63, 45.75],
  江苏: [118.78, 32.04],
  浙江: [120.19, 30.26],
  安徽: [117.27, 31.86],
  福建: [119.3, 26.08],
  江西: [115.89, 28.68],
  山东: [117.0, 36.65],
  河南: [113.65, 34.76],
  湖北: [114.31, 30.52],
  湖南: [112.98, 28.19],
  广东: [113.23, 23.16],
  广西: [108.33, 22.84],
  海南: [110.35, 20.02],
  四川: [104.06, 30.67],
  贵州: [106.71, 26.57],
  云南: [102.73, 25.04],
  西藏: [91.11, 29.97],
  陕西: [108.95, 34.27],
  甘肃: [103.73, 36.03],
  青海: [101.74, 36.56],
  宁夏: [106.27, 38.47],
  新疆: [87.68, 43.77],
  内蒙古: [111.65, 40.82],
  台湾: [121.5, 25.05],
  香港: [114.17, 22.28],
  澳门: [113.54, 22.19],
}

function initChart() {
  if (!containerRef.value) return
  chart = echarts.init(containerRef.value)

  const scatterData = props.data
    .filter((d) => geoCoordMap[d.name])
    .map((d) => ({
      name: d.name,
      value: [...geoCoordMap[d.name], d.value],
    }))

  chart.setOption({
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor: 'rgba(10,31,68,0.9)',
      borderColor: '#00d4ff',
      textStyle: { color: '#fff' },
      formatter: (p: any) =>
        `${p.name}<br/>销售额: ${p.value[2]?.toLocaleString() || 0} 万元`,
    },
    grid: { left: 10, right: 10, top: 10, bottom: 10, containLabel: false },
    xAxis: {
      type: 'value',
      show: false,
      min: 75,
      max: 135,
    },
    yAxis: {
      type: 'value',
      show: false,
      min: 18,
      max: 52,
    },
    series: [
      {
        type: 'scatter',
        data: scatterData,
        symbolSize: (val: number[]) => {
          const v = val[2] || 100
          return Math.max(6, Math.sqrt(v) / 8)
        },
        itemStyle: {
          color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
            { offset: 0, color: '#00d4ff80' },
            { offset: 0.6, color: '#00d4ff40' },
            { offset: 1, color: '#00d4ff10' },
          ]),
          borderColor: '#00d4ff',
          borderWidth: 1,
        },
        emphasis: {
          itemStyle: {
            color: '#7b2ff7',
            borderColor: '#fff',
          },
          scale: 1.5,
        },
        label: {
          show: true,
          position: 'right',
          formatter: '{b}',
          color: '#8899aa',
          fontSize: 9,
          distance: 2,
        },
      },
      {
        type: 'effectScatter',
        data: scatterData.slice(0, 10),
        symbolSize: (val: number[]) => {
          const v = val[2] || 100
          return Math.max(4, Math.sqrt(v) / 10)
        },
        showEffectOn: 'render',
        rippleEffect: {
          brushType: 'stroke',
          scale: 2.5,
          color: '#00d4ff40',
        },
        itemStyle: {
          color: '#00d4ff',
        },
        zlevel: 1,
      },
    ],
  })
}

watch(
  () => props.data,
  () => { if (chart) initChart() },
  { deep: true },
)

watch(
  () => props.loading,
  (val) => {
    if (!val) nextTick(() => { if (!chart) initChart() })
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
.map-chart {
  width: 100%;
  height: 100%;
  min-height: 300px;
}

.skeleton {
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, rgba(0,212,255,0.05) 25%, rgba(0,212,255,0.1) 50%, rgba(0,212,255,0.05) 75%);
  background-size: 200% 100%;
  animation: skeleton-pulse 1.6s ease-in-out infinite;
  border-radius: 4px;
}

@keyframes skeleton-pulse {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>