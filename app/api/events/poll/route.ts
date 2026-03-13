import { NextRequest, NextResponse } from 'next/server'
import { getSessionFromRequest } from '@/lib/session'
import { drainEvents } from '@/lib/services/event-service'

export const dynamic = 'force-dynamic'

/**
 * GET /api/events/poll
 *
 * Short-polling endpoint — replaces the long-lived SSE stream.
 * Returns all pending events for the authenticated user and clears them.
 *
 * Client polls every 3-5 seconds. Each call is a quick serverless
 * function invocation, compatible with Vercel's execution model.
 *
 * Response: { events: SSEEvent[] }
 */
export async function GET(req: NextRequest) {
    const session = getSessionFromRequest(req)

    if (!session) {
        return NextResponse.json({ error: true, message: 'Authentication required' }, { status: 401 })
    }

    const events = await drainEvents(session.userId)

    return NextResponse.json({ events }, {
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
        },
    })
}
