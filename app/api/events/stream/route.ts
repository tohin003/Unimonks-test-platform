import { NextRequest } from 'next/server'
import { getSessionFromRequest } from '@/lib/session'
import { createSubscriber, SSEEvent } from '@/lib/services/event-service'

/**
 * SSE Endpoint — Server-Sent Events stream.
 * 
 * GET /api/events/stream
 * - Authenticated (any role)
 * - Returns a long-lived ReadableStream
 * - Subscribes to Redis channel for the authenticated user
 * - Sends heartbeat every 30 seconds
 */
export async function GET(req: NextRequest) {
    const session = getSessionFromRequest(req)

    if (!session) {
        return new Response(JSON.stringify({ error: true, message: 'Authentication required' }), {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
        })
    }

    const userId = session.userId

    const stream = new ReadableStream({
        start(controller) {
            const encoder = new TextEncoder()

            // Send initial connection event
            controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: 'connected', data: { userId } })}\n\n`))

            // Subscribe to user's Redis channel
            const subscriber = createSubscriber(userId, (event: SSEEvent) => {
                try {
                    controller.enqueue(encoder.encode(`data: ${JSON.stringify(event)}\n\n`))
                } catch {
                    // Stream is closed
                }
            })

            // Heartbeat every 30 seconds to keep connection alive
            const heartbeatInterval = setInterval(() => {
                try {
                    controller.enqueue(encoder.encode(`:ping\n\n`))
                } catch {
                    clearInterval(heartbeatInterval)
                }
            }, 30000)

            // Cleanup on close
            req.signal.addEventListener('abort', () => {
                clearInterval(heartbeatInterval)
                subscriber.unsubscribe()
                subscriber.quit()
            })
        },
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
