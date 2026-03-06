import Redis from 'ioredis'
import { prisma } from '@/lib/prisma'

/**
 * Event Service — Redis Pub/Sub for real-time notifications.
 * Used to emit events to specific users or entire batches.
 */

// Create a dedicated publisher connection (separate from the main redis client)
let publisher: Redis | null = null

function getPublisher(): Redis {
    if (!publisher) {
        publisher = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
        })
    }
    return publisher
}

// Event structure
export interface SSEEvent {
    type: string
    data: Record<string, unknown>
    timestamp: string
}

/**
 * Emit an event to a specific user via Redis Pub/Sub.
 */
export async function emitToUser(userId: string, event: Omit<SSEEvent, 'timestamp'>) {
    const pub = getPublisher()
    const fullEvent: SSEEvent = {
        ...event,
        timestamp: new Date().toISOString(),
    }
    await pub.publish(`channel:user:${userId}`, JSON.stringify(fullEvent))
}

/**
 * Emit an event to all students in a batch.
 */
export async function emitToBatch(batchId: string, event: Omit<SSEEvent, 'timestamp'>) {
    const students = await prisma.batchStudent.findMany({
        where: { batchId },
        select: { studentId: true },
    })

    const promises = students.map(s => emitToUser(s.studentId, event))
    await Promise.allSettled(promises)
}

/**
 * Create a new Redis subscriber for a specific user channel.
 * Returns the subscriber instance for cleanup.
 */
export function createSubscriber(userId: string, onMessage: (event: SSEEvent) => void) {
    const subscriber = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
        maxRetriesPerRequest: null,
        enableReadyCheck: false,
    })

    const channel = `channel:user:${userId}`

    subscriber.subscribe(channel, (err) => {
        if (err) console.error(`[SSE] Failed to subscribe to ${channel}:`, err)
    })

    subscriber.on('message', (_channel: string, message: string) => {
        try {
            const event = JSON.parse(message) as SSEEvent
            onMessage(event)
        } catch (err) {
            console.error('[SSE] Failed to parse event:', err)
        }
    })

    return subscriber
}
