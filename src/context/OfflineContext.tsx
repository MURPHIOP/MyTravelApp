'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  enqueueMutation,
  getPendingMutations,
  removeMutation,
  updateMutationStatus,
} from '@/lib/offlineDb';

interface OfflineContextType {
  isOnline: boolean;
  isSyncing: boolean;
  pendingCount: number;
  lastSyncTime: Date | null;
  enqueueExpenseAction: (type: 'CREATE' | 'UPDATE' | 'DELETE', payload: Record<string, unknown>) => Promise<void>;
  syncNow: () => Promise<void>;
}

const OfflineContext = createContext<OfflineContextType | undefined>(undefined);

export function OfflineProvider({ children }: { children: React.ReactNode }) {
  const [isOnline, setIsOnline] = useState<boolean>(() => {
    if (typeof window !== 'undefined' && typeof navigator !== 'undefined') {
      return navigator.onLine;
    }
    return true;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [pendingCount, setPendingCount] = useState<number>(0);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [showSyncedNotice, setShowSyncedNotice] = useState<boolean>(false);

  // Refresh pending count from IndexedDB
  const refreshPendingCount = useCallback(async () => {
    try {
      const items = await getPendingMutations();
      setPendingCount(items.length);
    } catch {
      setPendingCount(0);
    }
  }, []);

  // Background reconciliation sync loop
  const syncNow = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.onLine) {
      return;
    }

    try {
      setIsSyncing(true);
      const mutations = await getPendingMutations();

      if (mutations.length === 0) {
        setPendingCount(0);
        setIsSyncing(false);
        return;
      }

      for (const mut of mutations) {
        await updateMutationStatus(mut.id, 'SYNCING');

        try {
          if (mut.type === 'CREATE') {
            const payloadToInsert = { ...mut.payload };
            // If ID was temporarily generated on client, remove it so Supabase assigns a fresh UUID
            if (typeof payloadToInsert.id === 'string' && payloadToInsert.id.startsWith('offline-')) {
              delete payloadToInsert.id;
            }
            const { error } = await supabase.from('expenses').insert([payloadToInsert]);
            if (error) throw error;
          } else if (mut.type === 'UPDATE') {
            const targetId = mut.payload.id as string;
            const updateData = { ...mut.payload };
            delete updateData.id;
            const { error } = await supabase.from('expenses').update(updateData).eq('id', targetId);
            if (error) throw error;
          } else if (mut.type === 'DELETE') {
            const targetId = mut.payload.id as string;
            const { error } = await supabase.from('expenses').delete().eq('id', targetId);
            if (error) throw error;
          }

          // Successfully processed mutation
          await removeMutation(mut.id);
        } catch (err) {
          console.error(`[OfflineSync] Mutation ${mut.id} failed:`, err);
          await updateMutationStatus(mut.id, 'FAILED', (mut.retryCount || 0) + 1);
          // If network dropped mid-sync, break and retry on next online event
          if (!navigator.onLine) break;
        }
      }

      const remaining = await getPendingMutations();
      setPendingCount(remaining.length);
      setLastSyncTime(new Date());

      // If all mutations synced, notify listeners and show brief success pill
      if (remaining.length === 0) {
        setShowSyncedNotice(true);
        setTimeout(() => setShowSyncedNotice(false), 3500);
      }

      // Notify other views (e.g. expenses page) that fresh data is available
      window.dispatchEvent(new CustomEvent('expenses-synced'));
    } catch (err) {
      console.error('[OfflineSync] Sync loop error:', err);
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Enqueue mutation into IndexedDB queue
  const enqueueExpenseAction = useCallback(
    async (type: 'CREATE' | 'UPDATE' | 'DELETE', payload: Record<string, unknown>) => {
      await enqueueMutation(type, 'expenses', payload);
      await refreshPendingCount();

      // If online, immediately attempt background sync
      if (navigator.onLine) {
        syncNow();
      }
    },
    [refreshPendingCount, syncNow]
  );

  // Network status listeners & Service Worker registration
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let ignore = false;

    async function loadPending() {
      try {
        const items = await getPendingMutations();
        if (!ignore) {
          setPendingCount(items.length);
        }
      } catch {
        if (!ignore) {
          setPendingCount(0);
        }
      }
    }

    loadPending();

    const handleOnline = () => {
      setIsOnline(true);
      syncNow();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Register Service Worker
    if ('serviceWorker' in navigator && process.env.NODE_ENV !== 'test') {
      navigator.serviceWorker
        .register('/sw.js')
        .then((reg) => {
          reg.update().catch(() => {});
        })
        .catch((err) => {
          console.warn('[PWA] ServiceWorker registration failed:', err);
        });
    }

    return () => {
      ignore = true;
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncNow]);

  return (
    <OfflineContext.Provider
      value={{
        isOnline,
        isSyncing,
        pendingCount,
        lastSyncTime,
        enqueueExpenseAction,
        syncNow,
      }}
    >
      {children}

      {/* Floating Tactical PWA Sync Indicator */}
      <div className="fixed bottom-6 right-6 z-50 pointer-events-auto">
        <AnimatePresence>
          {!isOnline && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="p-3 bg-amber-500 text-black border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <WifiOff size={16} className="animate-pulse" />
              <span>OFFLINE MODE {pendingCount > 0 ? `• ${pendingCount} EDITS QUEUED` : '• CACHE ACTIVE'}</span>
            </motion.div>
          )}

          {isOnline && isSyncing && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="p-3 bg-[var(--accent)] text-white border-2 border-[var(--border-color)] font-mono text-xs font-black uppercase flex items-center gap-2.5 shadow-[4px_4px_0px_0px_var(--shadow-color)]"
            >
              <RefreshCw size={16} className="animate-spin" />
              <span>SYNCING {pendingCount} PENDING EDITS...</span>
            </motion.div>
          )}

          {isOnline && !isSyncing && showSyncedNotice && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="p-3 bg-emerald-500 text-white border-2 border-black font-mono text-xs font-black uppercase flex items-center gap-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            >
              <CheckCircle2 size={16} />
              <span>OFFLINE LEDGER RECONCILED ✓</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  const context = useContext(OfflineContext);
  if (!context) {
    throw new Error('useOffline must be used within an OfflineProvider');
  }
  return context;
}
