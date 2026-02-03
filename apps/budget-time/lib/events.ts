/**
 * Server-Sent Events broadcaster
 * 
 * Simple in-memory pub/sub for pushing real-time updates to connected clients.
 * For a family app with a few devices, this works great.
 * If scaling to multiple server instances, swap to Redis pub/sub.
 */

export type BudgetEvent = 
  | { type: 'connected' }
  | { type: 'timer_started'; kidId: number; budgetTypeId?: number; earningTypeId?: number }
  | { type: 'timer_stopped'; kidId: number; elapsedSeconds: number }
  | { type: 'balance_updated'; kidId: number; budgetTypeId: number; remainingSeconds: number }
  | { type: 'bonus_added'; kidId: number; budgetTypeId: number; minutes: number }
  | { type: 'balances_reset'; kidId: number }
  | { type: 'config_updated' }
  | { type: 'ping' }

type Subscriber = (event: BudgetEvent) => void

class EventBroadcaster {
  private subscribers = new Set<Subscriber>()

  subscribe(callback: Subscriber): () => void {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  emit(event: BudgetEvent): void {
    for (const subscriber of this.subscribers) {
      try {
        subscriber(event)
      } catch (err) {
        console.error('SSE subscriber error:', err)
      }
    }
  }

  get subscriberCount(): number {
    return this.subscribers.size
  }
}

// Singleton instance
export const eventBroadcaster = new EventBroadcaster()
