'use client'

import { useEffect, useRef, useCallback } from 'react'
import type { BudgetEvent } from '../lib/events'

type EventHandler = (event: BudgetEvent) => void

/**
 * Hook to subscribe to Server-Sent Events for real-time updates
 * 
 * @param onEvent - Callback fired when server pushes an event
 * @param enabled - Whether to connect (default: true)
 */
export function useServerEvents(onEvent: EventHandler, enabled = true): void {
  const eventSourceRef = useRef<EventSource | null>(null)
  const onEventRef = useRef(onEvent)
  
  // Keep callback ref fresh without reconnecting
  useEffect(() => {
    onEventRef.current = onEvent
  }, [onEvent])

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
    }

    const es = new EventSource('/api/events')
    eventSourceRef.current = es

    es.onmessage = (e) => {
      try {
        const event = JSON.parse(e.data) as BudgetEvent
        if (event.type !== 'ping') {
          onEventRef.current(event)
        }
      } catch (err) {
        console.error('SSE parse error:', err)
      }
    }

    es.onerror = () => {
      // EventSource auto-reconnects, but we can log it
      console.log('SSE connection error, will retry...')
    }

    return es
  }, [])

  useEffect(() => {
    if (!enabled) {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
        eventSourceRef.current = null
      }
      return
    }

    const es = connect()

    return () => {
      es.close()
      eventSourceRef.current = null
    }
  }, [enabled, connect])
}
