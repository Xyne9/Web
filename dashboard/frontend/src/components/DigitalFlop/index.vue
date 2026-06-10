<template>
  <div class="digital-flop" :style="{ fontSize: fontSize + 'px' }">
    <span v-if="prefix" class="prefix">{{ prefix }}</span>
    <span class="number" :class="trendClass" :style="{ color: currentColor }">
      {{ displayValue }}
    </span>
    <span v-if="unit" class="unit">{{ unit }}</span>
    <span v-if="suffix" class="suffix">{{ suffix }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    value: number
    prefix?: string
    suffix?: string
    unit?: string
    fontSize?: number
    duration?: number
    color?: string
  }>(),
  {
    prefix: '',
    suffix: '',
    unit: '',
    fontSize: 36,
    duration: 800,
    color: '',
  },
)

const trend = ref<'up' | 'down' | 'none'>('none')

const formatValue = (val: number): string => {
  if (val >= 100000000) {
    return (val / 100000000).toFixed(2) + '亿'
  }
  return val.toLocaleString('zh-CN', { maximumFractionDigits: 2 })
}

const displayValue = computed(() => formatValue(props.value))

const trendClass = computed(() => {
  if (trend.value === 'up') return 'trend-up'
  if (trend.value === 'down') return 'trend-down'
  return ''
})

const currentColor = computed(() => {
  if (props.color) return props.color
  if (trend.value === 'up') return '#00ff88'
  if (trend.value === 'down') return '#ff4444'
  return '#00d4ff'
})

watch(
  () => props.value,
  (newVal, oldVal) => {
    if (newVal > oldVal) trend.value = 'up'
    else if (newVal < oldVal) trend.value = 'down'
    else trend.value = 'none'
    setTimeout(() => {
      trend.value = 'none'
    }, props.duration + 1000)
  },
)
</script>

<style scoped>
.digital-flop {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
  font-family: 'Courier New', 'DIN', monospace;
  font-weight: bold;
}

.prefix,
.suffix,
.unit {
  font-size: 0.5em;
  color: #8899aa;
  margin: 0 2px;
}

.number {
  transition: color 0.6s ease;
  animation: digitRoll 0.3s ease-out;
}

.trend-up {
  color: #00ff88;
}

.trend-down {
  color: #ff4444;
}

@keyframes digitRoll {
  0% {
    transform: translateY(-12px);
    opacity: 0;
  }
  100% {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>