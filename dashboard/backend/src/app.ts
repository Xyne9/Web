import express from 'express'
import cors from 'cors'
import http from 'http'
import rateLimit from 'express-rate-limit'
import routes from './routes'
import { setupWebSocket } from './websocket/handler'
import { errorHandler } from './middleware/errorHandler'
import { logger } from './middleware/logger'
import { config } from './config'

const app = express()
const server = http.createServer(app)

// Middleware
app.use(cors({ origin: config.corsOrigin }))
app.use(express.json())
app.use(logger)
app.use(rateLimit(config.rateLimit))

// Routes
app.use('/api', routes)

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() })
})

// Error handler (must be after routes)
app.use(errorHandler)

// WebSocket
setupWebSocket(server)

// Start
server.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`)
  console.log(`WebSocket available at ws://localhost:${config.port}/ws/realtime`)
})

export default app