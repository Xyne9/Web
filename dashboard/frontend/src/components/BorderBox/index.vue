<template>
  <div class="border-box" :style="boxStyle">
    <!-- 四角装饰 -->
    <div class="corner corner-tl" :style="cornerStyle"></div>
    <div class="corner corner-tr" :style="cornerStyle"></div>
    <div class="corner corner-bl" :style="cornerStyle"></div>
    <div class="corner corner-br" :style="cornerStyle"></div>

    <!-- 上边框线 -->
    <div class="border-line border-top" :style="lineStyle"></div>
    <!-- 下边框线 -->
    <div class="border-line border-bottom" :style="lineStyle"></div>

    <!-- 标题 -->
    <div v-if="title || $slots.title" class="border-title" :style="titleStyle">
      <slot name="title">
        <span class="title-text">{{ title }}</span>
      </slot>
    </div>

    <!-- 内容区域 -->
    <div class="border-content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    title?: string
    borderColor?: string
    backgroundColor?: string
  }>(),
  {
    title: '',
    borderColor: '#00d4ff',
    backgroundColor: 'rgba(10, 31, 68, 0.6)',
  },
)

const boxStyle = computed(() => ({
  backgroundColor: props.backgroundColor,
}))

const cornerStyle = computed(() => ({
  borderColor: props.borderColor,
  boxShadow: `0 0 6px ${props.borderColor}`,
}))

const lineStyle = computed(() => ({
  background: `linear-gradient(90deg, transparent, ${props.borderColor}, transparent)`,
}))

const titleStyle = computed(() => ({
  color: props.borderColor,
  textShadow: `0 0 10px ${props.borderColor}`,
}))
</script>

<style scoped>
.border-box {
  position: relative;
  border: 1px solid rgba(0, 212, 255, 0.3);
  padding: 20px 16px 16px;
  border-radius: 2px;
  min-height: 100px;
  overflow: hidden;
}

.corner {
  position: absolute;
  width: 16px;
  height: 16px;
  border-style: solid;
  z-index: 2;
}

.corner-tl {
  top: -1px;
  left: -1px;
  border-width: 2px 0 0 2px;
  border-radius: 2px 0 0 0;
}

.corner-tr {
  top: -1px;
  right: -1px;
  border-width: 2px 2px 0 0;
  border-radius: 0 2px 0 0;
}

.corner-bl {
  bottom: -1px;
  left: -1px;
  border-width: 0 0 2px 2px;
  border-radius: 0 0 0 2px;
}

.corner-br {
  bottom: -1px;
  right: -1px;
  border-width: 0 2px 2px 0;
  border-radius: 0 0 2px 0;
}

.border-line {
  position: absolute;
  left: 0;
  right: 0;
  height: 1px;
  z-index: 1;
}

.border-top {
  top: 8px;
}

.border-bottom {
  bottom: 8px;
}

.border-title {
  position: absolute;
  top: -1px;
  left: 50%;
  transform: translateX(-50%);
  padding: 2px 20px;
  font-size: 14px;
  font-weight: bold;
  letter-spacing: 2px;
  z-index: 3;
  white-space: nowrap;
  max-width: 90%;
}

.border-title :deep(.chart-title-bar) {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.border-content {
  position: relative;
  z-index: 1;
  height: 100%;
}
</style>