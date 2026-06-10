type MessageHandler = (data: any) => void

class WebSocketClient {
  private ws: WebSocket | null = null
  private url: string
  private handlers: Map<string, Set<MessageHandler>> = new Map()
  private reconnectTimer: number | null = null
  private heartbeatTimer: number | null = null
  private reconnectDelay = 3000

  constructor(url: string) {
    this.url = url
  }

  connect(): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) return

    this.ws = new WebSocket(this.url)

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.startHeartbeat()
    }

    this.ws.onmessage = (event) => {
      try {
        const { type, data } = JSON.parse(event.data)
        const handlers = this.handlers.get(type)
        if (handlers) {
          handlers.forEach((handler) => handler(data))
        }
      } catch (e) {
        console.error('WebSocket message parse error:', e)
      }
    }

    this.ws.onclose = () => {
      console.log('WebSocket disconnected')
      this.stopHeartbeat()
      this.scheduleReconnect()
    }

    this.ws.onerror = (e) => {
      console.error('WebSocket error:', e)
    }
  }

  on(type: string, handler: MessageHandler): void {
    if (!this.handlers.has(type)) {
      this.handlers.set(type, new Set())
    }
    this.handlers.get(type)!.add(handler)
  }

  off(type: string, handler: MessageHandler): void {
    const handlers = this.handlers.get(type)
    if (handlers) {
      handlers.delete(handler)
    }
  }

  disconnect(): void {
    this.stopHeartbeat()
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  private startHeartbeat(): void {
    this.heartbeatTimer = window.setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }))
      }
    }, 15000)
  }

  private stopHeartbeat(): void {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
  }

  private scheduleReconnect(): void {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }
    this.reconnectTimer = window.setTimeout(() => {
      console.log('WebSocket reconnecting...')
      this.connect()
    }, this.reconnectDelay)
  }
}

export const wsClient = new WebSocketClient(`ws://${location.host}/ws/realtime`)