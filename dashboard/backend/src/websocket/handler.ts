import { WebSocketServer, WebSocket } from 'ws'
import { Server } from 'http'
import { DataService } from '../services/dataService'

export function setupWebSocket(server: Server) {
  const wss = new WebSocketServer({ server, path: '/ws/realtime' })
  const dataService = new DataService()

  wss.on('connection', (ws: WebSocket) => {
    console.log('[ws] client connected')

    // Send real-time metrics every 1 second
    const metricsInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const metrics = dataService.getRealTimeMetrics()
        ws.send(JSON.stringify({ type: 'realtime-metrics', data: metrics }))
      }
    }, 1000)

    // Send alerts every 5 seconds
    const alertsInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        const alerts = dataService.getAlerts()
        if (alerts.length > 0) {
          for (const alert of alerts) {
            ws.send(JSON.stringify({ type: 'alert', data: alert }))
          }
        }
      }
    }, 5000)

    // Handle incoming messages (e.g. ping)
    ws.on('message', (raw: Buffer) => {
      try {
        const msg = JSON.parse(raw.toString())
        if (msg.type === 'ping') {
          ws.send(JSON.stringify({ type: 'pong', timestamp: Date.now() }))
        }
      } catch {
        // Ignore unparseable messages
      }
    })

    // Cleanup on disconnect
    ws.on('close', () => {
      console.log('[ws] client disconnected')
      clearInterval(metricsInterval)
      clearInterval(alertsInterval)
    })

    ws.on('error', (err: Error) => {
      console.error('[ws] error:', err.message)
      clearInterval(metricsInterval)
      clearInterval(alertsInterval)
    })
  })

  console.log('[ws] WebSocket server ready at path /ws/realtime')
}