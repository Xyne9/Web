import { Router } from 'express'
import * as dashboardCtrl from '../controllers/dashboard'

const router = Router()

router.get('/dashboard/overview', dashboardCtrl.getOverview)
router.get('/charts/sales-by-region', dashboardCtrl.getSalesByRegion)
router.get('/charts/sales-trend', dashboardCtrl.getSalesTrend)
router.get('/charts/category-ratio', dashboardCtrl.getCategoryRatio)
router.get('/charts/ranking', dashboardCtrl.getRanking)
router.get('/charts/real-time-metrics', dashboardCtrl.getRealTimeMetrics)
router.get('/alerts', dashboardCtrl.getAlerts)

export default router