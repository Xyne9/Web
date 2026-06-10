import { Request, Response } from 'express'
import { DataService } from '../services/dataService'

const dataService = new DataService()

export async function getOverview(_req: Request, res: Response) {
  try {
    const data = dataService.getOverview()
    res.json({ code: 0, data })
  } catch (err: any) {
    res.status(500).json({ code: -1, message: err.message })
  }
}

export async function getSalesByRegion(_req: Request, res: Response) {
  try {
    const data = dataService.getRegionSales()
    res.json({ code: 0, data })
  } catch (err: any) {
    res.status(500).json({ code: -1, message: err.message })
  }
}

export async function getSalesTrend(req: Request, res: Response) {
  try {
    const range = (req.query.range as string) || 'today'
    const validRanges = ['today', 'week', 'month']
    if (!validRanges.includes(range)) {
      return res.status(400).json({ code: -1, message: `Invalid range. Must be one of: ${validRanges.join(', ')}` })
    }
    const data = dataService.getSalesTrend(range as 'today' | 'week' | 'month')
    res.json({ code: 0, data })
  } catch (err: any) {
    res.status(500).json({ code: -1, message: err.message })
  }
}

export async function getCategoryRatio(_req: Request, res: Response) {
  try {
    const data = dataService.getCategoryRatio()
    res.json({ code: 0, data })
  } catch (err: any) {
    res.status(500).json({ code: -1, message: err.message })
  }
}

export async function getRanking(_req: Request, res: Response) {
  try {
    const data = dataService.getRanking()
    res.json({ code: 0, data })
  } catch (err: any) {
    res.status(500).json({ code: -1, message: err.message })
  }
}

export async function getRealTimeMetrics(_req: Request, res: Response) {
  try {
    const data = dataService.getRealTimeMetrics()
    res.json({ code: 0, data })
  } catch (err: any) {
    res.status(500).json({ code: -1, message: err.message })
  }
}

export async function getAlerts(_req: Request, res: Response) {
  try {
    const data = dataService.getAlerts()
    res.json({ code: 0, data })
  } catch (err: any) {
    res.status(500).json({ code: -1, message: err.message })
  }
}