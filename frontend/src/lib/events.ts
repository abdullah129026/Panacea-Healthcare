import type { RealtimeEvent, EventHandler, ConnectionStatus } from "@/types/events";

/**
 * Event manager: handles subscription, routing, and handler execution.
 * Works with both polling (mock API) and WebSocket (real backend).
 */

class EventManager {
  private handlers: Map<string, Set<EventHandler>> = new Map();
  private eventQueue: RealtimeEvent[] = [];
  private isProcessing = false;

  /**
   * Subscribe to events of a specific type.
   * Returns an unsubscribe function.
   */
  subscribe<T extends RealtimeEvent>(
    eventType: T["type"],
    handler: EventHandler<T>
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }

    this.handlers.get(eventType)!.add(handler as EventHandler);

    // Return unsubscribe function
    return () => {
      const set = this.handlers.get(eventType);
      if (set) {
        set.delete(handler as EventHandler);
        if (set.size === 0) {
          this.handlers.delete(eventType);
        }
      }
    };
  }

  /**
   * Subscribe to all events (wildcard listener).
   */
  subscribeAll(handler: EventHandler): () => void {
    if (!this.handlers.has("*")) {
      this.handlers.set("*", new Set());
    }

    this.handlers.get("*")!.add(handler);

    return () => {
      const set = this.handlers.get("*");
      if (set) {
        set.delete(handler);
        if (set.size === 0) {
          this.handlers.delete("*");
        }
      }
    };
  }

  /**
   * Emit an event to all subscribed handlers.
   */
  async emit(event: RealtimeEvent): Promise<void> {
    // Add to queue
    this.eventQueue.push(event);

    // Process queue if not already processing
    if (!this.isProcessing) {
      await this.processQueue();
    }
  }

  /**
   * Process queued events in order.
   */
  private async processQueue(): Promise<void> {
    if (this.isProcessing || this.eventQueue.length === 0) {
      return;
    }

    this.isProcessing = true;

    try {
      while (this.eventQueue.length > 0) {
        const event = this.eventQueue.shift()!;
        await this.executeHandlers(event);
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Execute all handlers for a specific event.
   */
  private async executeHandlers(event: RealtimeEvent): Promise<void> {
    // Get type-specific handlers
    const typeHandlers = this.handlers.get(event.type) || new Set();

    // Get wildcard handlers
    const wildcardHandlers = this.handlers.get("*") || new Set();

    // Combine all handlers
    const allHandlers = new Set([...typeHandlers, ...wildcardHandlers]);

    // Execute in parallel (promise.all), but catch individual errors
    const results = await Promise.allSettled(
      Array.from(allHandlers).map((handler) =>
        Promise.resolve(handler(event)).catch((error) => {
          console.error(
            `[EventManager] Error in handler for ${event.type}:`,
            error
          );
          // Don't rethrow — let other handlers continue
        })
      )
    );

    // Log any failures (non-blocking)
    results.forEach((result) => {
      if (result.status === "rejected") {
        console.error("[EventManager] Handler failed:", result.reason);
      }
    });
  }

  /**
   * Get pending events (for debugging or UI).
   */
  getPendingEvents(): RealtimeEvent[] {
    return [...this.eventQueue];
  }

  /**
   * Clear all handlers and queued events.
   */
  reset(): void {
    this.handlers.clear();
    this.eventQueue = [];
    this.isProcessing = false;
  }

  /**
   * Get count of subscribers for a specific event type.
   */
  getSubscriberCount(eventType: string): number {
    return this.handlers.get(eventType)?.size ?? 0;
  }
}

// Global singleton instance
export const eventManager = new EventManager();

/**
 * Utility to create strongly-typed handlers for specific event types.
 */
export function createEventHandler<T extends RealtimeEvent>(
  eventType: T["type"],
  handler: EventHandler<T>
): [eventType: T["type"], handler: EventHandler<T>] {
  return [eventType, handler];
}
