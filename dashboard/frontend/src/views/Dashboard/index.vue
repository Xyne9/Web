<template>
  <div class="dashboard" :style="{ transform: `scale(${scale})`, width: `${100 / scale}%`, height: `${100 / scale}%` }">
    <!-- 顶部标题栏 -->
    <header class="dashboard-header">
      <div class="header-left">
        <span class="header-decoration"></span>
        <span class="header-label">数据可视化大屏</span>
      </div>
      <h1 class="header-title">智慧数据监控平台</h1>
      <div class="header-right">
        <span class="header-time">{{ currentTime }}</span>
        <span class="header-divider">|</span>
        <span class="header-weather">多云 26°C</span>
        <button class="fullscreen-btn" @click="store.toggleFullscreen()" :title="store.isFullscreen ? '退出全屏' : '全屏'">
          {{ store.isFullscreen ? '⛶' : '⛶' }}
        </button>
      </div>
    </header>

    <!-- 主内容区域 -->
    <div class="dashboard-body">
      <!-- 左侧面板 25% -->
      <div class="panel panel-left">
        <BorderBox title="地区销售额排行" class="panel-item chart-height-lg">
          <BarChart :data="store.regionSales" :loading="store.skeletonVisible" />
        </BorderBox>

        <BorderBox title="品类销售占比" class="panel-item chart-height-md">
          <PieChart :data="store.categoryRatio" :loading="store.skeletonVisible" />
        </BorderBox>

        <BorderBox title="城市销售排行" class="panel-item chart-height-lg">
          <ScrollTable
            :columns="rankingColumns"
            :data="store.ranking"
            :speed="0.6"
          >
            <template #cell-rank="{ row }">
              <span class="rank-badge" :class="'rank-' + row.rank">
                {{ row.rank <= 3 ? ['🥇', '🥈', '🥉'][row.rank - 1] : row.rank }}
              </span>
            </template>
            <template #cell-growth="{ value }">
              <span :class="value >= 0 ? 'text-green' : 'text-red'">
                {{ value >= 0 ? '↑' : '↓' }}{{ Math.abs(value).toFixed(1) }}%
              </span>
            </template>
          </ScrollTable>
        </BorderBox>
      </div>

      <!-- 中间面板 50% -->
      <div class="panel panel-center">
        <!-- 指标卡片 -->
        <div class="metrics-row">
          <BorderBox class="metric-card">
            <div class="metric-label">总销售额</div>
            <DigitalFlop
              :value="store.realTimeMetric.totalSales || store.overview.totalSales"
              prefix="¥"
              unit="万元"
              :fontSize="28"
            />
            <div class="metric-trend">
              <span :class="store.overview.salesGrowth >= 0 ? 'text-green' : 'text-red'">
                同比 {{ store.overview.salesGrowth >= 0 ? '↑' : '↓' }}{{ Math.abs(store.overview.salesGrowth).toFixed(1) }}%
              </span>
            </div>
          </BorderBox>

          <BorderBox class="metric-card">
            <div class="metric-label">用户总数</div>
            <DigitalFlop
              :value="store.realTimeMetric.totalUsers || store.overview.totalUsers"
              unit="人"
              :fontSize="28"
            />
            <div class="metric-trend">
              <span :class="store.overview.usersGrowth >= 0 ? 'text-green' : 'text-red'">
                同比 {{ store.overview.usersGrowth >= 0 ? '↑' : '↓' }}{{ Math.abs(store.overview.usersGrowth).toFixed(1) }}%
              </span>
            </div>
          </BorderBox>

          <BorderBox class="metric-card">
            <div class="metric-label">转化率</div>
            <DigitalFlop
              :value="store.realTimeMetric.conversionRate || store.overview.conversionRate"
              suffix="%"
              :fontSize="28"
              color="#7b2ff7"
            />
            <div class="metric-trend">
              <span class="text-purple">实时更新</span>
            </div>
          </BorderBox>
        </div>

        <!-- 中国地图 -->
        <BorderBox title="全国销售分布" class="panel-item chart-height-map">
          <MapChart :data="provinceMapData" :loading="store.skeletonVisible" />
        </BorderBox>

        <!-- 趋势图 -->
        <BorderBox class="panel-item chart-height-md">
          <template #title>
            <div class="chart-title-bar">
              <span>销售趋势</span>
              <div class="time-range-switch">
                <button
                  v-for="range in timeRanges"
                  :key="range.value"
                  :class="{ active: store.timeRange === range.value }"
                  @click="store.setTimeRange(range.value as any)"
                >
                  {{ range.label }}
                </button>
              </div>
            </div>
          </template>
          <LineChart :key="store.timeRange" :data="store.salesTrend" :timeRange="store.timeRange" :loading="store.skeletonVisible" />
        </BorderBox>
      </div>

      <!-- 右侧面板 25% -->
      <div class="panel panel-right">
        <BorderBox title="实时销售趋势" class="panel-item chart-height-lg">
          <LineChart :data="store.salesTrend" :timeRange="store.timeRange" :loading="store.skeletonVisible" />
        </BorderBox>

        <BorderBox title="核心指标监控" class="panel-item chart-height-md">
          <GaugeChart :data="gaugeData" :loading="store.skeletonVisible" />
        </BorderBox>

        <BorderBox title="告警信息" class="panel-item chart-height-lg">
          <div class="alert-list">
            <div
              v-for="alert in store.alerts.slice(0, 6)"
              :key="alert.id"
              class="alert-item"
              :class="'alert-' + alert.level"
            >
              <span class="alert-icon">
                {{ alert.level === 'error' ? '⚠' : alert.level === 'warning' ? '⚡' : 'ℹ' }}
              </span>
              <span class="alert-msg">{{ alert.message }}</span>
              <span class="alert-time">{{ alert.time }}</span>
            </div>
            <div v-if="store.alerts.length === 0" class="alert-empty">
              暂无告警信息
            </div>
          </div>
        </BorderBox>
      </div>
    </div>

    <!-- 底部滚动消息条 -->
    <footer class="dashboard-footer">
      <div class="scrolling-message">
        <span class="message-label">实时消息</span>
        <div class="message-content">
          <span
            v-for="(alert, i) in store.alerts"
            :key="i"
            class="message-item"
          >
            【{{ alert.time }}】{{ alert.message }}
          </span>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useDashboardStore } from '@/stores/dashboard'
import { formatTime } from '@/utils/dataTransform'

import BorderBox from '@/components/BorderBox/index.vue'
import DigitalFlop from '@/components/DigitalFlop/index.vue'
import ScrollTable from '@/components/ScrollTable/index.vue'
import BarChart from '@/components/BarChart/index.vue'
import LineChart from '@/components/LineChart/index.vue'
import PieChart from '@/components/PieChart/index.vue'
import MapChart from '@/components/MapChart/index.vue'
import GaugeChart from '@/components/GaugeChart/index.vue'

const store = useDashboardStore()

// 自适应缩放
const scale = ref(1)

function updateScale() {
  const designW = 1920
  const designH = 1080
  const scaleX = window.innerWidth / designW
  const scaleY = window.innerHeight / designH
  scale.value = Math.min(scaleX, scaleY)
}

// 当前时间
const currentTime = ref('')
let timeTimer: number | null = null

function updateTime() {
  currentTime.value = formatTime(new Date())
}

// 时间范围切换
const timeRanges = [
  { label: '今日', value: 'today' },
  { label: '本周', value: 'week' },
  { label: '本月', value: 'month' },
]

// 列表列定义
const rankingColumns = [
  { title: '排名', key: 'rank', width: '50px' },
  { title: '城市', key: 'city', width: '70px' },
  { title: '销售额', key: 'sales', width: '80px' },
  { title: '增长率', key: 'growth' },
]

// 省份地图数据
const provinceMapData = computed(() =>
  store.regionSales.map((item) => ({
    name: item.name,
    value: item.value,
  })),
)

// 仪表盘数据
const gaugeData = computed(() => [
  { name: '转化率', value: store.realTimeMetric.conversionRate || store.overview.conversionRate, min: 0, max: 100 },
  { name: '增长率', value: Math.abs(store.overview.salesGrowth), min: 0, max: 50 },
  { name: '满意度', value: 92, min: 0, max: 100 },
])

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
  updateTime()
  timeTimer = window.setInterval(updateTime, 1000)

  store.fetchAllData()
  store.initWebSocket()

  // 30秒轮询刷新
  window.setInterval(() => {
    store.fetchOverview()
    store.fetchAlerts()
  }, 30000)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
  if (timeTimer) clearInterval(timeTimer)
})
</script>

<style scoped>
.dashboard {
  width: 1920px;
  height: 1080px;
  background: linear-gradient(135deg, #0a1f44 0%, #0d2b5e 50%, #0a1f44 100%);
  color: #c8d6e5;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transform-origin: left top;
  padding: 0 20px;
}

/* 顶部标题栏 */
.dashboard-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  flex-shrink: 0;
  background: linear-gradient(180deg, rgba(0, 212, 255, 0.1) 0%, transparent 100%);
  border-bottom: 1px solid rgba(0, 212, 255, 0.15);
  padding: 0 20px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-decoration {
  display: inline-block;
  width: 8px;
  height: 8px;
  background: #00d4ff;
  border-radius: 50%;
  box-shadow: 0 0 10px #00d4ff;
}

.header-label {
  font-size: 14px;
  color: #00d4ff;
  letter-spacing: 2px;
}

.header-title {
  font-size: 28px;
  font-weight: bold;
  letter-spacing: 6px;
  background: linear-gradient(90deg, #00d4ff, #7b2ff7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: #8899aa;
}

.header-time {
  font-family: 'Courier New', monospace;
  font-size: 16px;
  color: #00d4ff;
}

.header-divider {
  color: rgba(0, 212, 255, 0.3);
}

.fullscreen-btn {
  background: rgba(0, 212, 255, 0.1);
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #00d4ff;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.fullscreen-btn:hover {
  background: rgba(0, 212, 255, 0.2);
}

/* 主体区域 */
.dashboard-body {
  flex: 1;
  display: flex;
  gap: 12px;
  padding: 12px 0;
  overflow: hidden;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.panel-left {
  width: 25%;
}

.panel-center {
  width: 50%;
}

.panel-right {
  width: 25%;
}

.panel-item {
  flex: 1;
  min-height: 0;
}

.chart-height-lg {
  flex: 2;
}

.chart-height-md {
  flex: 1.2;
}

.chart-height-map {
  flex: 3;
}

/* 指标卡片 */
.metrics-row {
  display: flex;
  gap: 10px;
  flex-shrink: 0;
}

.metric-card {
  flex: 1;
  text-align: center;
}

.metric-label {
  font-size: 13px;
  color: #8899aa;
  margin-bottom: 8px;
  letter-spacing: 1px;
}

.metric-trend {
  margin-top: 6px;
  font-size: 12px;
}

/* 时间范围切换 */
.chart-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.time-range-switch {
  display: flex;
  gap: 2px;
}

.time-range-switch button {
  background: transparent;
  border: 1px solid rgba(0, 212, 255, 0.3);
  color: #8899aa;
  padding: 2px 10px;
  font-size: 12px;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.3s;
}

.time-range-switch button.active {
  background: rgba(0, 212, 255, 0.2);
  color: #00d4ff;
  border-color: #00d4ff;
}

.time-range-switch button:hover {
  border-color: #00d4ff;
}

/* 告警列表 */
.alert-list {
  height: 100%;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.alert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 10px;
  background: rgba(0, 212, 255, 0.05);
  border-left: 3px solid #00d4ff;
  font-size: 12px;
}

.alert-item.alert-error {
  border-left-color: #ff4444;
  background: rgba(255, 68, 68, 0.08);
}

.alert-item.alert-warning {
  border-left-color: #ffd93d;
  background: rgba(255, 217, 61, 0.08);
}

.alert-icon {
  font-size: 14px;
  flex-shrink: 0;
}

.alert-msg {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.alert-time {
  color: #8899aa;
  flex-shrink: 0;
}

.alert-empty {
  text-align: center;
  color: #556677;
  padding: 20px;
}

/* 滚动消息条 */
.dashboard-footer {
  height: 36px;
  flex-shrink: 0;
  border-top: 1px solid rgba(0, 212, 255, 0.15);
  display: flex;
  align-items: center;
  overflow: hidden;
}

.scrolling-message {
  display: flex;
  align-items: center;
  width: 100%;
  overflow: hidden;
}

.message-label {
  color: #00d4ff;
  font-size: 13px;
  padding: 0 16px;
  border-right: 1px solid rgba(0, 212, 255, 0.3);
  white-space: nowrap;
  flex-shrink: 0;
  font-weight: bold;
}

.message-content {
  flex: 1;
  overflow: hidden;
  white-space: nowrap;
  position: relative;
}

.message-content::before {
  content: '';
  animation: scroll-msg 30s linear infinite;
  display: inline-block;
}

/* 排名样式 */
.rank-badge {
  display: inline-block;
  font-size: 14px;
}

/* 颜色工具 */
.text-green { color: #00ff88; }
.text-red { color: #ff4444; }
.text-purple { color: #7b2ff7; }
</style>