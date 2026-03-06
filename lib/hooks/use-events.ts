'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

interface SSEEvent {
    type: string
    data: Record<string, unknown>
    timestamp: string
}

interface UseEventsOptions {
    enabled?: boolean
}

/**
 * React hook for consuming Server-Sent Events.
 * 
 * Usage:
 * ```tsx
 * const { connected, lastEvent } = useEvents((event) => {
 *   if (event.type === 'feedback:ready') {
 *     // Refresh results page
 *   }
 * })
 * ```
 */
export function useEvents(
    onEvent: (event: SSEEvent) => void,
    options: UseEventsOptions = {}
) {
    const { enabled = true } = options
    const [connected, setConnected] = useState(false)
    const [lastEvent, setLastEvent] = useState<SSEEvent | null>(null)
    const eventSourceRef = useRef<EventSource | null>(null)
    const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
    const reconnectAttemptRef = useRef(0)
    const onEventRef = useRef(onEvent)

    // Keep callback ref up-to-date without re-triggering effect
    onEventRef.current = onEvent

    const connect = useCallback(() => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close()
        }

        const es = new EventSource('/api/events/stream')
        eventSourceRef.current = es

        es.onopen = () => {
            setConnected(true)
            reconnectAttemptRef.current = 0
        }

        es.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data) as SSEEvent
                setLastEvent(parsed)
                onEventRef.current(parsed)
            } catch {
                // Ignore parse errors (e.g., ping)
            }
        }

        es.onerror = () => {
            setConnected(false)
            es.close()

            // Exponential backoff reconnect
            const attempt = reconnectAttemptRef.current
            const delay = Math.min(1000 * Math.pow(2, attempt), 30000) // Max 30s
            reconnectAttemptRef.current++

            reconnectTimeoutRef.current = setTimeout(() => {
                if (enabled) connect()
            }, delay)
        }
    }, [enabled])

    useEffect(() => {
        if (!enabled) return

        connect()

        return () => {
            if (eventSourceRef.current) {
                eventSourceRef.current.close()
                eventSourceRef.current = null
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current)
            }
        }
    }, [enabled, connect])

    return { connected, lastEvent }
}
