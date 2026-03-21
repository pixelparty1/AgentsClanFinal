import { useState, useEffect, useCallback, useRef } from 'react';
import { client, DATABASE_ID, COLLECTIONS } from '@/lib/appwrite';
import { RealtimeResponseEvent, Models } from 'appwrite';

type SubscriptionCallback<T> = (data: T, event: 'create' | 'update' | 'delete') => void;

/**
 * Hook for subscribing to Appwrite realtime events on a collection
 */
export function useRealtimeCollection<T extends Models.Document>(
  collectionId: string,
  callback: SubscriptionCallback<T>,
  filters?: string[]
) {
  const callbackRef = useRef(callback);
  const [isConnected, setIsConnected] = useState(false);
  const [lastEvent, setLastEvent] = useState<{ data: T; event: string } | null>(null);

  // Keep callback ref updated
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    const channels = [`databases.${DATABASE_ID}.collections.${collectionId}.documents`];

    const unsubscribe = client.subscribe(channels, (response: RealtimeResponseEvent<T>) => {
      setIsConnected(true);
      
      // Determine event type
      const events = response.events;
      let eventType: 'create' | 'update' | 'delete' = 'update';
      
      if (events.some(e => e.includes('.create'))) {
        eventType = 'create';
      } else if (events.some(e => e.includes('.delete'))) {
        eventType = 'delete';
      }

      setLastEvent({ data: response.payload, event: eventType });
      callbackRef.current(response.payload, eventType);
    });

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, [collectionId]);

  return { isConnected, lastEvent };
}

/**
 * Hook for subscribing to order updates
 */
export function useRealtimeOrders(
  onOrderUpdate: (order: Models.Document, event: 'create' | 'update' | 'delete') => void
) {
  return useRealtimeCollection(COLLECTIONS.ORDERS, onOrderUpdate);
}

/**
 * Hook for subscribing to quest submission updates
 */
export function useRealtimeQuestSubmissions(
  onSubmissionUpdate: (submission: Models.Document, event: 'create' | 'update' | 'delete') => void
) {
  return useRealtimeCollection(COLLECTIONS.QUEST_SUBMISSIONS, onSubmissionUpdate);
}

/**
 * Hook for subscribing to membership updates
 */
export function useRealtimeMemberships(
  onMembershipUpdate: (membership: Models.Document, event: 'create' | 'update' | 'delete') => void
) {
  return useRealtimeCollection(COLLECTIONS.MEMBERSHIPS, onMembershipUpdate);
}

/**
 * Hook for subscribing to event updates
 */
export function useRealtimeEvents(
  onEventUpdate: (event: Models.Document, eventType: 'create' | 'update' | 'delete') => void
) {
  return useRealtimeCollection(COLLECTIONS.EVENTS, onEventUpdate);
}

/**
 * Hook for subscribing to announcements
 */
export function useRealtimeAnnouncements(
  onAnnouncementUpdate: (announcement: Models.Document, event: 'create' | 'update' | 'delete') => void
) {
  return useRealtimeCollection(COLLECTIONS.ANNOUNCEMENTS, onAnnouncementUpdate);
}

/**
 * Hook for subscribing to user-specific updates (membership, orders)
 */
export function useRealtimeUserUpdates(
  walletAddress: string,
  callbacks: {
    onMembershipUpdate?: (membership: Models.Document) => void;
    onOrderUpdate?: (order: Models.Document) => void;
    onXPUpdate?: (xp: number) => void;
  }
) {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const channels = [
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.MEMBERSHIPS}.documents`,
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.ORDERS}.documents`,
    ];

    const unsubscribe = client.subscribe(channels, (response: RealtimeResponseEvent<Models.Document>) => {
      setIsConnected(true);
      const payload = response.payload as Models.Document & { wallet_address?: string; user_wallet?: string; xp_balance?: number };

      // Filter by wallet address (check both fields for compatibility)
      const payloadWallet = payload.wallet_address || payload.user_wallet;
      if (payloadWallet !== walletAddress) return;

      // Determine which collection was updated
      if (response.events.some(e => e.includes(COLLECTIONS.MEMBERSHIPS))) {
        callbacks.onMembershipUpdate?.(payload);
        if (payload.xp_balance !== undefined) {
          callbacks.onXPUpdate?.(payload.xp_balance);
        }
      } else if (response.events.some(e => e.includes(COLLECTIONS.ORDERS))) {
        callbacks.onOrderUpdate?.(payload);
      }
    });

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, [walletAddress, callbacks]);

  return { isConnected };
}

/**
 * Hook for admin dashboard realtime stats
 */
export function useRealtimeAdminStats() {
  const [stats, setStats] = useState({
    newOrders: 0,
    pendingSubmissions: 0,
    newMemberships: 0,
    newApplications: 0,
  });
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const channels = [
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.ORDERS}.documents`,
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.QUEST_SUBMISSIONS}.documents`,
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.MEMBERSHIPS}.documents`,
      `databases.${DATABASE_ID}.collections.${COLLECTIONS.JOB_APPLICATIONS}.documents`,
    ];

    const unsubscribe = client.subscribe(channels, (response: RealtimeResponseEvent<Models.Document>) => {
      setIsConnected(true);
      
      if (!response.events.some(e => e.includes('.create'))) return;
      
      const payload = response.payload as Models.Document & { status?: string };

      setStats(prev => {
        if (response.events.some(e => e.includes(COLLECTIONS.ORDERS))) {
          return { ...prev, newOrders: prev.newOrders + 1 };
        }
        if (response.events.some(e => e.includes(COLLECTIONS.QUEST_SUBMISSIONS))) {
          if (payload.status === 'pending') {
            return { ...prev, pendingSubmissions: prev.pendingSubmissions + 1 };
          }
        }
        if (response.events.some(e => e.includes(COLLECTIONS.MEMBERSHIPS))) {
          return { ...prev, newMemberships: prev.newMemberships + 1 };
        }
        if (response.events.some(e => e.includes(COLLECTIONS.JOB_APPLICATIONS))) {
          return { ...prev, newApplications: prev.newApplications + 1 };
        }
        return prev;
      });
    });

    return () => {
      unsubscribe();
      setIsConnected(false);
    };
  }, []);

  const resetStats = useCallback(() => {
    setStats({
      newOrders: 0,
      pendingSubmissions: 0,
      newMemberships: 0,
      newApplications: 0,
    });
  }, []);

  return { stats, isConnected, resetStats };
}

/**
 * Hook for product inventory updates
 */
export function useRealtimeInventory(
  onProductUpdate: (product: Models.Document) => void
) {
  const [lowStockAlerts, setLowStockAlerts] = useState<Models.Document[]>([]);

  const handleProductUpdate = useCallback((product: Models.Document) => {
    onProductUpdate(product);
    
    const typedProduct = product as Models.Document & { stock?: number; is_active?: boolean };

    // Check for low stock
    if ((typedProduct.stock ?? 0) <= 5 && typedProduct.is_active) {
      setLowStockAlerts(prev => {
        const existing = prev.find(p => p.$id === product.$id);
        if (existing) {
          return prev.map(p => p.$id === product.$id ? product : p);
        }
        return [...prev, product];
      });
    } else {
      setLowStockAlerts(prev => prev.filter(p => p.$id !== product.$id));
    }
  }, [onProductUpdate]);

  const { isConnected } = useRealtimeCollection(COLLECTIONS.PRODUCTS, handleProductUpdate);

  const clearAlert = useCallback((productId: string) => {
    setLowStockAlerts(prev => prev.filter(p => p.$id !== productId));
  }, []);

  return { isConnected, lowStockAlerts, clearAlert };
}
