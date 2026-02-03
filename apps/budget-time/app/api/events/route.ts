import { eventBroadcaster, type BudgetEvent } from '../../../lib/events'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(): Promise<Response> {
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection event
      const connectMsg = `data: ${JSON.stringify({ type: 'connected' })}\n\n`
      controller.enqueue(encoder.encode(connectMsg))

      // Subscribe to events
      const unsubscribe = eventBroadcaster.subscribe((event: BudgetEvent) => {
        try {
          const msg = `data: ${JSON.stringify(event)}\n\n`
          controller.enqueue(encoder.encode(msg))
        } catch {
          // Stream closed, will be cleaned up
        }
      })

      // Send keepalive ping every 30s to prevent connection timeout
      const pingInterval = setInterval(() => {
        try {
          const ping = `data: ${JSON.stringify({ type: 'ping' })}\n\n`
          controller.enqueue(encoder.encode(ping))
        } catch {
          clearInterval(pingInterval)
        }
      }, 30000)

      // Cleanup on close - this is a bit tricky with ReadableStream
      // The stream will error when client disconnects
      const cleanup = () => {
        clearInterval(pingInterval)
        unsubscribe()
      }

      // Store cleanup for cancel
      ;(controller as unknown as { _cleanup: () => void })._cleanup = cleanup
    },
    cancel(controller) {
      const cleanup = (controller as unknown as { _cleanup?: () => void })._cleanup
      if (cleanup) cleanup()
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable nginx buffering
    },
  })
}
