# 数据可视化大屏 Web 项目架构设计

## 一、前后端架构设计

### 前端架构

text

```
前端技术栈
├── Vue3 + TypeScript (主框架)
├── Vite (构建工具)
├── ECharts 5 (图表库)
├── DataV 或 自定义组件 (大屏装饰组件)
├── Pinia (状态管理)
├── Axios (HTTP请求)
├── WebSocket (实时数据推送)
└── 方案二：React + TypeScript + Ant Design + ECharts
```



### 后端架构

text

```
后端技术栈
├── Node.js (Express/Koa) 或 Python (FastAPI/Django)
├── Redis (缓存层)
├── WebSocket (实时推送)
├── MySQL/PostgreSQL (关系型数据)
├── ClickHouse/InfluxDB (时序数据)
└── Nginx (反向代理+静态资源)
```



------

## 二、完整提示词（可直接使用）

以下提示词可以直接复制给 AI 工具（如 Cursor、Copilot 等）生成代码。

### 提示词 1：完整前端大屏项目

text

```
我需要创建一个数据可视化大屏的Web前端项目，请按照以下要求生成完整代码：

【技术栈】
- Vue 3 + TypeScript + Vite
- ECharts 5 用于图表
- Pinia 状态管理
- Axios HTTP请求
- WebSocket 实时数据连接
- 自定义大屏装饰组件（边框、数字翻牌器、滚动表格）

【项目结构】
src/
├── components/
│   ├── BorderBox/        # 边框装饰组件
│   ├── DigitalFlop/      # 数字翻牌器组件
│   ├── ScrollTable/      # 滚动表格组件
│   ├── BarChart/         # 柱状图组件
│   ├── LineChart/        # 折线图组件
│   ├── PieChart/         # 饼图组件
│   ├── MapChart/         # 地图组件
│   └── GaugeChart/       # 仪表盘组件
├── views/
│   └── Dashboard/        # 大屏主页面
├── stores/
│   └── dashboard.ts      # 数据状态管理
├── api/
│   ├── request.ts        # Axios封装
│   ├── websocket.ts      # WebSocket连接
│   └── dashboard.ts      # 接口定义
├── utils/
│   └── dataTransform.ts  # 数据转换工具
└── types/
    └── dashboard.ts      # TypeScript类型定义

【大屏布局要求】
- 1920*1080分辨率适配，使用rem/scale等比缩放
- 深色科技风主题（深蓝背景#0a1f44，霓虹蓝#00d4ff，渐变紫#7b2ff7）
- 顶部标题栏：大屏名称+实时时间+天气信息
- 左侧面板(25%)：2个图表（柱状图+饼图）+ 1个滚动表格
- 中间面板(50%)：核心地图+3个数字翻牌器指标卡片
- 右侧面板(25%)：2个图表（折线图+仪表盘）+ 1个排名列表
- 底部：实时滚动消息条

【数据接口模拟】
1. 模拟销售数据：全国各省份销售额、订单量、增长率
2. 模拟实时指标：总销售额、用户数、转化率(每秒变化)
3. 模拟排行榜：Top10城市销售排名
4. 模拟趋势数据：过去24小时/7天/30天的数据趋势
5. 模拟告警信息：系统告警滚动消息

【核心功能要求】
1. 全屏切换功能
2. 每个图表支持独立刷新(30秒轮询)
3. WebSocket接收实时数据更新（数字翻牌器+告警信息）
4. 图表自适应窗口大小变化
5. 数据加载骨架屏效果
6. 异常数据高亮闪烁提示
7. 定时切换数据维度(如：今日/本周/本月)

请生成所有必要的文件，包括package.json配置、vite配置、以及完整的Vue组件代码。
确保代码可以直接运行，数据使用模拟数据。
```



------

### 提示词 2：后端服务架构

text

```
我需要创建一个数据可视化大屏的后端服务，请按照以下要求生成完整代码：

【技术栈】
- Node.js + Express + TypeScript
- Redis 缓存
- WebSocket (ws库)
- MySQL 数据库
- 定时任务 (node-cron)

【项目结构】
src/
├── controllers/
│   ├── dashboard.ts      # 大屏数据控制器
│   ├── charts.ts         # 图表数据控制器
│   └── realtime.ts       # 实时数据控制器
├── services/
│   ├── dataService.ts    # 数据处理服务
│   └── cacheService.ts   # 缓存服务
├── models/
│   ├── sales.ts          # 销售数据模型
│   └── metrics.ts        # 指标数据模型
├── routes/
│   └── index.ts          # 路由配置
├── middleware/
│   ├── errorHandler.ts   # 错误处理
│   └── logger.ts         # 日志中间件
├── websocket/
│   └── handler.ts        # WebSocket处理
├── jobs/
│   └── dataSimulator.ts  # 数据模拟定时任务
├── config/
│   └── index.ts          # 配置文件
└── app.ts               # 应用入口

【API接口设计】
1. GET /api/dashboard/overview     - 获取概览数据（总销售额、用户数、订单量）
2. GET /api/charts/sales-by-region - 获取各地区销售数据（柱状图）
3. GET /api/charts/sales-trend     - 获取销售趋势（折线图，支持时间范围参数）
4. GET /api/charts/category-ratio  - 获取品类占比（饼图）
5. GET /api/charts/ranking         - 获取排行榜数据
6. GET /api/charts/real-time-metrics - 获取实时指标
7. GET /api/alerts                - 获取告警信息
8. WebSocket /ws/realtime         - 实时数据推送

【数据模拟要求】
- 生成逼真的销售数据，包含日周期波动、周周期波动
- 实时指标每秒随机变化（±5%范围内）
- 告警信息按概率随机产生
- 支持历史数据回填（生成过去30天数据）

【性能要求】
- Redis缓存热点数据，TTL=30秒
- 接口响应时间<200ms
- WebSocket推送频率：指标数据每秒1次，告警数据按需推送
- 数据库连接池管理
- 请求频率限制（rate-limit）

【环境配置】
- MySQL连接配置
- Redis连接配置
- WebSocket端口配置
- CORS跨域配置
- 日志级别配置

请生成所有必要的文件，包括package.json、tsconfig.json、数据库初始化脚本。
确保包含错误处理、日志记录和健康检查接口。
```



------

### 提示词 3：大屏核心组件详细实现

text

```
请为我生成数据可视化大屏的核心组件代码，要求基于Vue3+TypeScript+ECharts：

【组件1：数字翻牌器 DigitalFlop】
功能要求：
- 数字滚动动画效果，从旧值平滑过渡到新值
- 支持前缀、后缀、单位显示
- 支持千分位格式化
- 接收props：value(数字)、duration(动画时长)、format(格式化规则)
- 数字颜色根据增长/下降变绿/红
- 高度可配置的字体大小和颜色

【组件2：装饰边框 BorderBox】
功能要求：
- 科技感边框装饰，包含四个角的装饰元素
- 边框呼吸灯效果（可选开关）
- 顶部带标题栏
- 支持不同尺寸自适应
- 插槽(slot)放置内部内容
- props：title、borderColor、backgroundColor

【组件3：滚动表格 ScrollTable】
功能要求：
- 数据行自动向上滚动
- 鼠标悬停暂停滚动
- 支持表头固定
- 行数据支持自定义渲染（如：排名图标、进度条）
- props：columns(列定义)、data(数据)、speed(滚动速度)
- 无缝滚动衔接

【组件4：实时折线图 RealTimeLineChart】
功能要求：
- 支持动态添加数据点（模拟实时数据流入）
- X轴自动滚动，保留最近N个数据点
- 平滑曲线动画
- 多系列数据支持
- 数据更新时平滑过渡动画
- 支持缩放和tooltip

请为每个组件生成完整的.vue单文件组件代码，包含完整的样式和逻辑。
```



------

## 三、架构设计图

text

```
┌─────────────────────────────────────────────────────────┐
│                     Nginx (反向代理)                      │
└───┬─────────────────────────────────────────────────┬───┘
    │                                                 │
┌───▼──────────────┐                          ┌──────▼──────────┐
│   前端静态资源    │                          │   后端API服务    │
│  Vue3 + ECharts  │◄──── HTTP/WebSocket ────►│  Express/FastAPI │
│  大屏可视化页面   │                          │  数据处理+缓存   │
└──────────────────┘                          └──────┬──────────┘
                                                     │
                                    ┌────────────────┼────────────────┐
                                    │                │                │
                              ┌─────▼─────┐  ┌──────▼──────┐  ┌─────▼─────┐
                              │   Redis   │  │   MySQL/    │  │ ClickHouse│
                              │  缓存层   │  │ PostgreSQL  │  │  时序库   │
                              └───────────┘  └─────────────┘  └───────────┘
```



------

## 四、使用建议

### 1. 分阶段生成

- 先用提示词 1 生成前端基础框架
- 再用提示词 3 细化组件
- 最后用提示词 2 生成后端

### 2. 定制化修改

根据实际业务需求调整：

- 图表类型和数量
- 数据接口字段
- 主题配色方案
- 刷新频率和动画效果

### 3. 扩展方向

- 添加用户认证
- 支持多页面切换
- 添加数据导出功能
- 接入真实数据源

### 4. 部署建议

- 前端使用 Nginx 部署，配置 gzip 压缩
- 后端使用 PM2 进程守护
- WebSocket 使用独立端口或路径升级
- 大屏客户端建议使用 Chrome 全屏模式