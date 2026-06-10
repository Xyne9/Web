<template>
  <div class="scroll-table" @mouseenter="pause" @mouseleave="resume">
    <div class="table-header">
      <div
        v-for="col in columns"
        :key="col.key"
        class="header-cell"
        :style="{ width: col.width, flex: col.width ? 'none' : '1' }"
      >
        {{ col.title }}
      </div>
    </div>
    <div class="table-body" ref="bodyRef">
      <div
        class="table-row-wrapper"
        ref="wrapperRef"
        :style="{ transform: `translateY(-${offset}px)` }"
      >
        <div
          v-for="(row, index) in displayData"
          :key="index"
          class="table-row"
          :class="{ 'row-even': index % 2 === 1 }"
        >
          <div
            v-for="col in columns"
            :key="col.key"
            class="table-cell"
            :style="{ width: col.width, flex: col.width ? 'none' : '1' }"
          >
            <slot
              :name="`cell-${col.key}`"
              :row="row"
              :value="row[col.key]"
              :index="index"
            >
              {{ row[col.key] }}
            </slot>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'

export interface Column {
  title: string
  key: string
  width?: string
}

const props = withDefaults(
  defineProps<{
    columns: Column[]
    data: Record<string, any>[]
    speed?: number
  }>(),
  {
    speed: 1,
  },
)

const bodyRef = ref<HTMLElement | null>(null)
const wrapperRef = ref<HTMLElement | null>(null)
const offset = ref(0)
let animationId: number | null = null
let isPaused = false
let rowHeight = 40

const displayData = computed(() => {
  // 复制3倍数据用于无缝滚动
  return [...props.data, ...props.data, ...props.data]
})

function pause() {
  isPaused = true
}

function resume() {
  isPaused = false
}

function scroll() {
  if (!isPaused && bodyRef.value) {
    offset.value += props.speed * 0.5
    const totalHeight = props.data.length * rowHeight
    if (offset.value >= totalHeight) {
      offset.value = 0
    }
  }
  animationId = requestAnimationFrame(scroll)
}

onMounted(() => {
  nextTick(() => {
    if (bodyRef.value) {
      const firstRow = bodyRef.value.querySelector('.table-row')
      if (firstRow) {
        rowHeight = firstRow.getBoundingClientRect().height
      }
    }
  })
  animationId = requestAnimationFrame(scroll)
})

onUnmounted(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }
})
</script>

<style scoped>
.scroll-table {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-header {
  display: flex;
  background: rgba(0, 212, 255, 0.1);
  border-bottom: 1px solid rgba(0, 212, 255, 0.3);
  flex-shrink: 0;
}

.header-cell {
  padding: 8px 12px;
  font-size: 13px;
  font-weight: bold;
  color: #00d4ff;
  text-align: center;
  letter-spacing: 1px;
  flex: 1;
}

.table-body {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.table-row {
  display: flex;
  height: 40px;
  align-items: center;
  border-bottom: 1px solid rgba(0, 212, 255, 0.08);
  transition: background 0.3s;
}

.table-row:hover {
  background: rgba(0, 212, 255, 0.08);
}

.row-even {
  background: rgba(0, 212, 255, 0.03);
}

.table-cell {
  padding: 4px 12px;
  font-size: 13px;
  color: #c8d6e5;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
}
</style>